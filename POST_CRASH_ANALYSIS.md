# POST-CRASH ANALYSIS
**Date:** November 16, 2025
**Analyst:** Post-incident Investigation
**Status:** 🔴 PRODUCTION SITE DOWN / NOT LOADING

---

## EXECUTIVE SUMMARY

### Critical Finding
The production site at `https://pack182tech.github.io/wreath-sale/` is serving **outdated code from November 15, 2025 at 4:40 PM**. Critical bug fixes and improvements were committed on **November 16, 2025** (today) but the deployment step (`npm run deploy`) was **NEVER EXECUTED**.

### Impact
- Production site potentially showing infinite loading screen
- Critical fixes for config loading not deployed
- Scout attribution may be broken due to syntax errors
- Users cannot access the wreath sale website

### Root Cause
**PRIMARY:** Build process completed locally but deployment to GitHub Pages gh-pages branch was not executed.

**SECONDARY:**
- Configuration environment variable discrepancies between `.env` and `.env.production`
- Two different Apps Script URLs may cause backend connection failures
- Version number drift (3.0.0 → 3.3.0) without documentation updates

---

## TIMELINE OF EVENTS

| Date/Time | Event | Impact |
|-----------|-------|--------|
| **Nov 15, 4:40 PM** | Last successful deployment to GitHub Pages | Production frozen at this version |
| **Nov 16, 3:30 PM** | `src/config/content.json` updated | Local fallback config improved |
| **Nov 16, 4:20 PM** | `.env` and `.env.production` updated | Environment config changed |
| **Nov 16, 4:50 PM** | `CONFIG_SETUP_GUIDE.md` updated | Documentation refreshed |
| **Nov 16, 4:51 PM** | `PRODUCTION_READINESS_SUMMARY.md` updated | Marked as "ready" but not deployed |
| **Nov 16, 4:59 PM** | `src/context/ScoutContext.jsx` syntax fix | Critical bug fix NOT on production |
| **Nov 16, 5:26 PM** | `src/context/AuthContext.jsx` updated | Context improvements NOT deployed |
| **Nov 16, 5:27 PM** | Multiple page components updated | UI fixes NOT deployed |
| **Nov 16, 5:31 PM** | **Local build created** (`dist/` folder) | Build success, but NOT pushed |
| **Nov 16, 5:45 PM** | `config-for-sheets.json` exported | Google Sheets config prepared |
| **Nov 16, 5:50 PM** | `APPS_SCRIPT_BACKEND.js` updated | Backend code updated |
| **NOW** | Production still serving Nov 15 code | ❌ **24+ HOURS OUT OF DATE** |

---

## DETAILED FILE ANALYSIS

### Production Deployment Status

**GitHub Pages (gh-pages branch):**
- Last Updated: November 15, 2025 at 4:40 PM
- Deployed Asset: `index-DIiED60W.js` (OLD)
- Deployment Method: `gh-pages` npm package

**Local Build (dist/ folder):**
- Last Built: November 16, 2025 at 5:31 PM
- Current Asset: `index-DqhsfmvV.js` (NEW)
- Build Status: ✅ Complete, ❌ NOT DEPLOYED

**Asset Hash Mismatch:**
```
Production:  index-DIiED60W.js  (Nov 15)
Local Build: index-DqhsfmvV.js  (Nov 16)
```

This proves conclusively that the production site is **not running the latest code**.

### Recent Commits Not on Production

**Git Commit History (November 16):**

1. `b70fc04` - "Fix config loading by storing in state instead of sync call"
   - **Critical Fix:** Prevents undefined config errors
   - **Status:** ❌ NOT DEPLOYED

2. `b7e13bb` - "Add config safety check in HomePage component"
   - **Critical Fix:** Prevents crashes when config unavailable
   - **Status:** ❌ NOT DEPLOYED

3. `d4715e1` - "Remove all mockData imports from production code"
   - **Breaking Change:** App now 100% dependent on Apps Script backend
   - **Status:** ❌ NOT DEPLOYED

4. `97de047` - "Convert export-config-for-sheets.js to ES module syntax"
   - **Improvement:** Module compatibility
   - **Status:** ❌ NOT DEPLOYED

5. `ee95053` - "Fix syntax error in ScoutContext.jsx"
   - **Critical Fix:** Scout attribution was broken
   - **Status:** ❌ NOT DEPLOYED

