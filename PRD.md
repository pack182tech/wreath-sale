# Product Requirements Document: Cub Scout Pack 182 Wreath Sale Platform

## 1. Executive Summary

A web-based platform to manage a one-off wreath fundraising campaign for Cub Scout Pack 182. The system enables online ordering with scout attribution, manual entry of offline sales, order tracking for made-to-order wreaths, automated customer communications, gamified performance tracking through a leaderboard, and donation capabilities to support a local church.

**Key Constraints:**
- Zero-cost infrastructure using GitHub Pages (static hosting) and Google Sheets (data backend)
- Existing Cub Scout organization accounts for both services
- Zelle payment processing (no credit card integration needed)
- Made-to-order fulfillment model (infinite supply, no inventory limits)

---

## 2. Goals and Objectives

### Primary Goals
1. Maximize wreath sales and donations through easy online ordering and scout attribution
2. Provide scouts with shareable links and QR codes to drive traffic to their attributed sales
3. Simplify order tracking and payment collection for pack leaders
4. Gamify the sales process to motivate scouts through leaderboard competition
5. Automate customer communication to reduce manual administrative work
6. Facilitate donations to a local church through the platform

### Success Metrics
- Total revenue generated (sales + donations)
- Number of wreaths sold per scout (average and distribution)
- Total donation amount collected
- Percentage of sales attributed to scouts vs. general orders
- Customer conversion rate (link clicks to purchases)
- Admin time saved vs. manual process

---

## 3. Target Users

### 3.1 Primary Users
- **Customers**: Parents, family members, community supporters purchasing wreaths or making donations
- **Cub Scouts**: Youth selling wreaths door-to-door and sharing unique links
- **Scout Parents**: Managing their scout's sales efforts and entering offline orders
- **Pack Leaders/Admins**: Managing the campaign, orders, and scouts

### 3.2 User Personas

**Persona 1: Sarah (Customer)**
- Parent of elementary school children
- Supports local youth organizations
- Prefers online shopping with simple payment methods
- Wants to support a specific scout she knows

**Persona 2: Tommy (Cub Scout)**
- 8-year-old Bear Cub Scout
- Tech-savvy, has access to parent's smartphone
- Competitive, motivated by leaderboard
- Goes door-to-door in neighborhood

**Persona 3: Lisa (Scout Parent)**
- Manages Tommy's scouting activities
- Helps track his sales progress
- Enters orders from neighbors who prefer to pay later
- Receives notifications about Tommy's performance
- Handles Zelle payments from customers

**Persona 4: Mike (Pack Leader/Admin)**
- Volunteer managing 25 cub scouts
- Limited technical expertise
- Needs simple tools to manage campaign
- Wants visibility into overall performance and order tracking

---

## 4. Features and Requirements

### 4.1 Scout Management

**4.1.1 Scout Registration**
- Admin-only scout creation (no self-registration)
- Required fields per scout:
  - Scout name
  - Parent name
  - Parent email
  - Scout rank (Lion, Tiger, Wolf, Bear, Webelos, Arrow of Light)
- System auto-generates:
  - Unique URL slug (e.g., `site.com/scout/tommy-jones`)
  - QR code linked to unique URL
  - Scout ID for tracking

**4.1.2 Scout Credentials**
- Each scout/parent receives login credentials
- Credentials emailed to parent email upon scout creation
- Password reset capability

**4.1.3 Scout Profile**
- View-only display of scout information
- Edit capability reserved for admins

---

### 4.2 Product Management

**4.2.1 Wreath Products (Ribbon Color Variations)**
- Support multiple ribbon color options (each listed as separate product)
- Each ribbon color includes:
  - Color name (e.g., "Red Ribbon Wreath", "Green Ribbon Wreath")
  - Description
  - Price (same for all colors or different per color)
  - Product image showing sample photo of that ribbon color
- Customers can order multiple wreaths in each color
- No inventory limits (made to order from infinite supply)
- Admin can add/edit/disable ribbon color options

**4.2.2 Donation Option**
- Special "Donation" product type
- Donation description: "Support a local church" (editable text in admin)
- Customers can specify donation amount (free-form or suggested amounts)
- Donations tracked separately from wreath orders
- Donations can be attributed to scouts (if customer came via scout link)

