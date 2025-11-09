# Backend Setup with Google Sheets - Pack 182 Wreath Sale

This guide shows you how to set up a completely **FREE** backend using Google Sheets as your database. No credit card required!

---

## Why Google Sheets?

- ✅ **100% Free** - No credit card needed
- ✅ **Easy Setup** - Just create a spreadsheet
- ✅ **Familiar Interface** - Everyone knows how to use sheets
- ✅ **Built-in Backup** - Google handles backups automatically
- ✅ **Collaboration** - Multiple admins can view data
- ✅ **Export Ready** - Easy to export to Excel/CSV

---

## Step 1: Create Your Google Sheet

### 1.1 Create a New Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click "Blank" to create a new spreadsheet
3. Name it: **"Pack 182 Wreath Sale Database"**

### 1.2 Create Required Sheets

Create 4 sheets (tabs) in your spreadsheet:

#### Sheet 1: **Scouts**
| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H |
|----------|----------|----------|----------|----------|----------|----------|----------|
| id       | name     | slug     | rank     | email    | parentName | parentEmail | active |
| scout-1  | Tommy Anderson | tommy-anderson | Wolf | tommy@email.com | Tom Anderson | tom@email.com | TRUE |

#### Sheet 2: **Orders**
| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I | Column J | Column K |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| id       | orderId  | scoutId  | customerName | customerEmail | customerPhone | comments | supportingScout | total | status | orderDate |
| order-1  | ORD-123456 | scout-1 | John Doe | john@email.com | 555-1234 | | | 70.00 | pending | 2025-11-09 |

#### Sheet 3: **OrderItems**
| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| id       | orderId  | productId | productName | price | quantity |
| item-1   | order-1  | red-bow | Red Bow Wreath | 35.00 | 2 |

#### Sheet 4: **Config**
| Column A | Column B |
|----------|----------|
| key      | value    |
| siteConfig | (JSON data goes here) |

---

## Step 2: Set Up Google Sheets API Access

### 2.1 Enable the Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (it's free, no billing required):
   - Click "Select a project" → "New Project"
   - Name: **"Pack 182 Wreath Sale"**
   - Click "Create"

3. Enable Google Sheets API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click it and press "Enable"

### 2.2 Create API Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy your API key (looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXX`)
4. Click "Restrict Key" (recommended):
   - Under "API restrictions" → Select "Restrict key"
   - Choose "Google Sheets API"
   - Click "Save"

### 2.3 Make Your Sheet Public

1. Open your Google Sheet
2. Click "Share" button (top right)
3. Click "Change to anyone with the link"
4. Set permission to **"Viewer"**
5. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
   Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

---

## Step 3: Install Google Sheets Integration

### 3.1 Install Required Package

```bash
cd /Users/jimmcgowan/Jim/BoySchools/wreath-site
npm install gapi-script
```

### 3.2 Create Sheets Service

Create `src/services/sheetsService.js`:

```javascript
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

const SHEETS = {
  SCOUTS: 'Scouts',
  ORDERS: 'Orders',
  ORDER_ITEMS: 'OrderItems',
  CONFIG: 'Config'
}

// Helper to fetch data from a sheet
async function getSheetData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`
  const response = await fetch(url)
  const data = await response.json()

  if (!data.values || data.values.length < 2) return []

  const headers = data.values[0]
  const rows = data.values.slice(1)

  return rows.map(row => {
    const obj = {}
    headers.forEach((header, index) => {
      obj[header] = row[index] || ''
    })
    return obj
  })
}

// Helper to append data to a sheet
async function appendSheetData(sheetName, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}:append?valueInputOption=RAW&key=${API_KEY}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [values] })
  })

  return response.json()
}

// Get all scouts
export async function getScouts() {
  const scouts = await getSheetData(SHEETS.SCOUTS)
  return scouts.map(s => ({
    ...s,
    active: s.active === 'TRUE'
  }))
}

// Get all orders
export async function getOrders() {
  const orders = await getSheetData(SHEETS.ORDERS)
  const orderItems = await getSheetData(SHEETS.ORDER_ITEMS)

  return orders.map(order => ({
    ...order,
    total: parseFloat(order.total),
    items: orderItems
      .filter(item => item.orderId === order.orderId)
      .map(item => ({
        ...item,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity)
      }))
  }))
}