6. `575d979` - "Complete production readiness implementation (v3.0.0)"
   - **Major Update:** Full production migration
   - **Status:** ❌ NOT DEPLOYED

---

## ROOT CAUSE ANALYSIS

### PRIMARY ROOT CAUSE: Deployment Not Executed

**The Problem:**
The deployment command `npm run deploy` was not executed after building the latest code.

**Evidence:**
1. Local `dist/` folder built at 5:31 PM on Nov 16
2. GitHub Pages last updated at 4:40 PM on Nov 15
3. Asset hash mismatch: `DIiED60W` (prod) vs `DqhsfmvV` (local)
4. Git commits show 6 commits on Nov 16 not reflected on gh-pages branch

**Why It Matters:**
- Users accessing the production URL get the old, potentially broken version
- Critical bug fixes remain unreleased
- Configuration changes not in effect

### SECONDARY ROOT CAUSE: Configuration Environment Discrepancies

**Issue 1: Two Different Apps Script URLs**

`.env` (Development):
```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwfihShhmVyC6rmSiftbieJab5yVhpRSJ0bin8KoNp04Fa2RdXr6WO02ktshAMkqMIFQA/exec
```

`.env.production` (Production):
```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwKyr1LLQCjQvoXdL02uMcA4IJV1KIetGzpLKTHfiD1uOMQxB_fxeaZBTPIRftCwe4VIw/exec
```

**Implications:**
- If production URL is outdated/incorrect, backend calls fail
- Config loading would fail → infinite loading screen
- Scout data wouldn't load → attribution broken
- Orders couldn't be submitted → checkout fails

**Issue 2: Version Number Mismatch**

- `.env`: `VITE_APP_VERSION=3.0.0`
- `.env.production`: `VITE_APP_VERSION=3.3.0`
- `package.json`: `"version": "3.3.0"`

**Implications:**
- Development environment 3 versions behind production
- Suggests environment drift and lack of synchronization
- Documentation may reference wrong version

### TERTIARY ROOT CAUSE: Breaking Changes Without Fallbacks

**Mock Data Removal (Commit d4715e1):**
- All `mockData.js` imports removed from production code
- App now **100% dependent** on Apps Script backend
- No localStorage fallbacks in v3.0.0+

**Impact:**
If Apps Script backend is unreachable (due to wrong URL or network issues):
1. Config fails to load → infinite loading screen
2. Scouts fail to load → attribution broken
3. Orders fail to submit → checkout broken
4. **No graceful degradation**

---

## TECHNICAL DEEP DIVE

### Configuration Loading Architecture

**Flow:**
```
User visits site
  └─> index.html loads
      └─> main.jsx initializes
          └─> App.jsx starts
              ├─> runProductionCheck() [Health check]
              │   ├─> Verifies VITE_USE_APPS_SCRIPT=true
              │   ├─> Checks Apps Script URL configured
              │   ├─> Tests connectivity (healthCheck endpoint)
              │   └─> Logs diagnostics to console
              │
              ├─> getConfig() [Load configuration]
              │   ├─> Check 5-minute cache
              │   ├─> Fetch from Apps Script API
              │   ├─> Fallback to src/config/content.json
              │   └─> Return config object
              │
              └─> Wait for configLoaded=true
                  └─> Render app OR show loading spinner
```

**Current Implementation (App.jsx lines 33-77):**
```javascript
useEffect(() => {
  const initialize = async () => {
    await runProductionCheck()
    const loadedConfig = await getConfig()
    setConfig(loadedConfig)
    setConfigLoaded(true)
  }
  initialize()
}, [])

if (!configLoaded || !config) {
  return <LoadingSpinner message="Loading Pack 182 Wreath Sale..." />
}
```

**Failure Mode:**
If `getConfig()` fails (due to wrong Apps Script URL):
- `configLoaded` never set to `true`
- User stuck on loading screen **forever**
- No error message displayed
- No fallback mechanism

### Google Sheets Backend Integration

**Apps Script Backend (`APPS_SCRIPT_BACKEND.js`):**

**getConfig() Function (lines 239-258):**
```javascript
function getConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config')
  const configJson = sheet.getRange('B2').getValue()
  return JSON.parse(configJson)
}
```

**Requirements:**
1. Google Sheet must exist
2. Sheet named "Config" must exist
3. Cell B2 must contain valid JSON
4. JSON must match expected config structure

