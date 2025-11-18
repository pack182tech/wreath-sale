# Admin Page Crash - Factual Bug Report

## ERROR OBSERVED
```
TypeError: Cannot read properties of undefined (reading 'name')
at index-DuTLuOYf.js:147:3694
```

## FACTS COLLECTED

### Production Deployment
- **Current deployed bundle:** `index-DuTLuOYf.js`
- **Last modified:** Tue, 18 Nov 2025 01:41:11 GMT
- **Bundle size:** 297,659 bytes
- **HTTP Status:** 200 OK

### Config Structure from API
**API Response keys (Google Sheets):**
```
['campaign', 'cart', 'checkout', 'content', 'donation', 'emailTemplates',
 'images', 'pack', 'productDisclaimer', 'products', 'scoutAttributionBanner',
 'scoutLaw', 'zelle']
```

### Local Fallback Config Structure
**content.json keys:**
```
['campaign', 'cart', 'checkout', 'content', 'donation', 'emailTemplates',
 'images', 'pack', 'productDisclaimer', 'products', 'scoutAttributionBanner',
 'scoutLaw', 'zelle']
```

### AdminDashboard Initial State (Line 40-50)
```javascript
const [siteConfig, setSiteConfig] = useState({
  campaign: {},
  pack: {},
  products: [],
  donation: {},
  zelle: {},
  content: {},
  scoutAttributionBanner: {},
  cart: {},
  checkout: {}
})
```

**MISSING KEYS:** `scoutLaw`, `productDisclaimer`, `emailTemplates`, `images`

### Code References WITHOUT Optional Chaining
**Line 1404:**
```javascript
checked={siteConfig.scoutLaw.enabled}
```

**Line 1414:**
```javascript
value={siteConfig.scoutLaw.text}
```

**Line 1368:**
```javascript
value={siteConfig.productDisclaimer}
```

**Line 1423:**
```javascript
{siteConfig.products.map((product, index) => (
```

## ROOT CAUSE

1. AdminDashboard component initializes `siteConfig` state with empty objects for some keys
2. Initial state is MISSING: `scoutLaw`, `productDisclaimer`, `emailTemplates`, `images`
3. Component renders BEFORE `loadData()` completes (line 59-68)
4. During render, code at line 1404 accesses: `siteConfig.scoutLaw.enabled`
5. Since `siteConfig.scoutLaw` is `undefined`, accessing `.enabled` throws TypeError
6. No optional chaining (`?.`) is used on lines 1404, 1414, 1368

## VERIFICATION

Grepped for all `siteConfig.` access without `?.`:
```
Line 1368: siteConfig.productDisclaimer
Line 1404: siteConfig.scoutLaw.enabled
Line 1414: siteConfig.scoutLaw.text
Line 1423: siteConfig.products.map
Line 1433-1471: Multiple siteConfig.products access
Line 1493: siteConfig.emailTemplates (has || {} fallback)
```

## SOLUTION REQUIRED

Add missing keys to initial state:
- `scoutLaw: {}`
- `productDisclaimer: ''`
- `emailTemplates: {}`
- `images: {}`

OR add optional chaining to all access points.
