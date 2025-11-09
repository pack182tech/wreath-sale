# 100% Free Deployment Guide

Deploy your Pack 182 Wreath Sale website **completely free** - no credit card required!

---

## Total Cost: $0.00/month 💰

This guide uses only free services:
- ✅ Google Sheets (database)
- ✅ EmailJS (email notifications)
- ✅ Netlify or Vercel (hosting)
- ✅ GitHub Pages (alternative hosting)
- ✅ Google Cloud (API only, no billing)

---

## Prerequisites

- Google Account
- GitHub Account
- 30 minutes of your time

---

## Part 1: Database Setup (Google Sheets)

### Step 1: Create Your Spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com/)
2. Create new spreadsheet: **"Pack 182 Wreath Sale Database"**
3. Create 4 sheets (tabs):

**Sheet 1: Scouts**
```
Row 1 (Headers): id | name | slug | rank | email | parentName | parentEmail | active
Row 2 (Example): scout-1 | Tommy Anderson | tommy-anderson | Wolf | tommy@email.com | Tom Anderson | tom@email.com | TRUE
```

**Sheet 2: Orders**
```
Row 1 (Headers): id | orderId | scoutId | customerName | customerEmail | customerPhone | comments | supportingScout | total | status | orderDate
```

**Sheet 3: OrderItems**
```
Row 1 (Headers): id | orderId | productId | productName | price | quantity
```

**Sheet 4: Config**
```
Row 1 (Headers): key | value
Row 2: siteConfig | (paste your config JSON here)
```

### Step 2: Get Sheet ID

1. Copy URL of your sheet
2. Extract the ID from: `https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit`
   1. Actual URL: https://docs.google.com/spreadsheets/d/1KEYQDpX5k8umyACkc9ynyUD7QN0BJh10iOBjMI33S3A/edit?gid=1153100398#gid=1153100398
   2. ID: 1KEYQDpX5k8umyACkc9ynyUD7QN0BJh10iOBjMI33S3A
3. Save this ID for later

### Step 3: Make Sheet Public

1. Click "Share" button
2. Change to "Anyone with the link"
3. Set permission to "Viewer"
4. Click "Done"

### Step 4: Get API Key (No Billing Required!)

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create new project: **"Pack 182 Wreath Sale"**
3. Click "Enable APIs and Services"
4. Search for "Google Sheets API"
5. Click "Enable"
6. Go to "Credentials" → "Create Credentials" → "API Key"
7. Copy your API key
8. Click "Restrict Key":
   - Name: "Sheets API Key"
   - API restrictions: "Restrict key" → Select "Google Sheets API"
   - Save

**Note**: You do NOT need to enable billing or add a credit card!

---

## Part 2: Email Setup (EmailJS - Free)

### Step 1: Create EmailJS Account

1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up (free account)
3. Free tier: 200 emails/month

### Step 2: Connect Your Gmail

1. Go to "Email Services"
2. Click "Add New Service"
3. Select "Gmail"
4. Click "Connect Account"
5. Authorize EmailJS to send from your Gmail

### Step 3: Create Email Template

1. Go to "Email Templates"
2. Click "Create New Template"
3. Template name: "Order Confirmation"
4. Template content:
```
Subject: Order Confirmation - {{order_id}}

Hi {{customer_name}},

Thank you for your order!

Order Number: {{order_id}}
Total: ${{total}}

{{#if scout_name}}
Your purchase supports: {{scout_name}}
{{/if}}

Payment Instructions:
Please pay via Zelle to: threebridgespack182@gmail.com
Include your order number in the memo.

Thank you for supporting Pack 182!
```
5. Click "Save"

### Step 4: Get Credentials

1. Go to "Integration" tab
2. Copy:
   - Service ID
   - Template ID
   - Public Key

---

## Part 3: Configure Your Website

### Step 1: Create .env File

```bash
cd /Users/jimmcgowan/Jim/BoySchools/wreath-site
cp .env.example .env
```