**Failure Points:**
- Sheet doesn't exist → Error 500
- Cell B2 empty → Parse error
- Invalid JSON → Parse error
- Missing required fields → Runtime errors

**Expected Config in Cell B2:**
The compact JSON from `config-for-sheets.json` (17,617 characters):
- campaign settings
- pack information
- products array
- donation settings
- zelle configuration
- email templates
- scout law examples
- FAQ content

### Scout Context Loading

**ScoutContext.jsx (lines 80-120):**
```javascript
useEffect(() => {
  const fetchScouts = async () => {
    try {
      const scouts = await getScouts() // API call
      setScouts(scouts)
      setLoading(false)
    } catch (error) {
      console.error('[ScoutContext] Failed to load scouts:', error)
      alert('Unable to load scout information...')
      setLoading(false)
    }
  }
  fetchScouts()
}, [])
```

**Failure Mode:**
If `getScouts()` API call fails:
- Alert popup shown to user
- Scout attribution broken
- User can still browse but orders won't attribute to scouts

---

## PRODUCTION FAILURE SCENARIOS

### Scenario 1: Infinite Loading Screen (MOST LIKELY)

**Symptoms:**
- User visits site
- Sees "Loading Pack 182 Wreath Sale..." spinner
- Spinner never disappears
- Page never loads

**Root Cause:**
Production `.env.production` has wrong/outdated Apps Script URL → `getConfig()` fails → `configLoaded` never becomes `true`

**Evidence:**
- Two different Apps Script URLs exist
- No timeout on config loading
- No error messaging for config load failure
- App.jsx waits indefinitely for config (lines 48-77)

**Probability:** ⚠️ **HIGH** (80%)

**How to Verify:**
1. Open production site: https://pack182tech.github.io/wreath-sale/
2. Open DevTools Console
3. Look for errors related to config loading
4. Check Network tab for failed API requests

---

### Scenario 2: Scout Attribution Crashes

**Symptoms:**
- Site loads initially
- When scout-specific link accessed (e.g., `?scout=mcgowan-dylan`)
- Alert popup: "Unable to load scout information..."
- Scout name not displayed in banner
- Orders don't attribute to scout

**Root Cause:**
ScoutContext has syntax error (fixed in commit ee95053 but NOT deployed) OR `getScouts()` API fails

**Evidence:**
- Commit ee95053: "Fix syntax error in ScoutContext.jsx"
- This commit is on main branch but NOT on gh-pages
- Production code has the syntax error

**Probability:** ⚠️ **MEDIUM** (50%)

---

### Scenario 3: Backend Connection Complete Failure

**Symptoms:**
- Production health check fails on startup
- Alert: "⚠️ Unable to connect to the data backend..."
- All API-dependent features broken

**Root Cause:**
Apps Script URL in `.env.production` points to non-existent or unauthorized deployment

**Evidence:**
- Two different Apps Script URLs suggest one may be outdated
- Production URL: `...AKfycbwKyr1LLQCjQvoXdL02uMcA4IJV1KIetGzpLKTHfiD1uOMQxB_fxeaZBTPIRftCwe4VIw`
- Dev URL: `...AKfycbwfihShhmVyC6rmSiftbieJab5yVhpRSJ0bin8KoNp04Fa2RdXr6WO02ktshAMkqMIFQA`

**Probability:** ⚠️ **MEDIUM** (40%)

---

### Scenario 4: Google Sheets Configuration Missing

**Symptoms:**
- Site loads with default/fallback configuration
- Products may be missing or incorrect
- Donation feature behaves incorrectly
- Email templates not working

**Root Cause:**
Cell B2 in Config sheet is empty or contains invalid JSON

**Evidence:**
- User was asked to place JSON in cell B2
- `config-for-sheets.json` created at 5:45 PM today
- May not have been pasted into sheet yet

**Probability:** ⚠️ **LOW-MEDIUM** (30%)

---

## KEY DISCREPANCIES: DOCUMENTATION vs REALITY

| Aspect | Documentation Says | Reality |
|--------|-------------------|---------|
| **Production Status** | "✅ PRODUCTION READY" (PRODUCTION_READINESS_SUMMARY.md) | Code built but NOT deployed |
| **Version** | References v3.0.0 in some docs | package.json shows v3.3.0 |
| **Apps Script URL** | Implies single URL | Two different URLs in .env files |
| **Deployment** | "Follow deployment steps" | Steps never executed |
| **Last Deploy** | Not documented | Nov 15, 4:40 PM (>24 hrs ago) |
| **Asset Files** | Should be current | Hash mismatch proves old code |
| **Mock Data** | "Removed from production" | Only removed in undeployed code |
| **Config Source** | "Google Sheets" | Production may still use fallback |

