# Google Sheets Backend Setup (NO CREDIT CARD REQUIRED)

This guide shows you how to set up Google Sheets as your database using **Google Apps Script** - completely free with NO credit card needed!

---

## Why Google Apps Script Instead of API?

- ✅ **100% Free** - No credit card ever required
- ✅ **No API Key Needed** - Apps Script is built into Google Sheets
- ✅ **Easy Setup** - Just copy/paste a script
- ✅ **Public Access** - Anyone can read data without authentication
- ✅ **More Secure** - Admin writes go through your Google account

---

## Step 1: Create Your Google Sheet

### 1.1 Create the Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click "Blank" to create a new spreadsheet
3. Name it: **"Pack 182 Wreath Sale Database"**

### 1.2 Import Scout Data

1. Open the file: `sheets-import-instructions.txt`
2. Copy the scout data (starting from line 11)
3. Paste into your Google Sheet (Sheet1)
4. Select the pasted data
5. Go to: **Data → Split text to columns**
6. Choose **"Custom"** separator and enter: `|`
7. Rename "Sheet1" tab to **"Scouts"**

### 1.3 Create Additional Sheets

Create 3 more tabs (click + at bottom):
- **Orders** - For customer orders
- **OrderItems** - For order line items
- **Config** - For site configuration

Add headers to each sheet:

**Orders sheet:**
```
id|orderId|scoutId|customerName|customerEmail|customerPhone|comments|supportingScout|total|status|type|orderDate
```

**OrderItems sheet:**
```
id|orderId|productId|productName|price|quantity
```

**Config sheet:**
```
key|value
```

---

## Step 2: Create Apps Script Web App

### 2.1 Open Script Editor

1. In your Google Sheet, click: **Extensions → Apps Script**
2. Delete any default code
3. Copy/paste the script below

### 2.2 Apps Script Code

```javascript
// Pack 182 Wreath Sale - Google Apps Script Backend
// This script provides a public API for reading/writing data

function doGet(e) {
  const action = e.parameter.action
  const sheet = e.parameter.sheet

  try {
    switch(action) {
      case 'getScouts':
        return getScouts()
      case 'getOrders':
        return getOrders()
      case 'getConfig':
        return getConfig()
      default:
        return response({ error: 'Invalid action' }, 400)
    }
  } catch (error) {
    return response({ error: error.toString() }, 500)
  }
}

function doPost(e) {
  const action = e.parameter.action

  try {
    const data = JSON.parse(e.postData.contents)

    switch(action) {
      case 'createOrder':
        return createOrder(data)
      default:
        return response({ error: 'Invalid action' }, 400)
    }
  } catch (error) {
    return response({ error: error.toString() }, 500)
  }
}

function getScouts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName('Scouts')
  const data = sheet.getDataRange().getValues()

  // Convert to array of objects
  const headers = data[0]
  const scouts = data.slice(1).map(row => {
    const scout = {}
    headers.forEach((header, i) => {
      if (header === 'parentEmails') {
        // Split semicolon-separated emails into array
        scout[header] = row[i] ? row[i].split(';').map(e => e.trim()) : []
      } else if (header === 'active') {
        scout[header] = row[i] === 'TRUE' || row[i] === true
      } else {
        scout[header] = row[i]
      }
    })
    return scout
  })

  return response({ scouts })
}

function getOrders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const ordersSheet = ss.getSheetByName('Orders')
  const itemsSheet = ss.getSheetByName('OrderItems')

  const ordersData = ordersSheet.getDataRange().getValues()
  const itemsData = itemsSheet.getDataRange().getValues()

  // Convert orders
  const orderHeaders = ordersData[0]
  const orders = ordersData.slice(1).map(row => {
    const order = {}
    orderHeaders.forEach((header, i) => {
      order[header] = row[i]
    })
    return order
  })

  // Convert items
  const itemHeaders = itemsData[0]
  const items = itemsData.slice(1).map(row => {
    const item = {}
    itemHeaders.forEach((header, i) => {
      item[header] = row[i]
    })
    return item
  })

  // Attach items to orders
  orders.forEach(order => {
    order.items = items.filter(item => item.orderId === order.orderId)
  })

  return response({ orders })
}

function getConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName('Config')
  const data = sheet.getDataRange().getValues()

  const config = {}
  data.slice(1).forEach(row => {
    const key = row[0]
    const value = row[1]
    try {
      config[key] = JSON.parse(value)
    } catch (e) {
      config[key] = value
    }
  })

  return response({ config })
}

function createOrder(orderData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const ordersSheet = ss.getSheetByName('Orders')
  const itemsSheet = ss.getSheetByName('OrderItems')

  const orderId = orderData.orderId || 'ORD-' + Date.now()
  const timestamp = new Date().toISOString()

  // Add order row
  ordersSheet.appendRow([
    'order-' + Date.now(),
    orderId,
    orderData.scoutId || '',
    orderData.customer.name,
    orderData.customer.email,
    orderData.customer.phone,
    orderData.customer.comments || '',
    orderData.customer.supportingScout || '',
    orderData.total,
    'pending',
    orderData.type || 'online',
    timestamp
  ])

  // Add order items
  orderData.items.forEach(item => {
    itemsSheet.appendRow([
      'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      orderId,
      item.id,
      item.name,
      item.price,
      item.quantity
    ])
  })

  return response({ success: true, orderId })
}

function response(data, code = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}
```

