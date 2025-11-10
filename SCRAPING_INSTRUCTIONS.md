# Scout Roster Scraping Instructions

## How to Scrape the Pack 182 Roster

### Step 1: Inspect the Page
1. Go to https://pack182.mypack.us/roster/group/all/subunit (make sure you're logged in)
2. Right-click on a scout's name → "Inspect"
3. Note the HTML structure - look for class names and element types

### Step 2: Run the Scraper
1. Open Chrome DevTools (F12 or Cmd+Option+I on Mac)
2. Go to the "Console" tab
3. Copy and paste the contents of `scrape-scouts.js`
4. Press Enter to run

### Step 3: Customize Selectors (if needed)
If the script doesn't find scouts, you may need to update the selectors in the script:

```javascript
// Line ~30 - Scout elements selector
const scoutElements = document.querySelectorAll('.scout-entry, .member-row, tr[data-scout], .roster-item');

// Line ~40 - Scout name selector
const scoutNameEl = scoutEl.querySelector('.name, .scout-name, .member-name, td:first-child a, h3');

// Line ~50 - Parent elements selector
const parentElements = scoutEl.querySelectorAll('.parent, .guardian, .contact, a[href*="/person/"]');
```

### Step 4: Check for Email on Parent Page
1. Click on a parent's name link
2. Right-click → Inspect on the email address
3. Note if it's in a `<a href="mailto:...">` tag or plain text
4. Update the `fetchParentEmail` function if needed

### Step 5: Download and Review
The script will:
- Log progress to the console
- Show a table of results
- Download a `pack182-scouts.json` file

### Step 6: Import to mockData.js
Once you have the JSON file, we can convert it to the format needed for the wreath site.

## Alternative: Manual Selector Discovery

Run this in the console to discover selectors:

```javascript
// Find all clickable names
console.log('All links:', document.querySelectorAll('a'));

// Find all table rows
console.log('All rows:', document.querySelectorAll('tr'));

// Find by partial class name
console.log('Elements with "name":', document.querySelectorAll('[class*="name"]'));
```

## Common Issues

**No scouts found?**
- The page might use different class names
- Try: `document.querySelectorAll('tr')` or `document.querySelectorAll('li')`

**No emails found?**
- Check if emails are visible on the parent page
- May need to click additional links or tabs

**Rate limiting?**
- Increase the `wait(500)` to `wait(1000)` or higher
