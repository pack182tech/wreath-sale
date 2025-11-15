const fs = require('fs');
const path = require('path');

// Read the parsed scout data
const scoutsPath = path.join(__dirname, '..', 'scouts-data.json');
const scouts = JSON.parse(fs.readFileSync(scoutsPath, 'utf8'));

console.log('\n========================================');
console.log('GOOGLE SHEETS IMPORT DATA GENERATOR');
console.log('========================================\n');

// Generate Scouts sheet data
console.log('1. SCOUTS SHEET');
console.log('------------------------------------------');
console.log('Copy the data below and paste into your "Scouts" sheet:\n');

// Headers
const scoutsHeaders = ['id', 'name', 'slug', 'rank', 'email', 'parentName', 'parentEmails', 'active'];
console.log(scoutsHeaders.join('\t'));

// Data rows
scouts.forEach(scout => {
  const row = [
    scout.id,
    scout.name,
    scout.slug,
    scout.rank,
    scout.email,
    scout.parentName,
    scout.parentEmails.join(';'), // Semicolon-separated for array
    scout.active ? 'TRUE' : 'FALSE'
  ];
  console.log(row.join('\t'));
});

console.log('\n------------------------------------------\n');

// Generate Orders sheet template
console.log('2. ORDERS SHEET (Template)');
console.log('------------------------------------------');
console.log('Copy the headers below and paste into your "Orders" sheet:\n');

const ordersHeaders = ['id', 'orderId', 'scoutId', 'customerName', 'customerEmail', 'customerPhone', 'comments', 'supportingScout', 'total', 'status', 'type', 'orderDate'];
console.log(ordersHeaders.join('\t'));
console.log('\n------------------------------------------\n');

// Generate OrderItems sheet template
console.log('3. ORDER ITEMS SHEET (Template)');
console.log('------------------------------------------');
console.log('Copy the headers below and paste into your "OrderItems" sheet:\n');

const orderItemsHeaders = ['id', 'orderId', 'productId', 'productName', 'price', 'quantity'];
console.log(orderItemsHeaders.join('\t'));
console.log('\n------------------------------------------\n');

// Generate Config sheet template
console.log('4. CONFIG SHEET (Template)');
console.log('------------------------------------------');
console.log('Copy the headers below and paste into your "Config" sheet:\n');

const configHeaders = ['key', 'value'];
console.log(configHeaders.join('\t'));
console.log('siteConfig\t(Paste your config JSON here)');
console.log('\n------------------------------------------\n');

// Also write to TSV files for easier importing
const tsvDir = path.join(__dirname, '..', 'sheets-import');
if (!fs.existsSync(tsvDir)) {
  fs.mkdirSync(tsvDir);
}

// Write Scouts TSV
const scoutsTSV = [scoutsHeaders.join('\t')];
scouts.forEach(scout => {
  const row = [
    scout.id,
    scout.name,
    scout.slug,
    scout.rank,
    scout.email,
    scout.parentName,
    scout.parentEmails.join(';'),
    scout.active ? 'TRUE' : 'FALSE'
  ];
  scoutsTSV.push(row.join('\t'));
});
fs.writeFileSync(path.join(tsvDir, 'scouts.tsv'), scoutsTSV.join('\n'));

// Write empty templates
fs.writeFileSync(path.join(tsvDir, 'orders.tsv'), ordersHeaders.join('\t'));
fs.writeFileSync(path.join(tsvDir, 'order-items.tsv'), orderItemsHeaders.join('\t'));
fs.writeFileSync(path.join(tsvDir, 'config.tsv'), configHeaders.join('\t') + '\nsiteConfig\t');

console.log('📁 TSV FILES GENERATED');
console.log('------------------------------------------');
console.log('TSV files saved to: sheets-import/');
console.log('  - scouts.tsv');
console.log('  - orders.tsv (template)');
console.log('  - order-items.tsv (template)');
console.log('  - config.tsv (template)');
console.log('\n========================================');
console.log('NEXT STEPS:');
console.log('========================================');
console.log('1. Create a new Google Sheet named "Pack 182 Wreath Sale Database"');
console.log('2. Create 4 sheets (tabs): Scouts, Orders, OrderItems, Config');
console.log('3. Copy-paste the data above into each sheet');
console.log('   OR import the TSV files from sheets-import/');
console.log('4. Make the sheet public (Anyone with link can VIEW)');
console.log('5. Copy the Sheet ID from the URL');
console.log('6. Set up Google Sheets API key (see BACKEND_SETUP_SHEETS.md)');
console.log('7. Update .env with VITE_GOOGLE_SHEET_ID and VITE_GOOGLE_API_KEY');
console.log('========================================\n');