**4.2.3 Product Display**
- Grid or card layout on main shopping page
- Show product image, color name, price, description for each ribbon option
- All products show "Available" status (no sold-out messages)
- Donation option prominently displayed
- Allow quantity selection for each ribbon color

---

### 4.3 Customer Order Flow

**4.3.1 Shopping Experience**
- Customers access via:
  - Scout's unique link (attributed)
  - Scout's QR code (attributed)
  - General site URL (non-attributed)
- Attribution persists through session (cookie/session storage)
- Product catalog with add-to-cart functionality
- Shopping cart with quantity adjustment
- Donation amount entry
- No inventory checking needed (unlimited supply)
- Scout Law scroll displayed at bottom of screen (persistent across all pages)

**4.3.2 Checkout Process**
- Customer information form:
  - Name
  - Email
  - Phone number
  - Optional: Comments/special requests
- Order summary review
- Payment instructions displayed:
  - Pack's Zelle information (editable in admin)
  - Pack's Zelle QR code displayed
  - Instructions to complete Zelle payment
  - Note that order is confirmed upon payment receipt
- No account creation required (guest checkout)

**4.3.3 Order Confirmation**
- Confirmation page with order number
- Order summary display
- Zelle payment instructions repeated
- Pickup event details
- Immediate confirmation email sent

**4.3.4 Attribution Logic**
- If accessed via scout link/QR code: attribute to that scout
- If accessed via general link: marked as non-attributed
- Display scout's name during checkout ("Supporting Scout: Tommy Jones")
- Option to change attribution or remove it

---

### 4.4 Manual Sales Entry (Offline Orders)

**4.4.1 Scout/Parent Entry**
- Scouts/parents can log in to their portal
- Form to enter offline sales:
  - Customer name
  - Customer email (optional)
  - Customer phone (optional)
  - Products and quantities (by ribbon color)
  - Donation amount (if applicable)
  - Sale method (door-to-door, phone, email)
  - Payment status (Paid via Zelle, Pending Zelle Payment, Cash, Check)
  - Notes
- Auto-attributes to logged-in scout
- Creates order record immediately
- Generates order tracking entry

**4.4.2 Admin Entry**
- Admins can enter orders and select which scout to attribute
- Can enter non-attributed orders
- Same form fields as scout entry
- Can manually mark payment status

**4.4.3 Order Editing**
- Admins can edit any order
- Admins can change attribution of existing orders
- Scouts can only edit their own offline orders (within 24 hours of entry)

---

### 4.5 Payment Processing

**4.5.1 Zelle Payment**
- Display Pack's Zelle information on checkout page
- Display Pack's Zelle QR code for easy mobile scanning
- Zelle details editable in admin settings:
  - Recipient name
  - Recipient email/phone
  - Instructions text
- Upload/replace Zelle QR code image in admin

**4.5.2 Payment Tracking**
- Mark orders as:
  - "Paid - Zelle" (payment confirmed)
  - "Paid - Cash" (for offline sales)
  - "Paid - Check" (for offline sales)
  - "Pending Payment" (order placed, awaiting Zelle transfer)
- Admin can manually update payment status
- Report of unpaid/pending orders
- Filter orders by payment status

**4.5.3 Payment Reminders**
- Customers with pending payment receive reminder emails
- Email includes Zelle information and order details
- Reminders configurable (days after order placement)

---

### 4.6 Order Tracking (Made-to-Order Model)

**4.6.1 Order Aggregation**
- Track total orders by ribbon color
- Calculate total wreaths needed for production
- Display order counts by product in admin dashboard
- Export production summary (quantities needed per ribbon color)

**4.6.2 Order Fulfillment**
- No inventory deduction (infinite supply assumed)
- Mark orders as "Confirmed", "In Production", "Ready for Pickup", "Fulfilled"
- Bulk update fulfillment status
- Filter/sort orders by fulfillment status

---

### 4.7 Email Notifications

**4.7.1 Customer Emails**
- **Order Confirmation** (immediate):
  - Order number and details
  - Items purchased and total
  - Zelle payment instructions with recipient details
  - Link to Zelle QR code or embedded QR code
  - Scout attribution acknowledgment
  - Pickup event details
