// Diagnostic script to discover page structure
console.log('Analyzing page structure...');

// Check for table rows
const rows = document.querySelectorAll('tr');
console.log('Found ' + rows.length + ' table rows');
if (rows.length > 0) {
  console.log('First row HTML:', rows[0].outerHTML);
}

// Check for list items
const listItems = document.querySelectorAll('li');
console.log('Found ' + listItems.length + ' list items');
if (listItems.length > 0) {
  console.log('First list item HTML:', listItems[0].outerHTML);
}

// Check for all links
const links = document.querySelectorAll('a');
console.log('Found ' + links.length + ' links');
console.log('First 10 link texts:', Array.from(links).slice(0, 10).map(a => a.textContent.trim()));

// Check for specific elements
const memberDivs = document.querySelectorAll('div[class*=member]');
console.log('Found ' + memberDivs.length + ' elements with member in class');
if (memberDivs.length > 0) {
  console.log('First element HTML:', memberDivs[0].outerHTML);
}

// Show the body
console.log('Body HTML first 2000 chars:', document.body.innerHTML.substring(0, 2000));
