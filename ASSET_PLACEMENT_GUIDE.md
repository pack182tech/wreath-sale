# Asset Placement Guide

This guide shows you exactly where to place all your campaign assets (photos, logos, QR codes, and content).

---

## Directory Structure

```
/wreath-site/
├── public/
│   └── images/
│       ├── products/          ← Wreath product photos go here
│       ├── branding/          ← Pack 182 logo goes here
│       └── zelle/             ← Zelle QR code goes here
└── src/
    └── config/
        └── content.json       ← Campaign details and text content
```

---

## 1. Wreath Product Photos

**Location:** `/public/images/products/`

### What to Place Here:
Place one photo for each ribbon color variation you're selling.

### File Naming Convention:
Use descriptive, lowercase names with hyphens:
- `red-ribbon-wreath.jpg`
- `green-ribbon-wreath.jpg`
- `gold-ribbon-wreath.jpg`
- `silver-ribbon-wreath.jpg`
- `plaid-ribbon-wreath.jpg`
- etc.

### Requirements:
- **Format:** JPG or PNG
- **Recommended size:** 800x800 pixels (square)
- **Max file size:** < 500KB per image (compress if needed)
- **Background:** Clean, plain background preferred
- **Lighting:** Well-lit, clear photo showing ribbon details

### Example:
```bash
public/
  images/
    products/
      red-ribbon-wreath.jpg
      green-ribbon-wreath.jpg
      gold-ribbon-wreath.jpg
      burgundy-ribbon-wreath.jpg
      navy-ribbon-wreath.jpg
```

---

## 2. Pack 182 Branding

**Location:** `/public/images/branding/`

### What to Place Here:
- Pack 182 logo (primary)
- Pack 182 logo alternative versions (optional)

### File Naming:
- `pack-logo.png` (primary logo with transparency)
- `pack-logo.svg` (vector version, if available)
- `pack-logo-white.png` (white version for dark backgrounds, optional)

### Requirements:
- **Format:** PNG with transparent background (preferred) or SVG
- **Recommended size:** 500x500 pixels minimum
- **Max file size:** < 200KB
- **Quality:** High resolution, crisp edges

### Example:
```bash
public/
  images/
    branding/
      pack-logo.png
      pack-logo.svg
```

---

## 3. Zelle Payment QR Code

**Location:** `/public/images/zelle/`

### What to Place Here:
The QR code that customers scan to send Zelle payments to the pack.

### File Naming:
- `zelle-qr-code.png`

### How to Get This:
1. Open your Zelle app
2. Go to "Request Money" or your profile
3. Find your QR code
4. Take a screenshot or download it
5. Crop to just the QR code
6. Save as `zelle-qr-code.png`

### Requirements:
- **Format:** PNG or JPG
- **Recommended size:** 500x500 pixels (square)
- **Quality:** Must be scannable - test by scanning with your phone
- **Crop:** Remove any extra app interface, just the QR code

### Example:
```bash
public/
  images/
    zelle/
      zelle-qr-code.png
```

---

## 4. Campaign Configuration & Content

**Location:** `/src/config/content.json`

This file will be created for you, but you'll need to provide the following information:

### Information Needed:

#### Campaign Details:
- **Sale Start Date:** When customers can start ordering (e.g., "2025-12-01")
- **Sale End Date:** Last day for orders (e.g., "2025-12-15")
- **Pickup Date:** When customers pick up wreaths (e.g., "2025-12-20")
- **Pickup Time:** Time window (e.g., "4:00 PM - 6:00 PM")
- **Pickup Location:** Full address (e.g., "Three Bridges Reformed Church, 123 Main St, Anytown, USA")

#### Wreath Products:
For EACH ribbon color, provide:
- **Ribbon Color Name:** (e.g., "Red Ribbon")
- **Description:** Short description (e.g., "Classic evergreen wreath with vibrant red ribbon")
- **Price:** Dollar amount (e.g., 25.00)
- **Image Filename:** Must match the file in `/public/images/products/` (e.g., "red-ribbon-wreath.jpg")

#### Zelle Payment Information:
- **Recipient Name:** Name on the Zelle account (e.g., "Pack 182 Booster Club")
- **Recipient Email/Phone:** Email or phone registered with Zelle (e.g., "pack182@example.com" or "555-123-4567")
- **Payment Instructions:** Custom text for customers (e.g., "Please include your order number in the Zelle memo")

#### Donation Information:
- **Recipient Organization:** Who receives the donations (e.g., "Three Bridges Reformed Church")
- **Donation Description:** Purpose text (e.g., "Support our local church's youth programs and community outreach")

#### Pack Information:
- **Pack Name:** (e.g., "Cub Scout Pack 182")
- **Pack Location:** City/town (e.g., "Anytown, USA")
- **Pack Leader Name:** (e.g., "Mike Johnson")
- **Pack Leader Email:** (e.g., "leader@pack182.org")