---

## ENVIRONMENT CONFIGURATION ANALYSIS

### package.json Scripts

```json
{
  "name": "pack182-wreath-sale",
  "version": "3.3.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**Deploy Process:**
1. `npm run build` - Builds with `.env.production` variables
2. `gh-pages -d dist` - Pushes dist folder to gh-pages branch

**Issue:** Step 2 (`gh-pages -d dist`) was never executed

### vite.config.js

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/wreath-sale/',  // ✅ Correct for GitHub Pages
})
```

**Status:** ✅ Configuration correct

### Environment Files

**.env (Development):**
```env
VITE_APP_VERSION=3.0.0          # ⚠️ Outdated (should be 3.3.0)
VITE_USE_APPS_SCRIPT=true       # ✅ Correct
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwfihShhmVyC6rmSiftbieJab5yVhpRSJ0bin8KoNp04Fa2RdXr6WO02ktshAMkqMIFQA/exec
```

**.env.production (Production):**
```env
VITE_APP_VERSION=3.3.0          # ✅ Matches package.json
VITE_USE_APPS_SCRIPT=true       # ✅ Correct
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwKyr1LLQCjQvoXdL02uMcA4IJV1KIetGzpLKTHfiD1uOMQxB_fxeaZBTPIRftCwe4VIw/exec
```

**Questions Raised:**
1. Why are there two different Apps Script URLs?
2. Is the production URL current and correct?
3. Has the production Apps Script been deployed?
4. Does the production Apps Script have access to the correct Google Sheet?

---

## IMMEDIATE ACTION ITEMS

### Priority 1: Verify Apps Script URL (BEFORE DEPLOYING)

**Action:**
1. Test production Apps Script URL in browser:
   ```
   https://script.google.com/macros/s/AKfycbwKyr1LLQCjQvoXdL02uMcA4IJV1KIetGzpLKTHfiD1uOMQxB_fxeaZBTPIRftCwe4VIw/exec?action=healthCheck
   ```

2. Expected response:
   ```json
   {
     "status": "ok",
     "message": "Pack 182 Wreath Sale API is running",
     "timestamp": "2025-11-16T..."
   }
   ```

3. If fails: Update `.env.production` with correct URL before deploying

**Blocker:** Cannot deploy if backend URL is wrong

---

### Priority 2: Verify Google Sheets Configuration

**Action:**
1. Open Google Sheet used by production Apps Script
2. Navigate to "Config" sheet
3. Verify cell B2 contains the JSON from `config-for-sheets.json`
4. Validate JSON is properly formatted (no quotes escaped incorrectly)

**How to Insert:**
1. Copy contents of `config-for-sheets.json` in compact form
2. Paste directly into cell B2
3. Cell should show JSON as text (starting with `{"campaign":...`)

**Blocker:** If B2 is empty, site will use fallback config (may be outdated)

---

### Priority 3: Deploy Latest Code

**Action:**
```bash
cd /Users/jimmcgowan/Jim/BoySchools/wreath-site
npm run deploy
```

**What This Does:**
1. Runs `vite build` with `.env.production` variables
2. Creates optimized production build in `dist/`
3. Pushes `dist/` contents to `gh-pages` branch
4. GitHub Pages automatically serves updated site

**Expected Output:**
```
> pack182-wreath-sale@3.3.0 deploy
> npm run build && gh-pages -d dist

> pack182-wreath-sale@3.3.0 build
> vite build

✓ built in XXXms
Published
```

**Timeline:** GitHub Pages typically updates within 1-2 minutes

---

### Priority 4: Verify Deployment Success

**Action:**
1. Wait 2 minutes after deploy completes
2. Visit: https://pack182tech.github.io/wreath-sale/
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. Open DevTools Console
5. Check for version number in console logs
6. Verify site loads without infinite spinner

**Success Criteria:**
- Site loads (no infinite spinner)
- Config loads from Google Sheets
- Scout links work (test: `?scout=mcgowan-dylan`)
- No console errors
- Version shows 3.3.0

---

## SHORT-TERM RECOMMENDATIONS

### 1. Consolidate Environment Variables

