# Pack 182 Wreath Sale Platform

A web-based fundraising platform for Cub Scout Pack 182's wreath campaign.

## Quick Links
- 📋 [Product Requirements Document](./PRD.md) - Complete feature specification
- 📅 [Project Plan](./PROJECT_PLAN.md) - 8-week development timeline
- 🖼️ [Asset Placement Guide](./ASSET_PLACEMENT_GUIDE.md) - **START HERE** to add your images and content

---

## Project Overview

This platform enables:
- Online wreath ordering with scout attribution
- Manual entry for offline (door-to-door) sales
- Zelle payment processing
- Scout leaderboards and gamification
- Admin dashboard for order management
- Automated email notifications
- Public-facing site + Scout/Admin portals

**Tech Stack:**
- Frontend: React 18 + Vite
- Backend: Google Sheets + Apps Script
- Hosting: GitHub Pages (free)
- Email: Gmail API (100/day)
- Payments: Zelle (manual)

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Your Assets
Follow the **[Asset Placement Guide](./ASSET_PLACEMENT_GUIDE.md)** to add:
- Wreath product photos → `/public/images/products/`
- Pack 182 logo → `/public/images/branding/`
- Zelle QR code → `/public/images/zelle/`

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to see your site.

### 4. Build for Production
```bash
npm run build
```

### 5. Deploy to GitHub Pages
```bash
npm run deploy
```

---

## Project Structure

```
/wreath-site/
├── public/                 # Static assets
│   └── images/
│       ├── products/       # Wreath photos (YOU ADD THESE)
│       ├── branding/       # Pack logo (YOU ADD THIS)
│       └── zelle/          # Zelle QR code (YOU ADD THIS)
├── src/
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts (auth, cart, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── styles/             # CSS files
├── PRD.md                  # Product requirements
├── PROJECT_PLAN.md         # Development timeline
└── ASSET_PLACEMENT_GUIDE.md # Asset placement instructions
```

---

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages

---

## Development Timeline

We're following an **8-week development plan**:
- **Week 1:** Foundation & Infrastructure ✅ (IN PROGRESS)
- **Week 2:** Customer-facing features
- **Week 3:** Admin dashboard (Part 1)
- **Week 4:** Scout portal & Product management
- **Week 5:** Email system
- **Week 6:** Leaderboard & Gamification
- **Week 7:** Testing & Refinement
- **Week 8:** Content, Documentation & Launch

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed daily tasks.

---

## Next Steps

1. ✅ **Project structure created**
2. ⏳ **Install dependencies:** `npm install`
3. ⏳ **Add your assets** (photos, logo, Zelle QR) - See [ASSET_PLACEMENT_GUIDE.md](./ASSET_PLACEMENT_GUIDE.md)
4. ⏳ **Set up Google Sheets backend** (Week 1, Day 3-5)
5. ⏳ **Test the site:** `npm run dev`

---

## Need Help?

- **Asset placement:** See [ASSET_PLACEMENT_GUIDE.md](./ASSET_PLACEMENT_GUIDE.md)
- **Development plan:** See [PROJECT_PLAN.md](./PROJECT_PLAN.md)
- **Features & requirements:** See [PRD.md](./PRD.md)

---

**Built for Cub Scout Pack 182**
**Version:** 1.0.0
**Last Updated:** 2025-11-08
