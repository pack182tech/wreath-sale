// More targeted diagnostic for scout roster
console.log('=== SCOUT ROSTER ANALYSIS ===');

// Find all dmembers elements
const dmembers = document.querySelectorAll('.dmembers');
console.log('Found ' + dmembers.length + ' .dmembers elements');

// Show first 5 dmembers in detail
for (let i = 0; i < Math.min(5, dmembers.length); i++) {
  console.log('\n--- Member ' + (i+1) + ' ---');
  console.log('HTML:', dmembers[i].outerHTML);

  // Try to find name
  const nameLink = dmembers[i].querySelector('a[href^="/member/"]');
  if (nameLink) {
    console.log('Name:', nameLink.textContent.trim());
    console.log('Link:', nameLink.href);
  }
}

// Look for any element that might contain parent info
console.log('\n=== SEARCHING FOR PARENT STRUCTURE ===');

// Check for indented or nested elements
const allDivs = document.querySelectorAll('div[class*="parent"], div[class*="contact"], div[class*="guardian"]');
console.log('Found ' + allDivs.length + ' potential parent divs');
if (allDivs.length > 0) {
  console.log('First parent div:', allDivs[0].outerHTML);
}

// Look at the main content area
const mainContent = document.querySelector('#content, #main, .content, [role="main"]');
if (mainContent) {
  console.log('\n=== MAIN CONTENT AREA (first 3000 chars) ===');
  console.log(mainContent.innerHTML.substring(0, 3000));
}