// Create new order
export async function createOrder(order) {
  const orderId = `order-${Date.now()}`
  const orderValues = [
    orderId,
    order.orderId,
    order.scoutId || '',
    order.customer.name,
    order.customer.email,
    order.customer.phone,
    order.customer.comments || '',
    order.customer.supportingScout || '',
    order.total,
    'pending',
    new Date().toISOString()
  ]

  await appendSheetData(SHEETS.ORDERS, orderValues)

  // Add order items
  for (const item of order.items) {
    const itemValues = [
      `item-${Date.now()}-${Math.random()}`,
      order.orderId,
      item.id,
      item.name,
      item.price,
      item.quantity
    ]
    await appendSheetData(SHEETS.ORDER_ITEMS, itemValues)
  }

  return { success: true, orderId: order.orderId }
}

// Get config
export async function getConfig() {
  const configData = await getSheetData(SHEETS.CONFIG)
  const siteConfig = configData.find(row => row.key === 'siteConfig')
  return siteConfig ? JSON.parse(siteConfig.value) : null
}

export default {
  getScouts,
  getOrders,
  createOrder,
  getConfig
}
```

### 3.3 Update Environment Variables

Add to your `.env` file:

```env
# Google Sheets Configuration
VITE_GOOGLE_SHEET_ID=your_sheet_id_here
VITE_GOOGLE_API_KEY=your_api_key_here
```

---

## Step 4: Update Data Layer

### 4.1 Create Sheets Adapter

Create `src/utils/sheetsAdapter.js`:

```javascript
import * as sheetsService from '../services/sheetsService'

// Wrapper to use Sheets or fallback to localStorage
const USE_SHEETS = import.meta.env.VITE_USE_GOOGLE_SHEETS === 'true'

export async function getScouts() {
  if (USE_SHEETS) {
    return await sheetsService.getScouts()
  }
  // Fallback to localStorage
  const scouts = localStorage.getItem('scouts')
  return scouts ? JSON.parse(scouts) : []
}

export async function getOrders() {
  if (USE_SHEETS) {
    return await sheetsService.getOrders()
  }
  // Fallback to localStorage
  const orders = localStorage.getItem('orders')
  return orders ? JSON.parse(orders) : []
}

export async function saveOrder(order) {
  if (USE_SHEETS) {
    return await sheetsService.createOrder(order)
  }
  // Fallback to localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  orders.push(order)
  localStorage.setItem('orders', JSON.stringify(orders))
  return { success: true }
}
```

---

## Step 5: Alternative - Google Forms + Sheets

Even simpler option using Google Forms:

### 5.1 Create a Google Form

1. Go to [Google Forms](https://forms.google.com/)
2. Click "Blank" to create new form
3. Add these fields:
   - Customer Name (Short answer)
   - Email (Short answer)
   - Phone (Short answer)
   - Scout Name (Short answer)
   - Products Ordered (Long answer)
   - Order Total (Short answer)

### 5.2 Link Form to Sheet

1. Click "Responses" tab in form
2. Click the Google Sheets icon
3. Create a new spreadsheet
4. All form submissions automatically go to the sheet!

### 5.3 Embed Form in Website

```javascript
// Simple redirect to Google Form
window.location.href = 'https://forms.gle/YOUR_FORM_ID'
```

---

## Step 6: Email Notifications (Free Options)

### Option A: EmailJS (Completely Free)

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Free tier: 200 emails/month
3. Connect your Gmail account
4. No credit card required

Install:
```bash
npm install @emailjs/browser
```

Setup:
```javascript
import emailjs from '@emailjs/browser'

emailjs.init('YOUR_PUBLIC_KEY')