---

## 5. Asset Preparation Checklist

Before you begin, gather and prepare these assets:

### Photos (Wreath Products):
- [ ] Take or collect photos of each wreath ribbon color
- [ ] Edit/crop photos to be square (1:1 aspect ratio)
- [ ] Optimize file sizes (compress to < 500KB each)
- [ ] Rename files using the naming convention above
- [ ] Place in `/public/images/products/`

### Branding:
- [ ] Get Pack 182 logo from pack leadership
- [ ] Ensure logo has transparent background (PNG) or is vector (SVG)
- [ ] Resize if needed (at least 500x500px)
- [ ] Name as `pack-logo.png` or `pack-logo.svg`
- [ ] Place in `/public/images/branding/`

### Zelle QR Code:
- [ ] Get QR code from Zelle app
- [ ] Screenshot or download
- [ ] Crop to just the QR code
- [ ] Test scanning with phone camera
- [ ] Name as `zelle-qr-code.png`
- [ ] Place in `/public/images/zelle/`

### Campaign Information:
- [ ] Confirm all campaign dates with pack leadership
- [ ] Get final wreath prices
- [ ] List all ribbon color options
- [ ] Write descriptions for each ribbon color
- [ ] Get Zelle account details
- [ ] Get donation recipient organization name
- [ ] Review and approve all text content

---

## 6. Quick Reference: What Goes Where

| Asset Type | Location | Example Filename |
|------------|----------|-----------------|
| Wreath Photos | `/public/images/products/` | `red-ribbon-wreath.jpg` |
| Pack Logo | `/public/images/branding/` | `pack-logo.png` |
| Zelle QR Code | `/public/images/zelle/` | `zelle-qr-code.png` |
| Campaign Info | `/src/config/content.json` | (JSON configuration file) |

---

## 7. How to Add Your Assets

### Step 1: Navigate to the project directory
```bash
cd /Users/jimmcgowan/Jim/BoySchools/wreath-site
```

### Step 2: Copy your files
Use Finder or command line to copy your prepared assets:

**Via Finder:**
1. Open Finder
2. Navigate to `/Users/jimmcgowan/Jim/BoySchools/wreath-site/public/images/`
3. Drag and drop your files into the appropriate subdirectories

**Via Command Line:**
```bash
# Example: Copy wreath photos
cp ~/Downloads/red-ribbon-wreath.jpg public/images/products/

# Example: Copy logo
cp ~/Downloads/pack-logo.png public/images/branding/

# Example: Copy Zelle QR
cp ~/Downloads/zelle-qr.png public/images/zelle/zelle-qr-code.png
```

### Step 3: Verify files are in place
```bash
# Check products
ls -lh public/images/products/

# Check branding
ls -lh public/images/branding/

# Check zelle
ls -lh public/images/zelle/
```

You should see your files listed with their sizes.

---

## 8. Sample Content Configuration

Here's what your `/src/config/content.json` file will look like (we'll create this together):

```json
{
  "campaign": {
    "startDate": "2025-12-01",
    "endDate": "2025-12-15",
    "pickupDate": "2025-12-20",
    "pickupTime": "4:00 PM - 6:00 PM",
    "pickupLocation": "Three Bridges Reformed Church, 123 Main St, Anytown, USA"
  },
  "pack": {
    "name": "Cub Scout Pack 182",
    "location": "Anytown, USA",
    "leaderName": "Mike Johnson",
    "leaderEmail": "leader@pack182.org"
  },
  "products": [
    {
      "id": "red-ribbon",
      "name": "Red Ribbon Wreath",
      "description": "Classic evergreen wreath with vibrant red ribbon",
      "price": 25.00,
      "image": "red-ribbon-wreath.jpg"
    },
    {
      "id": "green-ribbon",
      "name": "Green Ribbon Wreath",
      "description": "Traditional green ribbon on fresh evergreen wreath",
      "price": 25.00,
      "image": "green-ribbon-wreath.jpg"
    }
  ],
  "donation": {
    "recipient": "Three Bridges Reformed Church",
    "description": "Support our local church's youth programs and community outreach"
  },
  "zelle": {
    "recipientName": "Pack 182 Booster Club",
    "recipientContact": "pack182@example.com",
    "instructions": "Please include your order number in the Zelle memo"
  }
}
```

---

## 9. Need Help?

If you have questions about:
- **Image formats or sizes:** Ask me and I'll help you convert or resize
- **Where a specific file goes:** Refer to sections 1-4 above
- **Content configuration:** We'll set this up together after your images are in place

---

## Next Steps

Once you've placed all your assets:

1. ✅ **Verify** all files are in the correct locations (use checklist above)
2. ✅ **Test** that images display correctly
3. ✅ **Configure** the content.json file with your campaign details
4. ✅ **Review** everything before launch

---

**Last Updated:** 2025-11-08
**Status:** Ready for Asset Placement
