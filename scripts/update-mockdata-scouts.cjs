const fs = require('fs');
const path = require('path');

// Read the scout data
const scoutsPath = path.join(__dirname, '..', 'scouts-data.json');
const scouts = JSON.parse(fs.readFileSync(scoutsPath, 'utf8'));

// Read current mockData.js
const mockDataPath = path.join(__dirname, '..', 'src', 'utils', 'mockData.js');
let mockData = fs.readFileSync(mockDataPath, 'utf8');

// Update version number
const newVersion = '3.0';  // Production data version
mockData = mockData.replace(
  /const SCOUT_DATA_VERSION = '[^']+'/,
  `const SCOUT_DATA_VERSION = '${newVersion}'`
);

// Find the scout lookup array and replace it
const scoutArrayStart = mockData.indexOf('const scoutLookup = [');
const scoutArrayEnd = mockData.indexOf(']', scoutArrayStart) + 1;

if (scoutArrayStart === -1 || scoutArrayEnd === -1) {
  console.error('Could not find scout lookup array in mockData.js');
  process.exit(1);
}

const before = mockData.substring(0, scoutArrayStart);
const after = mockData.substring(scoutArrayEnd);

const scoutArrayCode = `const scoutLookup = ${JSON.stringify(scouts, null, 2)}`;

// Combine
const newMockData = before + scoutArrayCode + after;

// Write back
fs.writeFileSync(mockDataPath, newMockData);

console.log(`✅ Updated mockData.js with ${scouts.length} production scouts`);
console.log(`✅ Version bumped to ${newVersion}`);
