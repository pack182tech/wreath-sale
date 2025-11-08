# Project Plan: Cub Scout Pack 182 Wreath Sale Platform

**Timeline:** 7-8 weeks (Solo Developer)
**Start Date:** Week of 2025-11-08
**Target Launch:** Week of 2025-12-30

---

## Project Overview

Building a complete fundraising platform with:
- React + Vite static frontend (GitHub Pages)
- Google Sheets + Apps Script backend
- Simple authentication (localStorage)
- Email automation (100/day Gmail limit)
- Scout attribution and leaderboard
- Admin dashboard and scout portals

---

## Week 1: Foundation & Infrastructure

### Day 1-2: Project Setup
- [ ] Initialize Git repository
- [ ] Set up React + Vite project structure
- [ ] Configure GitHub Pages deployment
- [ ] Set up ESLint, Prettier, TypeScript (optional)
- [ ] Create folder structure:
  ```
  /src
    /components
    /pages
    /contexts
    /hooks
    /services
    /utils
    /config
  /public
    /images
      /products
      /branding
      /zelle
  ```
- [ ] Install core dependencies (React Router, axios, etc.)
- [ ] Create basic layout component with Scout Law scroll

**Deliverable:** Repository set up, deployable "Hello World" on GitHub Pages

### Day 3-5: Google Sheets Backend Setup
- [ ] Create Google Sheets workbook with tabs:
  - Scouts (columns: scout_id, scout_name, parent_name, parent_email, rank, unique_slug, qr_code_data_url, password_hash, created_date, active)
  - Products (columns: product_id, ribbon_color_name, description, price, image_filename, active, created_date)
  - Orders (columns: order_id, order_date, customer_name, customer_email, customer_phone, scout_id, order_type, payment_status, payment_method, items_json, total_amount, notes, fulfillment_status, entry_method, entered_by)
  - Donations (columns: donation_id, donation_date, donor_name, donor_email, amount, scout_id, payment_status, payment_method, notes)
  - SiteContent (columns: content_key, content_value, last_modified)
  - EmailQueue (columns: queue_id, to_email, subject, body_html, priority, status, created_date, sent_date)
  - Config (columns: config_key, config_value, last_modified)
  - Sessions (columns: session_token, user_id, user_type, created_date, expires_date)

- [ ] Create Google Apps Script project
- [ ] Implement API endpoints:
  - `GET /api/products` - Fetch active products
  - `POST /api/orders` - Create new order
  - `POST /api/auth/login` - Authenticate user
  - `POST /api/auth/logout` - Invalidate session
  - `GET /api/scouts/:slug` - Get scout by unique slug
  - `GET /api/config` - Get public config (Zelle info, campaign dates, etc.)

- [ ] Deploy Apps Script as Web App
- [ ] Test API endpoints with Postman/curl
- [ ] Document API in README

**Deliverable:** Working Google Sheets database with functional API endpoints

### Day 6-7: Authentication System
- [ ] Build auth service in frontend (`/src/services/authService.js`)
- [ ] Implement password hashing in Apps Script (bcrypt-like)
- [ ] Create login page component
- [ ] Create AuthContext for state management
- [ ] Implement protected route wrapper
- [ ] Create session management utilities
- [ ] Add logout functionality
- [ ] Test authentication flow

**Deliverable:** Working authentication with admin, scout, and public access levels

---

## Week 2: Customer-Facing Features

### Day 8-9: Product Catalog & Shopping Cart
- [ ] Create ProductCard component
- [ ] Build product catalog page with grid layout
- [ ] Implement shopping cart context
- [ ] Create "Add to Cart" functionality
- [ ] Build cart sidebar/modal
- [ ] Add quantity adjustment controls
- [ ] Implement cart persistence (localStorage)
- [ ] Add donation amount input section
- [ ] Calculate cart totals

**Deliverable:** Functional shopping experience with cart

### Day 10-11: Scout Attribution System
- [ ] Implement attribution detection from URL (e.g., `/scout/tommy-jones`)
- [ ] Store attribution in session/localStorage
- [ ] Display "Supporting Scout: [Name]" during shopping
- [ ] Create attribution banner component
- [ ] Allow customer to change/remove attribution
- [ ] Test attribution persistence through checkout
- [ ] Handle non-attributed orders

**Deliverable:** Working scout attribution system

### Day 12-14: Checkout Flow
- [ ] Create checkout page component
- [ ] Build customer information form (name, email, phone)
- [ ] Display order summary
- [ ] Show Zelle payment instructions
- [ ] Display Zelle QR code
- [ ] Implement form validation
- [ ] Submit order to backend API
- [ ] Generate order confirmation number
- [ ] Create confirmation page
- [ ] Test complete customer flow

