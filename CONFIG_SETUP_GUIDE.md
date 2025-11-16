# Google Sheets Configuration Setup Guide

## Overview

The Pack 182 Wreath Sale application loads all site configuration from Google Sheets. This allows non-technical users to update site content, products, campaign dates, and other settings without requiring code deployments.

## How It Works

1. **Configuration Storage**: All site config is stored as a single JSON object in your Google Spreadsheet
2. **Loading**: The app fetches config from Google Sheets when it starts
3. **Caching**: Config is cached in memory for 5 minutes to ensure fast page loads
4. **Fallback**: If Google Sheets is unavailable, the app falls back to local `src/config/content.json`

## Initial Setup

### Step 1: Prepare Your Google Spreadsheet

1. Open your Pack 182 Wreath Sale Google Spreadsheet
2. Create a new sheet tab called **Config** (if it doesn't already exist)
3. Set up the header row:
   - Cell A1: Type `Key`
   - Cell B1: Type `Value`

### Step 2: Export Your Current Configuration

Run the export script to generate the JSON for Google Sheets:

```bash
node export-config-for-sheets.js
```

This will:
- Display formatted instructions
- Output a compact JSON string to copy
- Save a formatted version to `config-for-sheets.json` for reference

### Step 3: Paste Configuration into Google Sheets

1. In your Google Spreadsheet's **Config** tab:
   - Cell A2: Type `siteConfig`
   - Cell B2: Paste the JSON string from the export script output

2. The entire JSON should be in cell B2 as a single continuous string

### Step 4: Verify Apps Script Deployment

Make sure your Apps Script backend is deployed and the URL is in your `.env` file:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_USE_APPS_SCRIPT=true
```

### Step 5: Test the Configuration

1. Start your development server: `npm run dev`
2. Watch the browser console for config loading messages:
   - ✅ `[ConfigLoader] Fetching config from Google Sheets...`
   - ✅ `[ConfigLoader] ✅ Loaded config from Google Sheets`
3. Verify that your site displays correctly with the Sheets configuration

## Editing Configuration

### Option 1: Edit JSON Directly in Cell B2

1. Click on cell B2 in the Config sheet
2. Click in the formula bar to edit the JSON
3. Make your changes carefully (JSON must be valid)
4. Press Enter to save

### Option 2: Use a JSON Editor (Recommended)

1. Copy the JSON from cell B2
2. Paste into a JSON editor like:
   - [jsoneditoronline.org](https://jsoneditoronline.org)
   - VS Code with a JSON extension
   - Any text editor with JSON formatting
3. Make your changes
4. Validate the JSON (most editors will show errors)
5. Copy the formatted JSON back into cell B2

### Option 3: Update Local File and Re-export

1. Edit `src/config/content.json` locally
2. Run `node export-config-for-sheets.js`
3. Copy the new JSON output
4. Paste into cell B2

## Configuration Structure

The configuration JSON contains these main sections:

### Pack Information
```json
{
  "pack": {
    "name": "Pack 182",
    "location": "Irving, TX",
    "leaderEmail": "pack182tech@gmail.com"
  }
}
```

### Campaign Dates
```json
{
  "campaign": {
    "orderDeadline": "November 18, 2024",
    "pickupDate": "December 7, 2024",
    "pickupTime": "9:00 AM - 12:00 PM",
    "pickupLocation": "Good Shepherd Episcopal Church"
  }
}
```

### Products
```json
{
  "products": [
    {
      "id": "1",
      "name": "Balsam Fir Wreath",
      "price": 35.00,
      "image": "balsam-fir.jpg",
      "category": "wreaths",
      "active": true,
      "description": "Classic evergreen wreath..."
    }
  ]
}
```

### Email Templates
```json
{
  "emailTemplates": {
    "orderConfirmation": {
      "subject": "Order Confirmation - Pack 182 Wreath Sale",
      "greeting": "Thank you for your order!",
      "footer": "Questions? Contact us at pack182tech@gmail.com"
    }
  }
}
```

### Zelle Payment Info
```json
{
  "zelle": {
    "recipientFirstName": "First",
    "recipientLastName": "Last",
    "recipientContact": "email@example.com",
    "qrCodeImage": "zelle-qr.png",
    "qrCodeText": "Scan to Pay with Zelle"
  }
}
```

See `src/config/content.json` for the complete structure.

## Cache Behavior

- **Cache Duration**: 5 minutes
- **When Cached**: After first successful load from Google Sheets
- **How to Force Reload**:
  1. Wait 5 minutes, then refresh the page
  2. Or clear browser cache and refresh
  3. Or restart the development server

## Common Editing Tasks

### Update Product Pricing

1. Find the product in the `products` array
2. Update the `price` field
3. Save the JSON back to cell B2
4. Wait 5 minutes or clear cache to see changes

### Add a New Product

1. Copy an existing product object in the `products` array
2. Update all fields (id, name, price, image, description, etc.)
3. Make sure `active` is set to `true`
4. Add the product image to `public/images/products/`
5. Save the JSON back to cell B2

### Disable a Product

1. Find the product in the `products` array
2. Set `"active": false`
3. Save the JSON back to cell B2

### Update Campaign Dates

1. Find the `campaign` section
2. Update the date/time fields
3. Save the JSON back to cell B2

### Update Email Templates

1. Find the `emailTemplates` section
2. Update the subject, greeting, or footer text
3. Save the JSON back to cell B2

## Troubleshooting

### Config Not Loading from Sheets

**Symptoms**: Console shows "Using fallback local config"

**Solutions**:
1. Verify Apps Script is deployed and URL is correct in `.env`
2. Check that cell B2 contains valid JSON
3. Check browser console for specific error messages
4. Verify Google Sheets permissions (script must have access)

### Invalid JSON Error

**Symptoms**: Console shows "Error parsing config JSON"

**Solutions**:
1. Copy JSON from cell B2
2. Validate it at [jsonlint.com](https://jsonlint.com)
3. Fix any syntax errors (missing commas, quotes, brackets)
4. Paste corrected JSON back into cell B2

### Changes Not Appearing

**Symptoms**: Updated config but site still shows old values

**Solutions**:
1. Check browser console - it may be using cached config
2. Wait 5 minutes for cache to expire
3. Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+F5)
4. Clear browser cache completely

### App Shows Loading Screen Forever

**Symptoms**: Stuck on "Loading Pack 182 Wreath Sale..."

**Solutions**:
1. Check browser console for error messages
2. Verify Apps Script backend is accessible
3. Check that VITE_APPS_SCRIPT_URL is correct in `.env`
4. Test Apps Script URL directly in browser (should return "OK")

## Best Practices

1. **Always Validate JSON**: Before saving to Sheets, validate your JSON to avoid breaking the site
2. **Test Changes Locally**: If possible, test config changes in development before updating production
3. **Keep Backups**: Save a copy of working config before making major changes
4. **Document Changes**: Keep notes about what you changed and why
5. **Use Version Control**: The `config-for-sheets.json` file is tracked in git as a backup

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your JSON is valid at [jsonlint.com](https://jsonlint.com)
3. Contact the technical team at pack182tech@gmail.com
4. Reference this guide and provide specific error messages

## Files Reference

- **Google Sheets Config Tab**: Single source of truth for production
- **src/config/content.json**: Local fallback, also used for development
- **export-config-for-sheets.js**: Helper script to export config
- **config-for-sheets.json**: Formatted backup of last export
- **src/utils/configLoader.js**: Code that loads config from Sheets
- **APPS_SCRIPT_BACKEND.js**: Backend code that serves config
