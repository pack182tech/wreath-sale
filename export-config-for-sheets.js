#!/usr/bin/env node

/**
 * Export content.json to format for Google Sheets
 *
 * This script reads src/config/content.json and outputs it in a format
 * that can be pasted into Google Sheets Config tab, cell B2
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentPath = path.join(__dirname, 'src', 'config', 'content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

console.log('='.repeat(80));
console.log('GOOGLE SHEETS CONFIG SETUP');
console.log('='.repeat(80));
console.log('');
console.log('INSTRUCTIONS:');
console.log('1. Open your Google Spreadsheet');
console.log('2. Create a new sheet called "Config" (if it doesn\'t exist)');
console.log('3. In cell A1, type: Key');
console.log('4. In cell B1, type: Value');
console.log('5. In cell A2, type: siteConfig');
console.log('6. In cell B2, paste the JSON below');
console.log('');
console.log('='.repeat(80));
console.log('COPY THIS JSON TO CELL B2:');
console.log('='.repeat(80));
console.log('');

// Output the JSON in a compact format that can be pasted into a single cell
console.log(JSON.stringify(content));

console.log('');
console.log('='.repeat(80));
console.log('');
console.log('NOTES:');
console.log('- The entire config is stored in a single cell as JSON');
console.log('- To edit config, you can:');
console.log('  a) Edit the JSON directly in cell B2');
console.log('  b) Use a JSON editor/formatter, then paste back');
console.log('  c) Update src/config/content.json and re-run this script');
console.log('');
console.log('- After updating config in Sheets:');
console.log('  1. Save the sheet');
console.log('  2. The app will pick up changes within 5 minutes (cache duration)');
console.log('  3. Or refresh the page to force reload');
console.log('');
console.log('='.repeat(80));

// Also save to a file for reference
const outputPath = path.join(__dirname, 'config-for-sheets.json');
fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));
console.log(`\nAlso saved formatted version to: ${outputPath}`);
console.log('(This file is for reference only - paste the compact version above into Sheets)');
