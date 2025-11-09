# Quick Start Guide - Pack 182 Wreath Sale

Get your wreath sale website up and running in minutes!

---

## Prerequisites

- Node.js 18+ installed
- Git installed
- A code editor (VS Code recommended)

---

## Step 1: Install Dependencies

```bash
cd /Users/jimmcgowan/Jim/BoySchools/wreath-site
npm install
```

---

## Step 2: Configure Environment (Optional for Development)

The app works with mock data out of the box. For production, set up backend services:

```bash
cp .env.example .env
# Edit .env with your credentials
```

See `BACKEND_SETUP.md` for detailed backend configuration.

---

## Step 3: Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000/wreath-site/`

---

## Step 4: Configure Your Sale

1. **Login to Admin Dashboard**
   - Visit: `http://localhost:3000/wreath-site/login`
   - Default credentials: `admin@pack182.org` / `admin123`

2. **Go to Site Configuration Tab**
   - Update campaign dates
   - Set pickup location and time
   - Edit hero text
   - Customize scout attribution banner

3. **Add Scouts**
   - Go to "Scouts" tab
   - Click "Add New Scout"
   - Fill in scout information
   - Save

4. **Update Products** (if needed)
   - Edit `src/config/content.json`
   - Update product names, prices, descriptions
   - Add/remove products as needed

---

## Step 5: Add Your Assets

### Pack Logo
```bash
# Place your logo here:
public/images/branding/pack182logo.png
```

### Background Image
```bash
# Place your background image here:
public/images/branding/background-optimized.jpg
```

### Product Images
```bash
# Place product images here:
public/images/products/red-bow.png
public/images/products/plaid-bow.png
public/images/products/gold-bow.png
# etc.
```

### Zelle QR Code
```bash
# Place your Zelle QR code here:
public/images/zelle/zelle-qrcode.png
```

See `ASSET_PLACEMENT_GUIDE.md` for detailed instructions.

---

## Step 6: Test Scout Attribution

Each scout gets a unique link:
```
http://localhost:3000/wreath-site/?scout=scout-slug
```

Example:
```
http://localhost:3000/wreath-site/?scout=tommy-anderson
```

When customers visit via this link, their orders are attributed to that scout!

---

## Step 7: Generate Scout QR Codes

1. Go to Admin Dashboard → Scouts tab
2. Click "View QR Code" for any scout
3. Download the QR code
4. Print or email to parents

---

## Step 8: Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

---

## Step 9: Deploy

### Option A: GitHub Pages

```bash
npm run deploy
```

Your site will be live at: `https://yourusername.github.io/wreath-site/`

### Option B: Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variables (if using backend)
7. Deploy!

### Option C: Netlify

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com/)
3. Add new site from Git
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Deploy!

---

## Common Tasks

### Change Admin Password

Edit `src/utils/mockData.js`:
```javascript
const ADMIN_USER = {
  email: 'admin@pack182.org',
  password: 'your_new_password', // Change this
  role: 'admin'
}
```

### Add a New Scout

Admin Dashboard → Scouts → Add New Scout

Or programmatically in console:
```javascript
import { saveScout } from './src/utils/mockData'

saveScout({
  name: 'Johnny Smith',
  slug: 'johnny-smith',
  rank: 'Wolf',
  email: 'johnny@example.com',
  parentName: 'John Smith Sr',
  parentEmail: 'parent@example.com',
  active: true
})
```

### View All Orders

Admin Dashboard → Orders tab

### Export Order Data

In Admin Dashboard, orders are stored in localStorage. To export:
```javascript
// In browser console:
console.log(JSON.stringify(localStorage.getItem('orders'), null, 2))
```

---

## Troubleshooting

### Site Not Loading
- Check that dev server is running: `npm run dev`
- Check the URL includes base path: `/wreath-site/`

### Images Not Showing
- Verify images are in correct directories
- Check file names match exactly
- Ensure `basePath` is used in image URLs

### Orders Not Saving
- Check browser console for errors
- Verify localStorage is enabled
- Clear browser cache and try again

### Scout Attribution Not Working
- Check URL has correct format: `?scout=slug`
- Verify scout slug matches exactly (case-sensitive)
- Check browser console for errors

---

## Getting Help

1. Check `README.md` for overview
2. See `BACKEND_SETUP.md` for backend configuration
3. See `ASSET_PLACEMENT_GUIDE.md` for asset organization
4. Check browser console for error messages

---

## Next Steps

1. ✅ Test all features locally
2. ✅ Add your scouts
3. ✅ Customize content and branding
4. ✅ Set up backend services (optional)
5. ✅ Deploy to production
6. ✅ Share scout links with families
7. ✅ Monitor orders in admin dashboard

---

**Good luck with your wreath sale! 🎄**

---

**Version**: 1.2.0
**Last Updated**: November 9, 2025
