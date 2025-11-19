const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlPath = path.join(__dirname, '..', 'updated_roster.html');
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

// Parse the HTML table - extract all rows with scout/adult classes
const scoutRowRegex = /<tr class="rowscout[^"]*">(.*?)<\/tr>/g;
const adultRowRegex = /<tr class="rowadult[^"]*">(.*?)<\/tr>/g;

// Extract all scout and adult rows
const allRows = [];
let match;

// Get all rowscout and rowadult rows in order
const rowPattern = /<tr class="row(scout|adult)[^"]*">(.*?)<\/tr>/g;
while ((match = rowPattern.exec(html)) !== null) {
  allRows.push({
    type: match[1], // 'scout' or 'adult'
    html: match[2]
  });
}

const scouts = [];
let currentScout = null;
let scoutCounter = 1;

for (const row of allRows) {
  if (row.type === 'scout') {
    // Extract scout name from link
    const nameMatch = row.html.match(/<a href="[^"]+">([^<]+)<\/a>/);
    if (!nameMatch) continue;

    const name = extractText(nameMatch[1]);

    // Extract rank - look for text directly in td tags (3rd column)
    // Simple approach: split by </td> and get segments
    const tdContents = row.html.split('</td>');
    let rank = '';
    if (tdContents.length >= 3) {
      // Get the 3rd td content (index 2)
      const rankTd = tdContents[2];
      // Extract just the text after the last >
      const textMatch = rankTd.match(/>([^<>]+)$/);
      if (textMatch) {
        rank = textMatch[1].trim();
      } else {
        // If no match, just extract all text
        rank = extractText(rankTd);
      }
    }

    currentScout = {
      id: `scout-${scoutCounter}`,
      name: name,
      slug: slugify(name),
      rank: rank,
      email: '',
      parentName: '',
      parentEmails: [],
      active: true
    };

    scouts.push(currentScout);
    scoutCounter++;
  } else if (row.type === 'adult' && currentScout) {
    // Extract parent name
    const nameMatch = row.html.match(/<a href="[^"]+">([^<]+)<\/a>/);
    if (nameMatch) {
      const parentFullName = extractText(nameMatch[1]);
      // Extract first name from "Lastname, Firstname"
      const parts = parentFullName.split(',').map(p => p.trim());
      const parentFirstName = parts.length >= 2 ? parts[1] : parts[0];

      if (!currentScout.parentName) {
        currentScout.parentName = parentFirstName;
      }
    }

    // Extract parent emails
    const parentEmails = extractEmails(row.html);
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