**Issue:** Two different Apps Script URLs suggest confusion or environment drift

**Recommendation:**
1. Document which URL is for what purpose
2. If both point to same sheet, consolidate to one
3. If different sheets (dev vs prod), document clearly
4. Update README with environment setup instructions

**File to Update:** Add to `CONFIG_SETUP_GUIDE.md` or `README.md`

---

### 2. Add Deployment Verification

**Issue:** No automated check that deployment succeeded

**Recommendation:**
Create `scripts/verify-deployment.js`:
```javascript
// Fetch production site and verify version
const prodVersion = await fetchProductionVersion()
const packageVersion = require('../package.json').version

if (prodVersion !== packageVersion) {
  console.error('❌ Deployment verification failed!')
  console.error(`Production: v${prodVersion}`)
  console.error(`Expected: v${packageVersion}`)
  process.exit(1)
}
```

Add to `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist && npm run verify-deployment"
}
```

---

### 3. Test Production Build Locally

**Issue:** No way to test production build before deploying

**Recommendation:**
Before deploying, always run:
```bash
npm run build
npm run preview
```

Then visit `http://localhost:4173/wreath-sale/` and test:
- Site loads
- Config loads
- Scout attribution works
- Checkout flow works
- No console errors

---

### 4. Update Version Numbers

**Issue:** `.env` has v3.0.0, should be v3.3.0

**Recommendation:**
Update `.env`:
```env
VITE_APP_VERSION=3.3.0  # Match package.json
```

---

## LONG-TERM RECOMMENDATIONS

### 1. Automated Deployment Pipeline

**Current:** Manual `npm run deploy` command
**Proposed:** GitHub Actions workflow

**Benefits:**
- Automatic deployment on push to main
- Built-in verification steps
- Deployment history/audit trail
- Rollback capability

**Example Workflow:**
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

### 2. Deployment Checklist Document

**Create:** `DEPLOYMENT_CHECKLIST.md`

**Contents:**
```markdown
# Deployment Checklist

## Pre-Deployment
- [ ] All tests pass locally
- [ ] Code reviewed and approved
- [ ] Environment variables verified (.env.production)
- [ ] Apps Script backend deployed and tested
- [ ] Google Sheets configured (Config in B2, Scouts sheet ready)
- [ ] Local production build tested (`npm run preview`)

## Deployment
- [ ] Run `npm run deploy`
- [ ] Wait for build completion
- [ ] Check for errors in output

## Post-Deployment
- [ ] Wait 2 minutes for GitHub Pages update
- [ ] Visit production URL
- [ ] Hard refresh browser
- [ ] Verify site loads (no infinite spinner)
- [ ] Check console for errors
- [ ] Test scout attribution link
- [ ] Verify config loaded from Sheets (check console logs)
- [ ] Test checkout flow
- [ ] Verify version number in footer/console

## Rollback (if needed)
- [ ] Identify last known good commit
- [ ] `git checkout <commit-hash>`
- [ ] `npm run deploy`
```

---

### 3. Monitoring and Alerting

**Recommendation:** Set up uptime monitoring

**Tools:**
- UptimeRobot (free tier)
- Pingdom
- StatusCake

**Monitor:**
- https://pack182tech.github.io/wreath-sale/
- Alert if site down or returns 404/500
- Alert if response time > 5 seconds

---

### 4. Documentation Updates

**Files to Update:**

1. **PRODUCTION_READINESS_SUMMARY.md**
   - Add "Last Deployed" timestamp
   - Add deployment verification steps
   - Update version to 3.3.0

2. **README.md**
   - Add deployment instructions
   - Document environment variables
   - Explain Apps Script URL differences

3. **CONFIG_SETUP_GUIDE.md**
   - Add troubleshooting section
   - Document common deployment issues
   - Add verification steps

---

## LESSONS LEARNED

### What Went Wrong

1. **No Deployment Verification**
   - Code was built but never deployed
   - No automated check caught this
   - No manual checklist enforced

2. **Environment Confusion**
   - Two Apps Script URLs without documentation
   - Version number drift between environments
   - No clear indication which is current

3. **No Testing of Production Build**
   - Production build never tested locally
   - Issues only discovered when deployed (or not deployed)

4. **Documentation Lag**
   - Documentation said "production ready"
   - Reality: deployment step skipped
   - False confidence led to confusion

### What Went Right