- **Payment Reminder** (for pending orders, configurable timing):
  - Reminder that payment is pending
  - Zelle payment instructions and QR code
  - Order summary
  - Link to contact admin if already paid
- **Pickup Reminder** (configurable days before event):
  - Reminder of pickup date/time/location
  - Order summary
  - Payment status confirmation
  - What to bring
- **Thank You Email** (after event):
  - Gratitude for support
  - Impact statement about supporting scouts and church
  - Future engagement opportunities

**4.7.2 Scout/Parent Emails**
- **Welcome Packet** (upon scout creation):
  - Login credentials
  - Unique selling link
  - QR code image (downloadable)
  - Selling tips and campaign details
  - Portal access instructions
  - Zelle payment instructions to share with customers
- **Order Notification** (immediate on attributed sale):
  - Notification that a sale was attributed to them
  - Customer name
  - Items sold
  - Payment status
  - Current total sales
  - **If payment pending**: Instructions to remind customer to pay via Zelle
- **Payment Received Notification**:
  - Notification when payment is confirmed for their attributed order
  - Customer name
  - Amount paid
- **Sales Update** (configurable frequency):
  - Total sales summary
  - Leaderboard position
  - Encouraging message
- **Pickup Notification** (before pickup event):
  - Reminder to help with pickup event
  - Their total orders to be distributed

**4.7.3 Admin Emails**
- Daily sales summary (optional)
- Payment pending notifications
- New order notifications

**4.7.4 Email Management**
- All email templates editable by admin via dashboard
- Support for HTML email templates
- Merge fields for personalization (name, order details, scout info, Zelle info)
- Preview functionality before sending
- Ability to manually trigger emails
- Zelle payment instructions and QR code automatically included where relevant

---

### 4.8 Leaderboard