// Send order confirmation
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
  to_email: customer.email,
  order_id: order.orderId,
  customer_name: customer.name,
  total: order.total
})
```

### Option B: Formspree (Free)

1. Sign up at [Formspree](https://formspree.io/)
2. Free tier: 50 submissions/month
3. No credit card required

```javascript
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: customer.email,
    subject: 'Order Confirmation',
    message: `Your order ${order.orderId} has been received!`
  })
})
```

---

## Step 7: Deployment (100% Free)

### Option 1: GitHub Pages (Free)

1. Push code to GitHub
2. Run: `npm run deploy`
3. Your site is live at: `https://username.github.io/wreath-site/`

### Option 2: Netlify (Free)

1. Sign up at [Netlify](https://netlify.com/) (free account)
2. Connect your GitHub repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

Free features:
- 100 GB bandwidth/month
- Custom domain support
- Automatic SSL/HTTPS
- Continuous deployment from Git

### Option 3: Vercel (Free)

1. Sign up at [Vercel](https://vercel.com/) (free account)
2. Import your GitHub repository
3. Configure:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables
5. Deploy!

Free features:
- Unlimited bandwidth
- Custom domains
- Automatic SSL
- Edge network

---

## Complete Free Setup Summary

### What You Need:

1. **Google Account** (free)
2. **Google Sheet** (free)
3. **Google Sheets API Key** (free, no billing)
4. **EmailJS Account** (free - 200 emails/month)
5. **GitHub Account** (free)
6. **Netlify or Vercel Account** (free)

### Total Cost: **$0.00** 💰

### Monthly Limits:
- Google Sheets API: 500 requests/minute (more than enough)
- EmailJS: 200 emails/month
- Netlify: 100 GB bandwidth/month
- Vercel: Unlimited

---

## Step 8: Testing Your Setup

### 8.1 Test Sheets Connection

```javascript
// In browser console:
import { getScouts } from './src/services/sheetsService'
const scouts = await getScouts()
console.log(scouts)
```

### 8.2 Test Order Creation

1. Add items to cart
2. Go to checkout
3. Fill in customer info
4. Submit order
5. Check Google Sheet - new row should appear!

---

## Troubleshooting

### Error: "API key not valid"
- Check your API key is correct in `.env`
- Make sure you enabled Google Sheets API
- Verify API key restrictions allow your domain

### Error: "The caller does not have permission"
- Make sure sheet is shared as "Anyone with the link can view"
- Check Sheet ID is correct
- Verify sheet has the correct sheet names (tabs)

### Orders not appearing in sheet
- Check browser console for errors
- Verify Sheet ID and API key
- Make sure sheet has header rows
- Check network tab for failed requests

### Emails not sending
- Verify EmailJS credentials
- Check email template is created
- Make sure you're not over the free limit (200/month)
- Check spam folder

---

## Data Management

### Viewing Orders

Just open your Google Sheet! You can:
- Sort and filter orders
- Export to Excel/CSV
- Share with other admins
- Create charts and reports

### Backing Up Data

Google automatically backs up your sheet, but you can also:
1. File → Download → Excel/CSV
2. Make a copy: File → Make a copy
3. Use Google Takeout for full backup

### Managing Scouts

Add/edit scouts directly in the sheet or through admin dashboard.

---

## Security Notes

- ✅ Sheet is read-only for visitors (viewer permission)
- ✅ API key is restricted to Sheets API only
- ✅ No sensitive data stored (no credit cards)
- ✅ Sheet data is encrypted by Google
- ⚠️ Don't share your API key publicly
- ⚠️ Keep Sheet ID in environment variables

---

## Scaling Considerations

Google Sheets free tier handles:
- ✅ Up to 5 million cells per sheet
- ✅ 500 requests/minute to API
- ✅ Suitable for 100-500 orders
- ✅ Perfect for most scout packs

If you outgrow Sheets, you can migrate to:
- Airtable (free tier: 1,200 records)
- Supabase (free tier: 500 MB database)
- Firebase Firestore (free tier: 50k reads/day)

---

## Support Resources

- Google Sheets API Docs: https://developers.google.com/sheets/api
- EmailJS Docs: https://www.emailjs.com/docs/
- Netlify Docs: https://docs.netlify.com/
- Vercel Docs: https://vercel.com/docs

---

**No credit card. No monthly fees. 100% free. 🎉**

---

**Version**: 1.2.0
**Last Updated**: November 9, 2025
