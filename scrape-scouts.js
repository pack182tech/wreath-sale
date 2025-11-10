// Pack 182 Scout Roster Scraper
// Run this in Chrome DevTools Console while logged into https://pack182.mypack.us/roster/group/all/subunit

async function scrapeScoutRoster() {
  console.log('🔍 Starting scout roster scrape...');

  const scouts = [];

  // Helper function to wait
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper function to fetch email from parent link
  async function fetchParentEmail(parentUrl) {
    try {
      const response = await fetch(parentUrl);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Try to find email - adjust selectors based on actual page structure
      const emailElement = doc.querySelector('a[href^="mailto:"]');
      if (emailElement) {
        return emailElement.href.replace('mailto:', '');
      }

      // Alternative: look for email pattern in text
      const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
      const bodyText = doc.body.textContent;
      const emailMatch = bodyText.match(emailRegex);
      if (emailMatch && emailMatch[0]) {
        return emailMatch[0];
      }

      return null;
    } catch (error) {
      console.error(`Error fetching email from ${parentUrl}:`, error);
      return null;
    }
  }

  // Find all scout entries
  const scoutElements = document.querySelectorAll('.scout-entry, .member-row, tr[data-scout], .roster-item');

  console.log(`Found ${scoutElements.length} potential scout elements`);

  if (scoutElements.length === 0) {
    console.error('❌ No scouts found. Please check the page selectors.');
    console.log('Page HTML structure:', document.body.innerHTML.substring(0, 1000));
    return;
  }

  for (let i = 0; i < scoutElements.length; i++) {
    const scoutEl = scoutElements[i];

    // Extract scout name - adjust selector based on actual structure
    const scoutNameEl = scoutEl.querySelector('.name, .scout-name, .member-name, td:first-child a, h3');
    if (!scoutNameEl) continue;

    const scoutName = scoutNameEl.textContent.trim();
    console.log(`\n📍 Processing scout: ${scoutName}`);

    const scout = {
      name: scoutName,
      parents: []
    };

    // Find parent elements - they might be nested or siblings
    const parentElements = scoutEl.querySelectorAll('.parent, .guardian, .contact, a[href*="/person/"]');

    console.log(`  Found ${parentElements.length} parent links`);

    for (let j = 0; j < parentElements.length; j++) {
      const parentEl = parentElements[j];
      const parentName = parentEl.textContent.trim();

      // Skip if it's the scout's own name
      if (parentName === scoutName) continue;

      const parentUrl = parentEl.href;

      if (parentUrl && parentName) {
        console.log(`    Fetching email for: ${parentName}`);

        const email = await fetchParentEmail(parentUrl);

        scout.parents.push({
          name: parentName,
          email: email || 'Email not found'
        });

        console.log(`      Email: ${email || 'Not found'}`);

        // Be polite to the server
        await wait(500);
      }
    }

    scouts.push(scout);
    console.log(`  ✓ Added scout with ${scout.parents.length} parents`);
  }

  console.log('\n✅ Scraping complete!');
  console.log(`Total scouts: ${scouts.length}`);
  console.log('\n📊 Results:');
  console.table(scouts);

  // Save to file
  const json = JSON.stringify(scouts, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pack182-scouts.json';
  a.click();

  console.log('\n💾 Downloaded as pack182-scouts.json');

  return scouts;
}

// Run the scraper
scrapeScoutRoster();