### Step 2: Edit .env File

Add your credentials:

```env
# Google Sheets
VITE_USE_GOOGLE_SHEETS=true
VITE_GOOGLE_SHEET_ID=your_sheet_id_here
VITE_GOOGLE_API_KEY=your_api_key_here

# EmailJS
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id

# Pack Info
VITE_PACK_NAME=Cub Scout Pack 182
VITE_PACK_LOCATION=Readington, NJ
VITE_PACK_LEADER_EMAIL=threebridgespack182@gmail.com
```

### Step 3: Test Locally

```bash
npm run dev
```

Visit: `http://localhost:3000/wreath-site/`

Test:
1. Add items to cart
2. Go to checkout
3. Submit order
4. Check your Google Sheet - order should appear!
5. Check email - confirmation should arrive

---

## Part 4: Deploy to Internet

### Option A: Netlify (Recommended)

#### Why Netlify?
- 100 GB bandwidth/month (free)
- Automatic SSL/HTTPS
- Custom domains
- Continuous deployment
- Edge network (fast worldwide)

#### Deployment Steps:

1. **Push to GitHub**
```bash
git add -A
git commit -m "Ready for deployment"
git push origin main
```

2. **Sign up for Netlify**
   - Go to [netlify.com](https://www.netlify.com/)
   - Sign up with GitHub (free)

3. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository
   - Configure build:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Click "Deploy site"

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add each variable from your `.env` file
   - Redeploy site

5. **Get Your URL**
   - Your site is live at: `https://random-name-12345.netlify.app`
   - Can add custom domain later (free)

### Option B: Vercel

#### Why Vercel?
- Unlimited bandwidth (free)
- Automatic SSL/HTTPS
- Custom domains
- Edge network
- Great for React apps

#### Deployment Steps:

1. **Push to GitHub** (same as Netlify)

2. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Sign up with GitHub (free)

3. **Import Project**
   - Click "Add New..." → "Project"
   - Select your repository
   - Configure:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variables
   - Deploy

4. **Get Your URL**
   - Your site is live at: `https://your-project.vercel.app`

### Option C: GitHub Pages

#### Why GitHub Pages?
- Free forever
- Easy deployment
- Integrated with GitHub
- Good for simple sites

#### Deployment Steps:

1. **Update vite.config.js**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/wreath-site/'
})
```

2. **Deploy**
```bash
npm run deploy
```

3. **Enable GitHub Pages**
   - Go to your repo on GitHub
   - Settings → Pages
   - Source: gh-pages branch
   - Save

4. **Get Your URL**
   - Your site is live at: `https://username.github.io/wreath-site/`

---

## Part 5: Custom Domain (Optional - Free)

### Using Netlify

1. Buy domain from Namecheap, Google Domains, etc. (~$12/year)
2. In Netlify: Domain settings → Add custom domain
3. Update DNS records at your registrar
4. SSL certificate automatically generated (free)

### Free Domain Options

If you don't want to buy a domain:
- Use the free Netlify subdomain: `yoursite.netlify.app`
- Use the free Vercel subdomain: `yoursite.vercel.app`
- Use GitHub Pages: `username.github.io/wreath-site`

---

## Part 6: Going Live Checklist

### Before Launch:

- [ ] Test order flow end-to-end
- [ ] Verify emails are sending
- [ ] Check Google Sheet is updating
- [ ] Test scout attribution links
- [ ] Verify all images load
- [ ] Test on mobile devices
- [ ] Check admin dashboard works
- [ ] Update site configuration
- [ ] Add all scouts
- [ ] Set correct campaign dates

### After Launch:

- [ ] Share scout links with families
- [ ] Monitor orders in Google Sheet
- [ ] Check email notifications
- [ ] Respond to customer questions
- [ ] Export data regularly for backup

---

## Monitoring & Maintenance