**Deliverable:** Complete checkout process with Zelle payment display

---

## Week 3: Admin Dashboard (Part 1)

### Day 15-16: Admin Layout & Navigation
- [ ] Create admin dashboard layout
- [ ] Build navigation sidebar
- [ ] Create admin routing structure
- [ ] Build overview/analytics page with:
  - Total revenue (orders + donations)
  - Total orders count
  - Orders by payment status
  - Top performing scouts
  - Sales over time chart (simple)

**Deliverable:** Admin dashboard shell with analytics

### Day 17-18: Order Management
- [ ] Create orders list view with filters:
  - By scout
  - By payment status
  - By date range
  - By fulfillment status
- [ ] Build order detail view
- [ ] Implement order editing:
  - Change attribution
  - Update payment status
  - Update fulfillment status
  - Add notes
- [ ] Add order search functionality
- [ ] Export orders to CSV
- [ ] Manual order entry form

**Deliverable:** Complete order management system

### Day 19-21: Scout Management
- [ ] Create scouts list view
- [ ] Build "Add Scout" form
- [ ] Implement scout creation API endpoint
- [ ] Generate unique slug from scout name
- [ ] Generate QR code (data URL) for scout's link
- [ ] Hash password and create credentials
- [ ] Send welcome email with credentials (if email available)
- [ ] Build scout detail/edit view
- [ ] Implement scout deactivation
- [ ] Display scout performance stats

**Deliverable:** Complete scout management system with QR generation

---

## Week 4: Scout Portal & Product Management

### Day 22-23: Scout Portal Dashboard
- [ ] Create scout portal layout
- [ ] Build scout dashboard with:
  - Total sales summary
  - Leaderboard position
  - Recent orders
  - Pending payment alerts
  - Orders breakdown by status
- [ ] Display scout's unique link and QR code
- [ ] Add "Copy Link" functionality
- [ ] Show Zelle payment info to share

**Deliverable:** Scout dashboard with sales overview

### Day 24-25: Offline Sales Entry
- [ ] Create offline sales entry form
- [ ] Fields: customer info, products, quantities, donation, payment status, notes
- [ ] Auto-attribute to logged-in scout
- [ ] Submit to backend
- [ ] Display success confirmation
- [ ] Show recent offline entries
- [ ] Implement edit capability (24hr window)
- [ ] Test complete offline flow

**Deliverable:** Working offline sales entry system

### Day 26-28: Product & Content Management
- [ ] Create product management page in admin
- [ ] Build "Add Product" form (ribbon color)
- [ ] Implement product editing
- [ ] Image upload handling (or filename reference)
- [ ] Product activation/deactivation
- [ ] Create site content editor:
  - Homepage text
  - FAQ content
  - About section
  - Donation description
  - Scout Law text
  - Campaign dates
- [ ] Zelle configuration editor:
  - Recipient name
  - Recipient email/phone
  - Instructions text
  - QR code upload/update
- [ ] Build simple WYSIWYG or textarea editor
- [ ] Save/update content via API

**Deliverable:** Complete product and content management

---

## Week 5: Email System

### Day 29-30: Email Infrastructure
- [ ] Implement email queue system in Google Sheets
- [ ] Create Apps Script email sender function
- [ ] Implement priority queue (high, medium, low)
- [ ] Add daily quota tracking (max 100/day)
- [ ] Create email template system with merge fields:
  - {{customer_name}}
  - {{order_number}}
  - {{order_total}}
  - {{scout_name}}
  - {{zelle_recipient_name}}
  - {{zelle_recipient_contact}}
  - {{zelle_instructions}}
  - {{pickup_date}}
  - {{pickup_location}}
- [ ] Implement HTML email rendering
- [ ] Test email sending

**Deliverable:** Email queue system with quota management

### Day 31-33: Email Templates & Triggers
- [ ] Create email templates in Sheets:
  1. **Customer Order Confirmation** (Priority: High)
     - Order details
     - Zelle payment instructions + QR code link
     - Scout attribution
     - Pickup details
  2. **Pickup Reminder** (Priority: High, batched)
     - Pickup date/time/location
     - Order summary
     - What to bring
  3. **Welcome Email to Scout/Parent** (Priority: Medium)
     - Login credentials
     - Unique link and QR code
     - How to use the platform
     - Selling tips
- [ ] Build email template editor in admin dashboard
- [ ] Implement template preview
- [ ] Create email triggers:
  - Order confirmation: on order creation
  - Pickup reminder: manual trigger by admin (3-5 days before)
- [ ] Test all email templates
- [ ] Add test email functionality to admin