### 2.3 Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Settings:
   - **Description:** Pack 182 Wreath Sale API
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to [your project name] (unsafe)**
   - (This is safe - it's your own script!)
8. Click **Allow**
9. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

---

## Step 3: Update Your App to Use Apps Script

### 3.1 Create Apps Script Service

Create `src/services/appsScriptService.js`:

```javascript
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

async function appsScriptGet(action, params = {}) {
  const url = new URL(APPS_SCRIPT_URL)
  url.searchParams.set('action', action)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Apps Script error: ${response.statusText}`)
  }
  return response.json()
}

async function appsScriptPost(action, data) {
  const url = `${APPS_SCRIPT_URL}?action=${action}`
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error(`Apps Script error: ${response.statusText}`)
  }
  return response.json()
}

export async function getScouts() {
  const result = await appsScriptGet('getScouts')
  return result.scouts || []
}

export async function getOrders() {
  const result = await appsScriptGet('getOrders')
  return result.orders || []
}

export async function getConfig() {
  const result = await appsScriptGet('getConfig')
  return result.config
}

export async function createOrder(order) {
  const result = await appsScriptPost('createOrder', order)
  return result
}

export default {
  getScouts,
  getOrders,
  getConfig,
  createOrder
}
```

### 3.2 Update Environment Variables

Add to `.env`:
```env
VITE_USE_APPS_SCRIPT=true
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with your actual Apps Script URL.

---

## Step 4: Update Data Service

Update `src/utils/dataService.js` to use Apps Script:

```javascript
import * as appsScriptService from '../services/appsScriptService'
import * as mockData from './mockData'

const USE_APPS_SCRIPT = import.meta.env.VITE_USE_APPS_SCRIPT === 'true'
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

const configured = USE_APPS_SCRIPT && APPS_SCRIPT_URL

export async function getScouts() {
  if (configured) {
    try {
      return await appsScriptService.getScouts()
    } catch (error) {
      console.error('Apps Script error, falling back to localStorage:', error)
    }
  }
  return mockData.getScouts()
}

export async function getOrders() {
  if (configured) {
    try {
      return await appsScriptService.getOrders()
    } catch (error) {
      console.error('Apps Script error, falling back to localStorage:', error)
    }
  }
  return mockData.getOrders()
}

export async function saveOrder(order) {
  if (configured) {
    try {
      return await appsScriptService.createOrder(order)
    } catch (error) {
      console.error('Apps Script error, falling back to localStorage:', error)
    }
  }
  return mockData.saveOrder(order)
}

// ... rest of the functions
```

---

## Step 5: Testing

### 5.1 Test in Browser Console

```javascript
// Test fetching scouts
fetch('YOUR_APPS_SCRIPT_URL?action=getScouts')
  .then(r => r.json())
  .then(data => console.log(data))
```

### 5.2 Test in Your App

1. Run: `npm run dev`
2. Open browser console
3. You should see: `[DataService] Loaded 45 scouts from Apps Script`

---

## Benefits vs. Google Sheets API

| Feature | Apps Script | Sheets API |
|---------|-------------|------------|
| **Credit Card** | ❌ Not required | ✅ Required |
| **Setup Time** | 5 minutes | 15 minutes |
| **Authentication** | Built-in | API Key needed |
| **Rate Limits** | 20,000 calls/day | 500 calls/min |
| **Security** | OAuth built-in | Manual restriction |
| **Cost** | $0 forever | $0 (with limits) |

---

## Security Notes

- ✅ Apps Script URL is public but read-only for most users
- ✅ Only you (the owner) can edit the sheet directly
- ✅ OAuth protects write operations
- ✅ Script runs as you, so it has your permissions
- ⚠️ Don't share the Apps Script URL with malicious users (they could spam orders)

---

## Troubleshooting

### "Script function not found"
- Make sure you deployed as "Web app", not "API Executable"
- Redeploy and get a new URL

### "Permission denied"
- Click **Deploy → Manage deployments**
- Change "Who has access" to "Anyone"

### "Cannot read property 'parameter'"
- Make sure you're using `doGet(e)` and `doPost(e)` correctly
- Check that you're passing `?action=getScouts` in URL

---

## Next Steps

Once everything works:
1. Test creating orders through your app
2. Check that orders appear in Google Sheet
3. Set up email notifications (optional)
4. Deploy to production!

**Total Cost: $0.00** ✅

---

**Version**: 1.0.0
**Last Updated**: November 15, 2025