**4.8.1 Display**
- Public-facing page (no login required)
- Ranked list of scouts by total sales (revenue or units)
- Display fields:
  - Rank (#1, #2, etc.)
  - Scout name
  - Scout rank (Lion, Tiger, Wolf, Bear, Webelos, Arrow of Light)
  - Total wreaths sold (or total revenue including donations)
  - Visual indicators (badges, stars for top performers)

**4.8.2 Gamification**
- Top 3 highlighted with special styling
- Optional: Sales milestones (10, 25, 50 wreaths badges)
- Real-time updates (refreshes on page load)
- Toggle between revenue view and units view
- Option to include/exclude donations in rankings

**4.8.3 Privacy**
- Option to anonymize scouts (display initials only)
- Option for scouts to opt out of leaderboard display
- Admin controls visibility settings

---

### 4.9 Scout Law Display

**4.9.1 Scrolling Banner**
- Fixed position at bottom of viewport on all pages
- Horizontal auto-scrolling text displaying the Scout Law:
  - "A Scout is Trustworthy, Loyal, Helpful, Friendly, Courteous, Kind, Obedient, Cheerful, Thrifty, Brave, Clean, and Reverent"
- Continuous loop animation
- Styled to match site branding
- Non-intrusive but visible
- Admin can edit Scout Law text if needed
- Option to enable/disable scroll in admin settings

---

### 4.10 Admin Dashboard

**4.10.1 Overview/Analytics**
- Total revenue (sales + donations)
- Total orders (online vs offline)
- Total donations collected
- Wreaths sold by ribbon color
- Average order value
- Attributed vs non-attributed sales
- Sales over time chart
- Top performing scouts
- Payment status summary (paid vs pending)
- Production summary (total wreaths needed by ribbon color)

**4.10.2 Content Management**
- Edit all site text content:
  - Homepage headlines and descriptions
  - Product descriptions
  - FAQ section
  - About the pack content
  - Footer content
  - Instructions and help text
  - Donation description and recipient organization name
  - Scout Law text
- Edit product details (ribbon color name, description, price, image)
- Edit event details:
  - Sale start/end dates
  - Pickup event date/time/location
  - Campaign status (pre-launch, active, closed)
- Edit Zelle payment information:
  - Recipient name
  - Recipient email/phone
  - Payment instructions
  - Upload/replace Zelle QR code

**4.10.3 Scout Management**
- Add new scouts
- Edit scout information (name, parent info, rank)
- View scout details and performance
- Deactivate scouts
- Bulk export scout data

**4.10.4 Order Management**
- View all orders (filterable/searchable)
- Filter by: scout, date, ribbon color, payment status, order type, fulfillment status
- Order details view
- Edit order attribution
- Edit payment status
- Edit fulfillment status
- Manual order entry
- Export orders to CSV
- Mark orders as fulfilled
- Bulk status updates

**4.10.5 Email Template Editor**
- Edit all email templates
- HTML editor with preview
- Test email sending
- Available merge fields documentation
- Configure email send triggers and timing
- Zelle information merge fields available

**4.10.6 Donation Tracking**
- View all donations
- Filter donations by attribution
- Total donation amount dashboard
- Export donation report
- Thank donors via email

**4.10.7 Settings**
- Campaign dates
- Zelle configuration (recipient info, QR code upload)
- Google Sheets connection settings
- Email sender name and from address
- Site branding (logo, colors if customizable)
- Admin user management (add/remove admins)
- Scout Law scroll enable/disable and text edit

---

### 4.11 Scout/Parent Portal

**4.11.1 Dashboard**
- Personal sales summary:
  - Total wreaths sold
  - Total revenue generated (including donations attributed to them)
  - Current leaderboard position
  - Orders breakdown (online vs offline)
  - Payment status summary (paid vs pending)
- Recent orders list
- Pending payment orders highlighted

**4.11.2 Sales Entry**
- Form to enter offline sales (see 4.4.1)
- View history of entered sales
- Edit recent offline entries
- Mark payment as received

**4.11.3 Resources**
- Download QR code (scout's attribution link)
- Copy unique selling link
- View Zelle payment instructions to share with customers
- Download/print Zelle QR code to show customers
- View selling tips
- Campaign status and dates

**4.11.4 Payment Management**
- View pending payments for their attributed orders
- Mark customer payments as received (updates payment status)
- Payment reminder tool (send reminder email to customer)

---

## 5. Technical Specifications

### 5.1 Architecture

**Frontend:**
- Static HTML/CSS/JavaScript site hosted on GitHub Pages
- Modern, responsive design (mobile-first)
- Framework options: React, Vue, vanilla JavaScript with build step
- Client-side routing for single-page application experience
- Fixed bottom scroll displaying Scout Law

**Backend/Data:**
- Google Sheets as database
- Google Apps Script for API layer
- Sheets structure:
  - Scouts sheet
  - Products sheet (ribbon colors)
  - Orders sheet
  - Donations sheet
  - Site content sheet
  - Email templates sheet
  - Configuration sheet (including Zelle info)

**APIs:**
- Google Sheets API (via Apps Script Web App)
- Google Apps Script for email sending (Gmail API)
- No payment processing API needed (manual Zelle)

**Authentication:**
- Simple token-based auth for scout/admin portals
- Session management with localStorage/sessionStorage
- Admin vs Scout role differentiation

**Asset Storage:**
- Ribbon color sample photos stored in Google Drive or repository
- Zelle QR code stored in Google Drive or repository
- Scout attribution QR codes generated and stored

### 5.2 Data Schema

**Scouts Table (Google Sheet)**
```
scout_id | scout_name | parent_name | parent_email | rank | unique_slug | qr_code_url | password_hash | created_date | active
```

**Products Table (Ribbon Colors)**
```
product_id | ribbon_color_name | description | price | image_url | active | created_date | last_modified
```

**Orders Table**
```
order_id | order_date | customer_name | customer_email | customer_phone | scout_id | order_type (online/offline) | payment_status | payment_method | items_json | total_amount | notes | fulfillment_status | entry_method | entered_by
```

**Donations Table**
```
donation_id | donation_date | donor_name | donor_email | amount | scout_id | payment_status | payment_method | notes | entered_by
```

**Site Content Table**
```
content_key | content_value | last_modified | modified_by
```

**Email Templates Table**
```
template_id | template_name | subject | body_html | active | last_modified
```

**Configuration Table**
```
config_key | config_value | last_modified
```
(Includes: zelle_recipient_name, zelle_recipient_contact, zelle_qr_url, zelle_instructions, scout_law_text, scout_law_enabled)

### 5.3 Third-Party Services

**Zelle:**
- No API integration
- QR code and payment info displayed to customers
- Manual payment confirmation by admin/scout parent

**Google Services:**
- Google Sheets (data storage)
- Google Apps Script (backend logic and API)
- Gmail API (email sending)
- Google Drive (image/QR code storage)

**GitHub Pages:**
- Static site hosting
- Custom domain support (optional)
- HTTPS enabled

### 5.4 QR Code Generation
- Scout attribution QR codes generated server-side (Apps Script using library or API)
- Store QR code images in Google Drive or as data URLs
- Include in welcome email and downloadable from portal
- Pack's Zelle QR code uploaded by admin

### 5.5 Implementation Decisions (Finalized)

**Frontend Framework:**
- React 18+ with Vite for build tooling
- Rationale: Modern development experience, component reusability, excellent ecosystem
- Bundle size acceptable for this use case (targets desktop and mobile)

**Authentication Strategy:**
- Simple password-based authentication
- Passwords hashed and stored in Google Sheets
- Session tokens stored in localStorage
- Role-based access (admin, scout, public)
- Rationale: Simplest for users, no Google account required, adequate security for low-stakes fundraiser

**Asset Storage:**
- All images committed to GitHub repository
- Structure: `/public/images/{products,branding,zelle}/`
- Scout QR codes generated and stored as data URLs in Sheets
- Rationale: Simple deployment, no permission issues, version controlled

**Email Strategy:**
- Gmail API via Google Apps Script (100 emails/day limit with personal account)
- Priority emails only:
  - Customer order confirmations (immediate, high priority)
  - Pickup reminders (batched 3-5 days before event)
- De-prioritized/portal-based instead:
  - Scout sale notifications (shown in portal dashboard instead)
  - Payment reminders (manual process or in-portal alerts)
- Mitigation: Implement email queue with priority system
- Rationale: Focuses limited quota on customer experience

**Campaign Scale:**
- Target: 20-30 scouts
- Expected: 100-300 orders
- Timeline: 7-8 week build, 4-6 week campaign
- Solo developer implementation

**Asset Management:**
- All campaign content (products, dates, Zelle info) provided upfront
- Stored in configuration files and Google Sheets
- Admin can edit via dashboard after launch

---

## 6. User Flows

### 6.1 Customer Purchase Flow (Via Scout Link)
1. Scout shares unique link with neighbor
2. Customer clicks link, arrives at site with scout attribution
3. Customer sees Scout Law scrolling at bottom of page
4. Customer browses wreath ribbon color options
5. Customer adds wreaths and/or donation to cart
6. Customer proceeds to checkout
7. Customer sees "You're supporting Cub Scout: Tommy Jones"
8. Customer enters contact information
9. Order summary displays with Zelle payment instructions and QR code
10. Customer completes order (or marks for later payment)
11. Order confirmation page displays with Zelle payment details
12. Customer receives confirmation email with Zelle instructions
13. Customer sends Zelle payment using provided information
14. Scout/parent marks payment as received when notification comes through
15. Customer receives payment confirmation and pickup details

### 6.2 Customer Donation Flow
1. Customer navigates to site (attributed or non-attributed)
2. Customer selects "Donation" option
3. Customer enters donation amount
4. Customer proceeds to checkout
5. Customer enters contact information
6. Donation summary displays with Zelle payment instructions
7. Customer sends Zelle payment for donation
8. Donation is tracked and attributed if applicable

### 6.3 Scout Offline Sale Entry Flow
1. Scout sells wreath door-to-door
2. Scout/parent logs into portal
3. Scout navigates to "Enter Sale" page
4. Scout enters customer and order details
5. Scout selects payment status (Pending Zelle, Cash, Check)
6. Scout submits sale
7. Sale is recorded and order created
8. Confirmation message displays
9. Sale appears in scout's dashboard
10. If pending payment: Scout/parent reminds customer to pay via Zelle
11. When payment received: Scout/parent marks as paid

### 6.4 Admin Scout Setup Flow
1. Admin logs into dashboard
2. Admin navigates to "Scouts" section
3. Admin clicks "Add Scout"
4. Admin enters scout details (name, parent email, rank)
5. Admin saves scout
6. System generates unique link and QR code
7. System sends welcome email to parent with credentials, materials, and Zelle payment info to share
8. Confirmation message to admin

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Page load time < 3 seconds on 4G connection
- Checkout process completion < 2 minutes
- Support for 50+ concurrent users during peak times
- Scout Law scroll animation smooth and non-janky

### 7.2 Security
- HTTPS for all pages
- Secure password storage (hashed)
- No payment processing (no PCI compliance needed)
- CSRF protection on forms
- Input validation and sanitization
- Admin authentication required for sensitive operations
- Scout portal requires authentication

### 7.3 Usability
- Mobile-responsive design (works on smartphones)
- Accessible (WCAG 2.1 AA compliance where feasible)
- Simple language appropriate for general audience
- Clear error messages
- Intuitive navigation
- Clear Zelle payment instructions
- Easy QR code scanning on mobile devices

### 7.4 Reliability
- Data backup strategy for Google Sheets
- Error handling for API failures
- Transaction logging for debugging
- Order confirmation even if email fails

### 7.5 Maintainability
- Code documentation
- Admin-editable content (no code changes needed)
- Clear separation of content from code
- Version control (Git/GitHub)

---

## 8. Out of Scope (V1)

- Multi-pack support
- Delivery management (only pickup supported)
- Customer accounts/login
- Subscription/recurring sales
- Advanced analytics and reporting
- Mobile app
- Social media sharing automation
- Automated Zelle payment confirmation (manual process)
- Refund processing (handled manually)
- International orders
- Inventory management (not needed for made-to-order model)

---

## 9. Future Considerations (V2+)

- SMS notifications via Twilio
- Scout mobile app for easier sale entry
- Automated Zelle payment confirmation via bank API (if available)
- Integration with other payment processors (PayPal, Venmo, Stripe)
- Advanced reporting dashboard
- Customer reorder capability for future campaigns
- Printed order management for pickup event
- Photo gallery of wreaths (customer submissions)
- Social sharing buttons with scout attribution tracking

---

## 10. Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
- Google Sheets setup and schema
- Google Apps Script API development
- GitHub Pages repository setup
- Basic frontend scaffolding
- Scout Law scroll implementation

### Phase 2: Customer Flow (Week 2-3)
- Product catalog page (ribbon colors)
- Donation option
- Shopping cart functionality
- Checkout flow with Zelle instructions
- Order confirmation
- Scout attribution logic

### Phase 3: Admin Dashboard (Week 3-4)
- Admin authentication
- Scout management
- Product/ribbon color management
- Order management
- Content editor (including Zelle info)
- Basic analytics
- Zelle QR code upload

### Phase 4: Scout Portal & Manual Entry (Week 4-5)
- Scout authentication
- Scout dashboard
- Offline sales entry
- QR code generation
- Unique link generation
- Payment status management

### Phase 5: Email & Notifications (Week 5-6)
- Email template system
- Automated customer emails (with Zelle instructions)
- Scout notification emails
- Payment reminder emails
- Email editor in admin dashboard

### Phase 6: Leaderboard & Gamification (Week 6)
- Leaderboard page
- Sales rankings
- Gamification elements

### Phase 7: Testing & Launch Prep (Week 7-8)
- End-to-end testing
- User acceptance testing with pack leaders
- Content population
- Scout onboarding
- Production launch

---

## 11. Open Questions

1. **What are the available ribbon color options?** (Need specific colors, prices, and sample photos)
2. **What is the price per wreath?** (Same for all ribbon colors or different?)
3. **What is the target sale timeline?** (Start date, end date, pickup date)
4. **How many scouts are participating?** (Determines scale requirements)
5. **What is the pack location?** (For site branding and pickup location)
6. **Are there any existing brand guidelines or logos?** (For visual design)
7. **Who will be the primary admin(s)?** (For training purposes)
8. **Is there a desired custom domain?** (Or use GitHub Pages default)
9. **What is the recipient organization name for donations?** (Currently "a local church" - need specific name)
10. **What are the Zelle account details?** (Name, email/phone, QR code image)
11. **What is the refund/cancellation policy?** (Need content for site)
12. **Are there any legal/compliance requirements?** (Tax collection, terms of service)

---

## 12. Assumptions

- Scouts and parents have access to email and smartphones
- Pack has access to Google Workspace or personal Google accounts
- Pack has Zelle account set up for receiving payments
- Wreaths will be made-to-order after campaign ends
- No shipping/delivery logistics required
- All customers are within local geographic area
- Campaign is time-limited (not year-round)
- Basic technical support available from pack leader
- Minimal customer support needed (FAQ page sufficient)
- Customers are familiar with Zelle or can easily learn
- Parents will manually check for Zelle payments and update system

---

## 13. Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Google Sheets API rate limits | High | Medium | Implement caching, batch operations, quota monitoring |
| Gmail 100 emails/day limit exceeded | Medium | Medium | Priority queue system, focus on customer confirmations + pickup reminders, move scout notifications to portal |
| Customers unfamiliar with Zelle | Medium | Medium | Clear instructions, alternative payment methods (cash/check for offline) |
| Manual payment confirmation delays | Medium | High | Scout portal alerts for pending payments, clear instructions to parents |
| Payment tracking errors | Medium | Medium | Admin override capability, order notes field, payment verification process |
| Low scout/parent technical adoption | Medium | Medium | Provide clear training materials, video walkthroughs |
| Made-to-order supply issues | High | Low | Order tracking with sufficient lead time, communicate production timeline |
| Data loss in Google Sheets | High | Low | Regular automated backups, version history enabled |
| Security breach (localStorage auth) | Medium | Low | HTTPS only, input sanitization, regular security reviews, acceptable risk for fundraiser |
| Low customer adoption of online ordering | Medium | Medium | Ensure offline entry is easy, promote online convenience |

---

## Document Control

**Version:** 4.0
**Last Updated:** 2025-11-08
**Author:** Product Design Team
**Reviewers:** Pack 182 Leadership
**Status:** Approved - Ready for Implementation

---

## Appendix

### A. Glossary
- **Scout Attribution**: Linking a sale to a specific scout for credit
- **Offline Sale**: Order placed door-to-door, phone, or email (entered manually)
- **Online Sale**: Order placed directly through website
- **QR Code**: Scannable code that directs to scout's unique link or Zelle payment
- **Unique Slug**: URL-friendly identifier for each scout (e.g., tommy-jones)
- **Zelle**: Bank-to-bank payment transfer system used in the US
- **Made-to-Order**: Wreaths produced after orders are received (no pre-inventory)
- **Scout Law**: The values and principles that all scouts commit to upholding

### B. Cub Scout Ranks Reference
The following ranks are used in Cub Scouting (in progression order):
- **Lion**: Kindergarten
- **Tiger**: 1st Grade
- **Wolf**: 2nd Grade
- **Bear**: 3rd Grade
- **Webelos**: 4th Grade
- **Arrow of Light**: 5th Grade (highest Cub Scout rank)

### C. Scout Law
"A Scout is Trustworthy, Loyal, Helpful, Friendly, Courteous, Kind, Obedient, Cheerful, Thrifty, Brave, Clean, and Reverent"

### D. Success Criteria for Launch
- [ ] All admin content editors functional
- [ ] At least 3 ribbon color options created with sample photos
- [ ] Donation option configured with recipient organization
- [ ] Minimum 5 scouts registered with unique links
- [ ] Zelle payment information configured with QR code
- [ ] All 8 email templates configured and tested (including Zelle instructions)
- [ ] Leaderboard displaying correctly
- [ ] Scout Law scroll working on all pages
- [ ] Mobile responsiveness verified on iOS and Android
- [ ] Admin and scout portal authentication working
- [ ] Manual sale entry tested by scouts
- [ ] Order confirmation emails delivered within 1 minute
- [ ] Payment status tracking functional
- [ ] Google Sheets data recording all transactions
- [ ] Order tracking/production summary working

### E. Reference Links
- Google Apps Script: https://developers.google.com/apps-script
- GitHub Pages: https://pages.github.com
- Zelle: https://www.zellepay.com
- Cub Scout Ranks: https://www.scouting.org/programs/cub-scouts/
- Scout Law: https://www.scouting.org/about/faq/question10/