**Deliverable:** 3 core email templates with automated triggers

### Day 34-35: Email Management in Admin
- [ ] Create email queue viewer in admin
- [ ] Display sent emails log
- [ ] Show pending emails
- [ ] Manual email trigger functionality
- [ ] Resend failed emails
- [ ] Email template management UI
- [ ] Quota usage display

**Deliverable:** Complete email management interface

---

## Week 6: Leaderboard & Gamification

### Day 36-37: Leaderboard System
- [ ] Create leaderboard API endpoint:
  - Aggregate sales by scout
  - Calculate total revenue (wreaths + donations)
  - Calculate total units sold
  - Rank scouts
- [ ] Build public leaderboard page
- [ ] Display rankings with:
  - Rank number
  - Scout name
  - Scout rank (badge)
  - Total wreaths sold
  - Total revenue
- [ ] Implement toggle between revenue and units view
- [ ] Add special styling for top 3 scouts
- [ ] Implement auto-refresh (every 30 seconds)
- [ ] Test with sample data

**Deliverable:** Public leaderboard with rankings

### Day 38-39: Gamification & Polish
- [ ] Add milestone badges (10, 25, 50 wreaths)
- [ ] Display badges on leaderboard
- [ ] Show badges in scout dashboard
- [ ] Add animation to leaderboard updates
- [ ] Create celebration effects for achievements
- [ ] Implement opt-out option for scouts
- [ ] Add anonymization option (show initials only)
- [ ] Polish leaderboard mobile responsiveness

**Deliverable:** Gamified leaderboard with badges

### Day 40-42: Scout Law Scroll & UI Polish
- [ ] Implement Scout Law scrolling banner (CSS animation)
- [ ] Fixed position at bottom of viewport
- [ ] Ensure non-intrusive but visible
- [ ] Make responsive on mobile
- [ ] Add enable/disable toggle in admin
- [ ] Make Scout Law text editable in admin
- [ ] Overall UI polish:
  - Consistent spacing and typography
  - Loading states for all async operations
  - Error message display
  - Success notifications
  - Mobile menu improvements
  - Accessibility improvements (ARIA labels, keyboard nav)

**Deliverable:** Scout Law scroll and polished UI

---

## Week 7: Testing & Refinement

### Day 43-44: End-to-End Testing
- [ ] Customer flow testing:
  - Browse products
  - Add to cart
  - Checkout with attribution
  - Verify email received
  - Test non-attributed orders
- [ ] Scout flow testing:
  - Login
  - View dashboard
  - Enter offline sale
  - Mark payment received
  - Download QR code
- [ ] Admin flow testing:
  - Create scouts
  - Manage products
  - View/edit orders
  - Update payment status
  - Send emails
  - Export data

**Deliverable:** Complete E2E test results document

### Day 45-46: Bug Fixes & Edge Cases
- [ ] Fix identified bugs from testing
- [ ] Handle edge cases:
  - Empty cart checkout prevention
  - Duplicate order prevention
  - Email failures
  - API timeout handling
  - Invalid scout slugs
  - Session expiration
  - Mobile Safari issues
- [ ] Add comprehensive error messages
- [ ] Improve form validation
- [ ] Test on multiple browsers

**Deliverable:** Bug fixes and edge case handling

### Day 47-49: Performance & Security Review
- [ ] Performance optimization:
  - Code splitting
  - Lazy loading
  - Image optimization
  - API response caching
  - Minimize bundle size
- [ ] Security review:
  - Input sanitization
  - XSS prevention
  - CSRF protection
  - Password security
  - API endpoint protection
  - Session management review
- [ ] Load testing (simulate 50 concurrent users)
- [ ] Mobile performance testing

**Deliverable:** Optimized and secured application

---

## Week 8: Content, Documentation & Launch

### Day 50-51: Content Population
- [ ] Add all wreath product photos to `/public/images/products/`
- [ ] Add Pack 182 logo to `/public/images/branding/`
- [ ] Add Zelle QR code to `/public/images/zelle/`
- [ ] Populate products in Google Sheets (ribbon colors, prices)
- [ ] Add campaign dates to config
- [ ] Add Zelle payment info to config
- [ ] Write FAQ content
- [ ] Write About Pack 182 content
- [ ] Configure email templates with final copy
- [ ] Add donation description and recipient name
- [ ] Set up Scout Law text (if customized)

**Deliverable:** Fully populated site with real content

### Day 52-53: Admin Training & Scout Onboarding
- [ ] Create admin user guide:
  - How to add scouts
  - How to manage orders
  - How to update content
  - How to handle payments
  - How to export data
  - How to send emails
