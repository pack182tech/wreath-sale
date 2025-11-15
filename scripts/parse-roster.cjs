const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlPath = path.join(__dirname, '..', 'Cub Scout Pack 182 _ Scout with Parents - Active.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Helper function to extract text from HTML
function extractText(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}

// Helper function to extract emails from mailto links
function extractEmails(html) {
  const emails = [];
  const emailRegex = /mailto:([^?"]+)/g;
  let match;
  while ((match = emailRegex.exec(html)) !== null) {
    const email = match[1].trim();
    if (email && !emails.includes(email)) {
      emails.push(email);
    }
  }
  return emails;
}

// Helper function to slugify names
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[,\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Parse the HTML table
const tbody = html.match(/<tbody>([\s\S]*?)<\/tbody>/)[1];
const rows = tbody.split(/<tr class="row/);

const scouts = [];
let currentScout = null;
let scoutCounter = 1;

for (const row of rows) {
  if (!row.trim() || row.indexOf('<th') >= 0) continue;

  const isScoutRow = row.startsWith('scout');
  const isAdultRow = row.startsWith('adult');

  if (isScoutRow) {
    // Extract scout name
    const nameMatch = row.match(/<a href="[^"]+">([^<]+)<\/a>/);
    if (!nameMatch) continue;

    const name = extractText(nameMatch[1]);

    // Extract rank
    const rankMatch = row.match(/<td><span class="nowrap">([^<]+)</);
    const rank = rankMatch ? extractText(rankMatch[1]) : '';

    // Extract scout email
    const scoutEmails = extractEmails(row);

    currentScout = {
      id: `scout-${scoutCounter}`,
      name: name,
      slug: slugify(name),
      rank: rank,
      email: scoutEmails[0] || '',
      parentName: '',
      parentEmails: [],
      active: true
    };

    scouts.push(currentScout);
    scoutCounter++;
  } else if (isAdultRow && currentScout) {
    // Extract parent name
    const nameMatch = row.match(/<a href="[^"]+">([^<]+)<\/a>/);
    if (nameMatch) {
      const parentName = extractText(nameMatch[1]);
      // Remove repeated scout surname from parent name
      const cleanParentName = parentName.replace(/^.*?,\s*/, '');

      if (!currentScout.parentName) {
        currentScout.parentName = cleanParentName;
      }
    }

    // Extract parent emails
    const parentEmails = extractEmails(row);
    for (const email of parentEmails) {
      if (!currentScout.parentEmails.includes(email)) {
        currentScout.parentEmails.push(email);
      }
    }
  }
}

// Output the parsed data
console.log(`Parsed ${scouts.length} scouts`);
console.log('\nSample data:');
console.log(JSON.stringify(scouts.slice(0, 3), null, 2));

// Write to JSON file
const outputPath = path.join(__dirname, '..', 'scouts-data.json');
fs.writeFileSync(outputPath, JSON.stringify(scouts, null, 2));
console.log(`\nWrote scout data to: ${outputPath}`);

// Generate CSV for Google Sheets import
const csvLines = [
  'id,name,slug,rank,email,parentName,parentEmails,active'
];

for (const scout of scouts) {
  const parentEmailsStr = scout.parentEmails.join(';');
  csvLines.push(
    `${scout.id},"${scout.name}",${scout.slug},${scout.rank},${scout.email},"${scout.parentName}","${parentEmailsStr}",${scout.active}`
  );
}

const csvPath = path.join(__dirname, '..', 'scouts-data.csv');
fs.writeFileSync(csvPath, csvLines.join('\n'));
console.log(`Wrote CSV for Google Sheets to: ${csvPath}`);
