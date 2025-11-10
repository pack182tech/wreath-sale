// Update scout ranks based on pack182.mypack.us roster
const fs = require('fs');
const path = require('path');

// Scout ranks from the roster screenshot
const scoutRanks = {
  // Lion
  'haines-jackson': 'Lion',
  'kalladeen-sahil': 'Lion',
  'kilanowski-raphael': 'Lion',
  'mcewan-jacob': 'Lion',
  'morgan-allen-clay': 'Lion',
  'mutz-owen': 'Lion',
  'uzarski-maverick': 'Lion',

  // Tiger
  'canning-declan': 'Tiger',
  'dagraca-frank': 'Tiger',
  'hettenbach-wesley': 'Tiger',
  'kilanowski-gabriel': 'Tiger',
  'peterson-levi': 'Tiger',
  'pidiath-alexander': 'Tiger',
  'shiminsky-nathan': 'Tiger',
  'thompson-whitaker': 'Tiger',

  // Wolf
  'doherty-river': 'Wolf',
  'gregorio-russell': 'Wolf',
  'herman-arlo': 'Wolf',
  'hosgood-zachery': 'Wolf',
  'molchan-carter': 'Wolf',
  'serafyn-matthew': 'Wolf',
  'sullivan-rory': 'Wolf',
  'waidelich-jacob': 'Wolf',

  // Bear
  'brandt-mason': 'Bear',
  'cambria-logan': 'Bear',
  'cofoni-sj': 'Bear',
  'dagraca-ethan': 'Bear',
  'facchina-luca': 'Bear',
  'gamboa-john': 'Bear',
  'lutz-polizzi-parker': 'Bear',
  'marsh-alex': 'Bear',
  'mcgowan-dylan': 'Bear',
  'mest-declan': 'Bear',
  'ranallo-joshua': 'Bear',
  'serafyn-anthony': 'Bear',
  'solberg-alistair': 'Bear',
  'wilson-quinn': 'Bear',

  // Webelos
  'conte-beau': 'Webelos',
  'giroud-henry': 'Webelos',
  'mamay-jack': 'Webelos',
  'rodriguez-julian': 'Webelos',
  'rodriguez-sam': 'Webelos',
  'thompson-garrett': 'Webelos',
  'wallace-ronan': 'Webelos',

  // Wolf (Cofoni Will - not in Bear list, must be Wolf based on sibling)
  'cofoni-will': 'Tiger'
};

// Read the current mockData.js
const mockDataPath = path.join(__dirname, 'src', 'utils', 'mockData.js');
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Update each scout's rank
for (const [slug, rank] of Object.entries(scoutRanks)) {
  // Find the scout by slug and update the rank
  const pattern = new RegExp(`"slug":"${slug}","rank":"Scout"`, 'g');
  mockDataContent = mockDataContent.replace(pattern, `"slug":"${slug}","rank":"${rank}"`);
}

// Write back to file
fs.writeFileSync(mockDataPath, mockDataContent, 'utf8');

console.log('✅ Updated scout ranks in mockData.js');
console.log(`Total ranks updated: ${Object.keys(scoutRanks).length}`);

// Show rank distribution
const rankCounts = {};
for (const rank of Object.values(scoutRanks)) {
  rankCounts[rank] = (rankCounts[rank] || 0) + 1;
}

console.log('\nRank distribution:');
for (const [rank, count] of Object.entries(rankCounts)) {
  console.log(`  ${rank}: ${count} scouts`);
}