- [ ] Record video walkthrough for admins
- [ ] Create scout/parent user guide:
  - How to login
  - How to share link/QR code
  - How to enter offline sales
  - How to mark payments received
  - How to view dashboard
- [ ] Create customer FAQ
- [ ] Conduct training session with pack leader

**Deliverable:** Training materials and documentation

### Day 54-55: Pre-Launch Testing
- [ ] Create 5-10 test scouts in system
- [ ] Generate their QR codes
- [ ] Test scout attribution links
- [ ] Place test orders (online and offline)
- [ ] Test email delivery
- [ ] Verify leaderboard updates
- [ ] Test payment status workflows
- [ ] Final mobile testing
- [ ] Validate all links and navigation
- [ ] Spell check all content

**Deliverable:** Production-ready application

### Day 56: Launch!
- [ ] Final deployment to GitHub Pages
- [ ] Verify custom domain (if applicable)
- [ ] Enable HTTPS
- [ ] Send welcome emails to all scouts with credentials
- [ ] Announce launch to Pack 182
- [ ] Monitor for issues in first hours
- [ ] Provide immediate support for any critical bugs
- [ ] Celebrate!

**Deliverable:** Live, public website

---

## Post-Launch (Ongoing)

### Week 9+: Monitoring & Support
- [ ] Daily monitoring of:
  - Order volume
  - Email quota usage
  - Error logs in Apps Script
  - Customer issues
- [ ] Weekly:
  - Review analytics
  - Update leaderboard
  - Check payment status
  - Export production summary
- [ ] As needed:
  - Fix bugs
  - Answer user questions
  - Update content
  - Adjust email templates

---

## Key Dependencies & Prerequisites

### Before Starting:
1. [ ] GitHub account set up for pack
2. [ ] Google account set up for pack
3. [ ] Zelle account activated with QR code
4. [ ] All wreath product photos collected
5. [ ] Pack 182 logo/branding assets
6. [ ] Campaign dates decided
7. [ ] Wreath prices finalized
8. [ ] List of scouts to onboard

### Required Tools:
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)
- Google account with Sheets and Apps Script access
- Image editing software (for optimizing photos)

---

## Risk Mitigation Strategies

### Email Quota (100/day):
- Prioritize customer order confirmations
- Batch pickup reminders
- Move scout notifications to in-portal alerts
- Monitor daily usage in admin dashboard
- Consider upgrading to Google Workspace if needed

### Google Sheets Rate Limits:
- Implement client-side caching (5-10 minutes)
- Batch API calls where possible
- Use efficient query patterns
- Monitor quota in Apps Script dashboard

### Authentication Security:
- Use bcrypt-compatible hashing in Apps Script
- Implement session expiration (7 days)
- HTTPS only
- Input sanitization on all forms
- Regular security reviews

### Browser Compatibility:
- Test on: Chrome, Safari, Firefox, Edge
- Test on: iOS Safari, Android Chrome
- Provide fallbacks for modern features
- Polyfills where necessary

---

## Success Criteria

Before marking this project complete:
- [ ] All features from PRD implemented
- [ ] 3 email templates working (order confirmation, pickup reminder, welcome)
- [ ] Scout attribution working with QR codes
- [ ] Admin can manage scouts, orders, products
- [ ] Scouts can enter offline sales
- [ ] Leaderboard displays correctly
- [ ] Scout Law scroll working
- [ ] Payment status tracking functional
- [ ] Mobile responsive on iOS and Android
- [ ] Zero critical bugs
- [ ] Page load < 3 seconds
- [ ] Training materials created
- [ ] Pack leader trained
- [ ] Test campaign completed successfully

---

## Notes

### Code Organization Best Practices:
- Use React Context for global state (auth, cart, attribution)
- Keep components small and focused
- Extract reusable hooks
- Centralize API calls in service layer
- Use proper TypeScript types (if using TS)
- Comment complex logic
- Follow consistent naming conventions

### Google Apps Script Tips:
- Use `PropertiesService` for caching
- Implement request logging
- Add error handling to all endpoints
- Use `LockService` for concurrent write protection
- Set proper CORS headers
- Return consistent JSON structure

### Deployment:
- GitHub Pages deployment: `npm run build` → push to `gh-pages` branch
- Apps Script: Deploy as Web App, set to "Anyone" for execution
- Test in staging before production updates

---

## Contact & Support

**Project Lead:** [Your Name]
**Pack Leader:** [Pack Leader Name]
**Technical Issues:** [Email/Slack]
**Repository:** https://github.com/[pack-182]/wreath-sale

---

**Last Updated:** 2025-11-08
**Status:** Ready to Begin