### Daily:
- Check Google Sheet for new orders
- Respond to customer emails
- Monitor Netlify/Vercel dashboard for errors

### Weekly:
- Export Google Sheet backup
- Review scout sales in admin dashboard
- Send reminders to families

### Monthly:
- Nothing! All services auto-renew for free
- EmailJS: Monitor that you're under 200 emails/month

---

## Scaling & Limits

### Current Limits (Free Tier):

| Service | Limit | What Happens When Exceeded |
|---------|-------|----------------------------|
| Google Sheets API | 500 requests/min | Very unlikely to hit |
| EmailJS | 200 emails/month | Need to upgrade ($7/mo) |
| Netlify | 100 GB bandwidth/mo | Very unlikely to hit |
| Vercel | Unlimited | Never |
| GitHub Pages | 100 GB/mo | Very unlikely to hit |

### Typical Scout Pack Usage:

For a pack with 20-30 scouts running a 4-week sale:
- Expected orders: 50-200
- API requests: ~1000/month
- Emails sent: 50-200
- Bandwidth: ~5-10 GB

**You will not hit any limits!** ✅

### If You Outgrow Free Tier:

1. **EmailJS limit (200/month)**
   - Upgrade to Basic: $7/month (1000 emails)
   - Or switch to SendGrid free tier: 100/day

2. **Bandwidth limit**
   - Very unlikely
   - Optimize images if needed
   - Use image CDN

---

## Troubleshooting

### Orders not appearing in Google Sheet

1. Check browser console for errors
2. Verify Sheet ID in .env is correct
3. Make sure sheet is shared publicly (Viewer)
4. Check API key is restricted to Sheets API only
5. Verify sheet has correct header row

### Emails not sending

1. Check EmailJS dashboard for errors
2. Verify credentials in .env
3. Check you haven't hit 200/month limit
4. Test email template in EmailJS dashboard
5. Check spam folder

### Site not loading after deployment

1. Verify environment variables are set in Netlify/Vercel
2. Check build logs for errors
3. Make sure `dist` folder is being deployed
4. Verify base path in vite.config.js

### "API key not valid" error

1. Make sure API key is copied correctly
2. Check API key has Google Sheets API enabled
3. Verify no extra spaces in .env file
4. Try creating a new API key

---

## Getting Help

### Documentation
- Google Sheets API: https://developers.google.com/sheets/api
- EmailJS: https://www.emailjs.com/docs/
- Netlify: https://docs.netlify.com/
- Vercel: https://vercel.com/docs

### Common Issues
- See `BACKEND_SETUP_SHEETS.md` for detailed troubleshooting
- Check browser console for JavaScript errors
- Review Netlify/Vercel build logs

---

## Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| Google Sheets | 5M cells | $0 |
| Google Sheets API | 500 req/min | $0 |
| EmailJS | 200 emails/mo | $0 |
| Netlify Hosting | 100 GB bandwidth | $0 |
| SSL Certificate | Included | $0 |
| Custom Domain | Optional | ~$12/year |
| **Total** | | **$0/month** |

Compare to paid solutions:
- Shopify: $29/month + transaction fees
- Wix: $27/month
- Squarespace: $23/month
- Firebase: $25+/month
- Custom hosting: $10+/month

**You save: $200-400/year** 💰

---

## Success!

Your wreath sale website is now:
- ✅ Live on the internet
- ✅ Taking orders 24/7
- ✅ Sending email confirmations
- ✅ Tracking scout sales
- ✅ Costing you $0/month

**Share your scout links and start selling!** 🎄

---

**Questions?** Review the documentation files:
- `BACKEND_SETUP_SHEETS.md` - Detailed Google Sheets setup
- `QUICK_START.md` - Quick reference guide
- `ASSET_PLACEMENT_GUIDE.md` - Where to put images
- `.env.example` - All environment variables explained

---

**Version**: 1.2.0
**Last Updated**: November 9, 2025
**Total Cost**: $0.00/month