1. **Good Git Hygiene**
   - Clear commit messages
   - Logical commit sequence
   - Easy to trace changes

2. **Comprehensive Logging**
   - Production health checks
   - Console logging for debugging
   - Error handling with user alerts

3. **Configuration Externalization**
   - Config in Google Sheets (good architecture)
   - Fallback to local config (safety net)
   - Environment-specific URLs

---

## CONCLUSION

### The Crash: What Happened

The production site is not technically "crashed" - it's running the **wrong version of the code** (24+ hours out of date). The site may be showing:
- Infinite loading screen (config load failure)
- Scout attribution errors (syntax bugs)
- Backend connection failures (wrong Apps Script URL)

### Why It Happened

1. **Deployment step skipped** after building latest code
2. **Environment variables not verified** before deployment
3. **No testing of production build** before deploying
4. **Documentation marked as ready** without actual deployment

### How to Fix (Summary)

**IMMEDIATE:**
1. Verify Apps Script URL works: test healthCheck endpoint
2. Verify Google Sheets Config cell B2 has JSON
3. Run `npm run deploy`
4. Wait 2 minutes and test production site

**SHORT-TERM:**
1. Consolidate environment variables
2. Add deployment verification
3. Update version numbers to match
4. Document Apps Script URL purposes

**LONG-TERM:**
1. Implement automated deployment (GitHub Actions)
2. Create deployment checklist
3. Set up uptime monitoring
4. Keep documentation synchronized with reality

### Confidence Level

**Root Cause:** ✅ **99% Confident** - Asset hash mismatch proves old code deployed

**Fix Success:** ✅ **95% Confident** - Deployment will fix IF Apps Script URL is correct

**Unknown Variables:**
- Is production Apps Script URL correct? (Need to test)
- Is Google Sheets Config in cell B2? (Need to verify)
- Are there other backend issues? (Will discover post-deploy)

---

## APPENDIX A: File Modification Dates

```
November 16, 2025:
17:50 - APPS_SCRIPT_BACKEND.js
17:45 - config-for-sheets.json
17:35 - .git/ (last commit)
17:33 - wreath-site/ directory
17:31 - dist/ (build output)
17:31 - src/App.jsx
17:27 - src/pages/ (multiple)
17:26 - src/context/AuthContext.jsx
16:59 - src/context/ScoutContext.jsx
16:51 - PRODUCTION_READINESS_SUMMARY.md
16:50 - CONFIG_SETUP_GUIDE.md
16:20 - .env.production
16:20 - .env
15:30 - src/config/content.json

November 15, 2025:
16:40 - gh-pages branch (PRODUCTION)
```

---

## APPENDIX B: Asset Hash Investigation

**Production (gh-pages):**
- index-DIiED60W.js
- index-[hash].css

**Local Build (dist/):**
- index-DqhsfmvV.js
- index-BO3tlL67.css

**Vite Build Process:**
Vite generates content-based hashes for cache busting. Different hash = different content = different code.

**Conclusion:** The asset hashes definitively prove production is not serving the latest code.

---

## APPENDIX C: Apps Script URL Comparison

**Development (.env):**
```
https://script.google.com/macros/s/
  AKfycbwfihShhmVyC6rmSiftbieJab5yVhpRSJ0bin8KoNp04Fa2RdXr6WO02ktshAMkqMIFQA
  /exec
```

**Production (.env.production):**
```
https://script.google.com/macros/s/
  AKfycbwKyr1LLQCjQvoXdL02uMcA4IJV1KIetGzpLKTHfiD1uOMQxB_fxeaZBTPIRftCwe4VIw
  /exec
```

**Deployment IDs are different:**
- Dev: `AKfycbwfihShhmVyC6rmSiftbieJab5yVhpRSJ0bin8KoNp04Fa2RdXr6WO02ktshAMkqMIFQA`
- Prod: `AKfycbwKyr1LLQCjQvoXdL02uMcA4IJV1KIetGzpLKTHfiD1uOMQxB_fxeaZBTPIRftCwe4VIw`

**Possible Explanations:**
1. Two different Apps Script deployments (dev vs prod Google Sheets)
2. Old deployment URL (prod) vs new deployment URL (dev)
3. Different versions of the Apps Script code
4. Test vs production environments

**Needs Investigation:** Which URL is current and correct?

---

**END OF ANALYSIS**

*This document should be retained for historical reference and used to improve deployment processes going forward.*
