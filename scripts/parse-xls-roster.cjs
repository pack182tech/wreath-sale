const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the XLS file
const xlsPath = path.join(__dirname, '..', 'updated_roster.xls');
const workbook = XLSX.readFile(xlsPath);

// Use the "Roster" sheet which has both scout and parent data
const sheetName = 'Roster';
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Loaded ${data.length} rows from spreadsheet`);
console.log('\nColumns found:', Object.keys(data[0] || {}));
console.log('\nFirst row sample:', JSON.stringify(data[0], null, 2));

// Helper function to slugify names
function slugify(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[,\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Parse scouts from the data
const scouts = [];
let scoutCounter = 1;

for (const row of data) {
  // Get scout information
  const scoutName = row['Scout-Full Name'] || '';
  const rank = row['Scout-Rank'] || '';
  const den = row['Scout-Den'] || '';

  if (!scoutName) continue; // Skip if no name

  // Get parent information
  const parentName = row['Parent1-Full Name'] || '';
  const parentEmail = row['Parent1-Email 1'] || '';
  const parentPhone = row['Parent1-Cell Phone'] || '';

  // Extract first name from parent's full name (format: "Lastname, Firstname")
  let parentFirstName = '';
  if (parentName) {
    const parts = parentName.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      parentFirstName = parts[1];
    } else {
      parentFirstName = parentName;
    }
  }

  const scout = {
    id: `scout-${scoutCounter}`,
    name: scoutName,
    slug: slugify(scoutName),
    rank: rank,
    den: den,
    email: '', // Scouts typically don't have individual emails
    parentName: parentFirstName,
    parentEmails: parentEmail ? [parentEmail] : [],
    active: true
  };

  scouts.push(scout);
  scoutCounter++;
}

console.log(`\nParsed ${scouts.length} scouts`);
console.log('\nSample scout data:');
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
