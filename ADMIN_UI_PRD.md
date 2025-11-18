# Admin Panel UI - Product Requirements Document

## Executive Summary

This document provides a comprehensive specification for rebuilding the Pack 182 Wreath Sale Admin Dashboard from scratch. The admin panel is a web-based management interface that allows Pack 182 administrators to oversee scouts, orders, email templates, and site configuration for their annual wreath fundraising campaign.

**Current Implementation:** React-based single-page application
**Data Backend:** Google Sheets via Google Apps Script API
**Authentication:** Simple email/password (localStorage-based sessions)
**Deployment:** GitHub Pages static hosting

---

## 1. System Architecture & Data Flow

### 1.1 Technology Stack
- **Frontend:** React 18+ with React Router v6
- **Styling:** Pure CSS (no frameworks)
- **State Management:** React Context API (AuthContext, CartContext, ScoutContext)
- **Data Storage:** Google Sheets (via Apps Script Web App endpoint)
- **Configuration:** JSON config loaded from Google Sheets, cached in memory
- **Authentication:** Simple hardcoded credentials stored in AuthContext
- **Build Tool:** Vite
- **Deployment:** GitHub Pages (static hosting)

### 1.2 Data Services Architecture

**Primary Data Sources:**
1. **Google Sheets** (Production source of truth)
   - Scouts sheet (scout roster with contact info)
   - Orders sheet (customer orders)
   - Config sheet (site configuration)
   - Email templates sheet

2. **Apps Script Service** (`src/services/appsScriptService.js`)
   - Deployed as web app with POST endpoint
   - Actions: `getScouts`, `getOrders`, `createOrder`, `updateOrderStatus`, `getConfig`
   - URL: Configured via `VITE_APPS_SCRIPT_URL` environment variable

3. **Data Service Layer** (`src/utils/dataService.js`)
   - Abstraction layer that enforces production-only mode
   - Throws errors if Apps Script not configured
   - **IMPORTANT:** Scout/order editing disabled - all modifications must be done directly in Google Sheets

4. **Config Loader** (`src/utils/configLoader.js`)
   - Loads configuration from Google Sheets
   - Falls back to local `src/config/content.json` if API unavailable
   - Implements 5-minute in-memory cache
   - **IMPORTANT:** Config editing is DISABLED in production

### 1.3 Authentication Flow

```
User visits /admin
  ↓
ProtectedRoute checks AuthContext
  ↓
If not authenticated → Redirect to /login
  ↓
Login page validates against hardcoded ADMIN_USERS array
  ↓
On success → Store user session in localStorage
  ↓
Redirect to /admin (AdminDashboard)
```

**Authentication Details:**
- Located in: `src/context/AuthContext.jsx`
- Admin credentials hardcoded in `ADMIN_USERS` array
- Session stored in localStorage key: `currentUser`
- No backend validation (client-side only)
- Protected routes use `<ProtectedRoute requireAdmin={true}>` wrapper

---

## 2. Admin Dashboard Structure

### 2.1 Route & Access Control

**Route:** `/admin`
**Access:** Requires authenticated admin user
**Protected By:** `<ProtectedRoute requireAdmin={true}>`
**Component:** `src/pages/AdminDashboard.jsx`

### 2.2 Page Layout

The admin dashboard uses a consistent layout structure:

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
│  - Title: "Admin Dashboard"                            │
│  - Subtitle: "Pack 182 Wreath Sale Management"         │
│  - Logout Button (right-aligned)                       │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ TAB NAVIGATION                                          │
│  [Overview] [Orders] [Scouts] [Email Templates]        │
│  (Site Configuration tab commented out - disabled)      │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ ACTIVE TAB CONTENT                                      │
│  (Content changes based on selected tab)               │
│                                                         │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ FOOTER                                                  │
│  [← Back to Store] [View Leaderboard]                  │
└─────────────────────────────────────────────────────────┘
```

### 2.3 State Management

**Local Component State:**
```javascript
const [activeTab, setActiveTab] = useState('overview')
const [scouts, setScouts] = useState([])
const [orders, setOrders] = useState([])
const [stats, setStats] = useState({
  totalRevenue: 0,
  totalOrders: 0,
  totalUnits: 0,
  activeScouts: 0
})
const [selectedOrder, setSelectedOrder] = useState(null)
const [selectedScoutQR, setSelectedScoutQR] = useState(null)
const [selectedScoutEmail, setSelectedScoutEmail] = useState(null)
const [editingScout, setEditingScout] = useState(null)
const [scoutFormData, setScoutFormData] = useState({ /* scout fields */ })
const [siteConfig, setSiteConfig] = useState({
  campaign: {},
  pack: {},
  products: [],
  donation: {},
  zelle: {},
  content: {},
  scoutAttributionBanner: {},
  cart: {},
  checkout: {},
  scoutLaw: {},
  productDisclaimer: '',
  emailTemplates: {},
  images: {}
})

// Table controls
const [sortBy, setSortBy] = useState('name')
const [sortDirection, setSortDirection] = useState('asc')
const [filterRank, setFilterRank] = useState('')
const [filterStatus, setFilterStatus] = useState('')
const [searchQuery, setSearchQuery] = useState('')
```

**Data Loading:**
- `loadData()` function called on mount via `useEffect`
- Fetches scouts, orders, and config in parallel
- Calculates statistics from orders data

---

## 3. Tab-by-Tab Functional Specification

### 3.1 Overview Tab

**Purpose:** High-level campaign performance dashboard

**Layout:**
```
┌───────────────────────────────────────────────────────┐
│ STATISTICS GRID (4 cards)                            │
├──────────┬──────────┬──────────┬──────────────────────┤
│ 💰       │ 📦       │ 🎯       │ 👥                   │
│ $XXX.XX  │ XX       │ XX       │ XX                   │
│ Total    │ Units    │ Total    │ Active               │
│ Revenue  │ Sold     │ Orders   │ Scouts               │
└──────────┴──────────┴──────────┴──────────────────────┘
┌───────────────────────────────────────────────────────┐
│ RECENT ORDERS (Last 10)                              │
│ ┌───────────────────────────────────────────────┐   │
│ │ Order ID | Customer | Scout | Total | Status │   │
│ │ Date                                          │   │
│ └───────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

**Statistics Cards:**
1. **Total Revenue**
   - Icon: 💰
   - Value: Sum of all order totals
   - Format: `$XXX.XX`

2. **Units Sold**
   - Icon: 📦
   - Value: Sum of all order item quantities
   - Format: Integer

3. **Total Orders**
   - Icon: 🎯
   - Value: Count of all orders
   - Format: Integer

4. **Active Scouts**
   - Icon: 👥
   - Value: Count of scouts where `active === true`
   - Format: Integer

**Recent Orders Table:**
- Displays last 10 orders (`.slice(0, 10)`)
- Columns:
  - Order ID (monospace font)
  - Customer (name)
  - Scout (name, or "N/A" if no scout attributed)
  - Total (formatted as currency)
  - Status (badge with color coding)
  - Date (formatted as locale date string)
- Read-only view (no interactions)

**CSS Classes:**
- `.stats-grid` - 4-column responsive grid
- `.stat-card` - Individual stat card with hover effect
- `.recent-activity` - Container for recent orders
- `.orders-table` - Table styling

---

### 3.2 Orders Tab

**Purpose:** Comprehensive order management and viewing

**Features:**
1. **Orders Table** (all orders)
2. **Order Status Management** (dropdown per order)
3. **Order Details Modal** (view full order info)
4. **Delete Order** (disabled with alert message)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ All Orders                                          │
├─────────────────────────────────────────────────────┤
│ Order ID | Customer    | Scout  | Items | Total    │
│          | Email       |        |       |          │
│ Type     | Status      | Actions                  │
├─────────────────────────────────────────────────────┤
│ 123456   | John Doe    | Scout1 | 3     | $105.00  │
│          | j@email.com |        | items |          │
│ online   | [dropdown]  | [View] [Delete]          │
└─────────────────────────────────────────────────────┘
```

**Table Columns:**

1. **Order ID**
   - Display: Monospace font, gray color
   - Source: `order.orderId`

2. **Customer**
   - Display: Name (main), Email (sub-info)
   - Source: `order.customer.name`, `order.customer.email`

3. **Scout**
   - Display: Scout name or "No Attribution"
   - Source: Lookup scout by `order.scoutId`

4. **Items**
   - Display: Count of items (e.g., "3 item(s)")
   - Source: `order.items.length`

5. **Total**
   - Display: Currency formatted
   - Source: `order.total.toFixed(2)`

6. **Type**
   - Display: Badge (online/offline)
   - Source: `order.type || 'online'`
   - Styles:
     - `online`: Blue background (#e3f2fd), blue text
     - `offline`: Orange background (#fff3e0), orange text

7. **Status**
   - Display: Dropdown select
   - Options: pending, paid, fulfilled, cancelled
   - Source: `order.status || 'pending'`
   - Action: `handleOrderStatusUpdate(orderId, newStatus)`
   - **Functional:** Updates order status via Apps Script API

8. **Actions**
   - **View Button:** Opens order details modal
   - **Delete Button:** Shows alert (disabled in production)
     - Message: "Order deletion is disabled in production. Please delete the order directly in Google Sheets."

**Order Details Modal:**

When user clicks "View" button, modal appears with:

```
┌───────────────────────────────────────────────┐
│ Order Details                            [×] │
├───────────────────────────────────────────────┤
│ Order ID:     123456                         │
│ Customer:     John Doe                       │
│               john@email.com                 │
│               (555) 123-4567                 │
│ Items:        2x Red Bow Wreath - $70.00    │
│               1x 6" Poinsettia - $7.00      │
│ Total:        $77.00                         │
│ Comments:     (customer comments if any)     │
└───────────────────────────────────────────────┘
```

**Modal Implementation:**
- Triggered by: `setSelectedOrder(order)`
- Closed by: Click overlay or X button
- CSS: `.modal-overlay`, `.modal-content`
- Data displayed:
  - Order ID
  - Customer name, email, phone
  - Line items with quantities and prices
  - Total
  - Customer comments (if present)

**Status Update Behavior:**
- Calls `updateOrderStatus(orderId, status)` from dataService
- Updates Google Sheets via Apps Script
- Reloads all data after successful update
- Shows alert on error

**Disabled Functions:**
- `handleDeleteOrder()` - Shows alert, does not delete

---

### 3.3 Scouts Tab

**Purpose:** Scout roster management, QR code generation, welcome email generation

**Features:**
1. **Add Scout Button** (shows alert - disabled in production)
2. **Search & Filter Controls**
3. **Sortable Scout Table**
4. **QR Code Modal**
5. **Welcome Email Preview Modal**
6. **Edit/Delete Buttons** (show alerts - disabled in production)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Scout Management              [+ Add Scout (disabled)]│
├─────────────────────────────────────────────────────┤
│ [Search...] [Rank Filter ▼] [Status Filter ▼]      │
│                              [Clear Filters]         │
├─────────────────────────────────────────────────────┤
│ Name ↑ | Rank ↑ | Parent ↑ | Orders | Revenue | ... │
├─────────────────────────────────────────────────────┤
│ Scout, John | Wolf | Jane Smith | 5 | $175.00 | ... │
│             |      | j@email.com|   |         | ... │
│ Actions: [QR/Link] [Email] [Edit] [Delete]         │
└─────────────────────────────────────────────────────┘
```

**Table Controls:**

1. **Search Input**
   - Searches: scout name, parent name, parent emails, rank
   - Updates in real-time as user types
   - Case-insensitive

2. **Rank Filter Dropdown**
   - Options: All Ranks, Lion, Tiger, Wolf, Bear, Webelos
   - Filters scouts by rank

3. **Status Filter Dropdown**
   - Options: All Status, Active, Inactive
   - Filters scouts by active status

4. **Clear Filters Button**
   - Only visible when filters are active
   - Resets search and all filters

**Scout Table Columns (All Sortable):**

1. **Name** ↑↓
   - Display: Scout name (bold)
   - Sort: Alphabetical by name
   - Click header to toggle sort direction

2. **Rank** ↑↓
   - Display: Scout rank (Lion, Tiger, Wolf, Bear, Webelos, Arrow of Light)
   - Sort: Alphabetical by rank

3. **Parent** ↑↓
   - Display: Parent name (main), Parent emails (sub-info, comma-separated)
   - Sort: Alphabetical by parent name
   - Note: Supports multiple parent emails (array)

4. **Orders** ↑↓
   - Display: Count of orders attributed to this scout
   - Calculated: Count orders where `scoutId === scout.id`
   - Sort: Numerical

5. **Revenue** ↑↓
   - Display: Total revenue from scout's orders
   - Format: Currency (`$XXX.XX`)
   - Calculated: Sum of order totals for this scout
   - Sort: Numerical

6. **Units** ↑↓
   - Display: Total units sold by this scout
   - Calculated: Sum of all item quantities in scout's orders
   - Sort: Numerical

7. **Status** ↑↓
   - Display: Badge (Active/Inactive)
   - Styles:
     - Active: Green background, green text
     - Inactive: Gray background, gray text
   - Sort: Boolean (active first)

8. **Actions**
   - 4 buttons arranged in 2 rows:
     - Row 1: `[QR/Link]` `[Email]`
     - Row 2: `[Edit]` `[Delete]`

**Action Buttons:**

1. **QR/Link Button**
   - Opens QR Code Modal
   - Shows scout's unique URL and QR code
   - Functional (enabled)

2. **Email Button**
   - Opens Welcome Email Preview Modal
   - Generates welcome email with scout info
   - Functional (enabled)

3. **Edit Button**
   - Shows alert: "Scout editing is disabled in production. Please update scout information directly in Google Sheets."
   - Does not open edit form

4. **Delete Button**
   - Shows alert: "Scout deletion is disabled in production. Please delete scouts directly in Google Sheets."
   - Does not delete scout

**Sorting Implementation:**
- Click column header to sort
- First click: Ascending
- Second click: Descending
- Visual indicator: ↑ or ↓ next to column name
- State: `sortBy` (column name), `sortDirection` ('asc' or 'desc')
- Function: `getFilteredAndSortedScouts()` applies filters and sort

**Scout URL Generation:**
```javascript
const getScoutUrl = (scout) => {
  const baseUrl = window.location.origin + import.meta.env.BASE_URL
  return `${baseUrl}?scout=${scout.slug}`
}
```

**QR Code Modal:**

```
┌───────────────────────────────────────────────┐
│ Scout Name - QR Code                     [×] │
├───────────────────────────────────────────────┤
│          ┌─────────────┐                     │
│          │   QR CODE   │                     │
│          │   (256x256) │                     │
│          └─────────────┘                     │
│                                               │
│ Scout: John Scout                            │
│ Rank: Wolf                                   │
│ Parent: Jane Smith                           │
│ URL: https://pack182...?scout=john-scout    │
│                                               │
│ Instructions: This QR code is unique to      │
│ [scout name]. When customers scan it...      │
│                                               │
│ [Print QR Code] [Download QR Code]          │
│              [Email to Parent]               │
└───────────────────────────────────────────────┘
```

**QR Code Modal Features:**
- Uses `qrcode.react` library (`<QRCodeSVG>`)
- QR code settings:
  - Value: Scout URL
  - Size: 256px
  - Error correction level: H
  - Include margin: true
- Display scout info (name, rank, parent, URL)
- Actions:
  1. **Print QR Code** - Opens print dialog
  2. **Download QR Code** - Converts SVG to PNG, downloads as `{scout-slug}-qr-code.png`
  3. **Email to Parent** - Switches to Welcome Email Modal for same scout

**Welcome Email Preview Modal:**

```
┌─────────────────────────────────────────────────┐
│ Welcome Email Preview - Scout Name         [×] │
├─────────────────────────────────────────────────┤
│ To: parent@email.com                           │
│ Subject: Pack 182 Wreath Sale - [Scout] Link  │
│ Note: This email would be sent in production   │
├─────────────────────────────────────────────────┤
│ [EMAIL PREVIEW RENDERED AS HTML]               │
│                                                 │
│ Includes:                                      │
│ - Welcome message                              │
│ - Scout's personalized link                    │
│ - QR code (live, embedded)                     │
│ - Instructions for using link/QR              │
│ - What's being sold                            │
│ - Pickup details                               │
│ - Contact information                          │
└─────────────────────────────────────────────────┘
```

**Welcome Email Generation Function:**

Location: `generateWelcomeEmail(scout)` (AdminDashboard.jsx:260-345)

Features:
- Parses scout name from "Lastname, Firstname" to "Firstname Lastname"
- Generates personalized email with:
  - To: All parent emails (comma-separated array)
  - Subject: `Pack 182 Wreath Sale - {First} {Last}'s Unique Sales Link & QR Code`
  - Body: HTML email with:
    - Welcome header
    - Scout-specific messaging
    - Scout's unique URL
    - QR code (rendered live in preview)
    - Usage instructions
    - Product list
    - Pickup details (TBD)
    - Contact information
- QR code embedded as `<QRCodeSVG>` component (200x200px)
- Styled with inline CSS for email compatibility

**Scout Form (Disabled):**

The scout form is present in the code but disabled. When "Add Scout" or "Edit" is clicked, an alert is shown instead. The form would have included:

Fields:
- Scout Name (text, required)
- Slug (URL) (text, required) - format: "firstname-lastname"
- Rank (dropdown, required) - Lion, Tiger, Wolf, Bear, Webelos, Arrow of Light
- Scout Email (email, optional)
- Parent Name (text, optional)
- Parent Emails (text, optional) - comma-separated list
- Active (checkbox, default: true)

Actions:
- Save Scout (shows alert - disabled)
- Cancel (clears form)

---

### 3.4 Email Templates Tab

**Purpose:** Edit email templates with live preview

**Implementation:** Uses `EmailTemplateEditor` component

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Email Template Editor          [Save Template]     │
├─────────────────────────────────────────────────────┤
│ Select Template: [Dropdown ▼]                      │
├─────────────────────────────────────────────────────┤
│ Email Subject Line:                                │
│ [Input field with placeholders]                    │
├─────────────────────────────────────────────────────┤
│ Available Placeholders (click to insert):          │
│ [Customer Name] [Order ID] [Scout Name] ...        │
├─────────────────────────────────────────────────────┤
│ Edit Template (HTML)    │  Live Preview           │
│ ┌────────────────────┐  │  ┌───────────────────┐  │
│ │ <div>...           │  │  │ [Rendered HTML]   │  │
│ │                    │  │  │                   │  │
│ │ (HTML editor)      │  │  │ (Preview pane)    │  │
│ └────────────────────┘  │  └───────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Features:**

1. **Template Selector**
   - Dropdown showing available templates
   - Templates stored in `siteConfig.emailTemplates`
   - Each template has: `name`, `description`, `subject`, `htmlBody`

2. **Subject Line Editor**
   - Text input
   - Supports placeholders (e.g., `{{orderId}}`, `{{customerName}}`)

3. **Placeholder Buttons**
   - Grid of clickable buttons
   - Each button shows:
     - Label (e.g., "Customer Name")
     - Placeholder code (e.g., `{{customerName}}`)
   - Click to insert placeholder into HTML editor at cursor
   - 45 available placeholders including:
     - Customer info: name, order details
     - Scout info: name, first name, link, QR code URL
     - Campaign info: dates, pickup info
     - Payment info: Zelle details, QR code
     - Pack info: name, leader email

4. **HTML Editor**
   - Large textarea for HTML code
   - Monospace font
   - Syntax: Plain HTML with inline styles (for email compatibility)
   - Supports placeholders like `{{customerName}}`
   - Supports conditionals: `{{#if scoutName}}...{{/if}}`

5. **Live Preview Pane**
   - Renders HTML with sample data
   - Updates in real-time as user types
   - Shows subject line with sample data
   - Replaces placeholders with realistic test values
   - Scrollable

6. **Conditional Content Info**
   - Instructions for using conditionals
   - `{{#if scoutName}}...{{/if}}` - Show only when scout attributed
   - `{{#if isDonation}}...{{/if}}` - Show only for donation orders

7. **Save Template Button**
   - Calls `onSave(templateKey, { subject, htmlBody })`
   - Updates `siteConfig.emailTemplates`
   - Calls `saveConfig()` - **NOTE:** This is disabled in production and will throw error
   - Shows alert on save

**Sample Placeholder Replacements (for preview):**
- `{{customerName}}` → "John Doe"
- `{{orderId}}` → "123456"
- `{{total}}` → "105.00"
- `{{scoutName}}` → "Tommy Anderson"
- `{{scoutLink}}` → "https://pack182tech.github.io/wreath-sale/#/?scout=tommy-anderson"
- `{{pickupDate}}` → "December 15, 2025"
- etc.

**CSS Styling:**
- Component CSS: `src/components/EmailTemplateEditor.css`
- Responsive grid layout for placeholder buttons
- Side-by-side editor and preview on desktop
- Stacked on mobile
- Color-coded sections (placeholders, conditionals, tips)

---

### 3.5 Site Configuration Tab (DISABLED/COMMENTED OUT)

**Current Status:** Tab is commented out in the navigation (lines 378-383 of AdminDashboard.jsx)

**Original Purpose:** Edit site-wide configuration including:
- Campaign information (dates, pickup location)
- Pack information (name, leader contact)
- Scout attribution banner text
- Hero section content
- About section content
- FAQ section
- Zelle payment information
- Donation settings
- Cart/checkout button text
- Scout Law display settings
- Product disclaimer
- Product details (name, price, description, active status)

**Layout (when enabled):**
```
┌─────────────────────────────────────────────────────┐
│ Site Configuration          [Save All Changes]     │
├─────────────────────────────────────────────────────┤
│ Campaign Information                                │
│ [Form fields for campaign details]                 │
├─────────────────────────────────────────────────────┤
│ Pack Information                                    │
│ [Form fields for pack details]                     │
├─────────────────────────────────────────────────────┤
│ Scout Attribution Banner                            │
│ [Text fields with placeholders]                    │
├─────────────────────────────────────────────────────┤
│ ... (other sections) ...                           │
├─────────────────────────────────────────────────────┤
│ Products                                            │
│ [Product editing forms]                            │
└─────────────────────────────────────────────────────┘
```

**Functionality (if re-enabled):**

The config tab (lines 943-1487) includes comprehensive forms for editing all aspects of site configuration. However, the `saveConfig()` function throws an error:

```javascript
// From configLoader.js
export const saveConfig = () => {
  throw new Error('Config editing disabled. Please update configuration directly in Google Sheets.')
}
```

**Key Sections:**

1. **Campaign Information** (lines 952-1021)
   - Name, status, start/end dates
   - Pickup date, time, location

2. **Pack Information** (lines 1023-1062)
   - Pack name, location
   - Leader name and email

3. **Scout Attribution Banner** (lines 1064-1105)
   - Banner text templates with `$scoutname` placeholder
   - Different messages for: scout attribution, pack default, scout not found

4. **Hero Section** (lines 1107-1125)
   - Title and subtitle

5. **About Section** (lines 1127-1145)
   - Title and text (textarea)

6. **FAQ Section** (lines 1147-1186)
   - FAQ title
   - Array of Q&A pairs (dynamic list)

7. **Zelle Payment** (lines 1188-1234)
   - Recipient first/last name
   - Contact info
   - Instructions
   - QR code text

8. **Cart/Checkout Settings** (lines 1236-1250)
   - Payment info message

9. **Donation Settings** (lines 1252-1365)
   - Enable/disable donations
   - Donation recipient and description
   - Popup messages (initial and confirmation)
   - Button text for popups

10. **Product Disclaimer** (lines 1367-1376)
    - Textarea for disclaimer text

11. **Checkout Button Text** (lines 1378-1400)
    - Place order button text
    - Continue shopping button text

12. **Scout Law** (lines 1402-1422)
    - Enable/disable display
    - Scout law text

13. **Products** (lines 1424-1485)
    - Iterate through products array
    - Edit name, price, description
    - Toggle active status
    - Product ID shown (read-only)

**Configuration State Management:**

The config is loaded from Google Sheets and stored in `siteConfig` state. Changes are tracked in real-time via `handleConfigChange()`:

```javascript
const handleConfigChange = (section, field, value, index = null) => {
  setSiteConfig(prev => {
    const updated = { ...prev }
    if (index !== null) {
      // Handle array items (FAQ, products)
      updated[section][index] = { ...updated[section][index], [field]: value }
    } else if (field) {
      // Handle nested objects
      updated[section] = { ...updated[section], [field]: value }
    } else {
      // Direct assignment
      updated[section] = value
    }
    return updated
  })
}
```

**Save Behavior:**
- Clicking "Save All Changes" calls `handleSaveConfigChanges()`
- Attempts to call `saveConfig(siteConfig)` from configLoader
- **This throws an error** because config editing is disabled in production
- If functional, would reload the page after saving

**Known Bug:**
The initial state for `siteConfig` is missing some required keys (`scoutLaw`, `productDisclaimer`, `emailTemplates`, `images`), which causes crashes when the config tab is rendered. See `ADMIN_PAGE_BUG_REPORT.md` for details.

---

## 4. UI/UX Design System

### 4.1 Color Palette

**Primary Colors:**
- Forest Green: `#1a472a` (headers, primary buttons, key text)
- Gold: `#d4af37` (accents, borders, highlights)
- Deep Green (hover): `#2a5f3d`, `#3a7f4d`

**Status Colors:**
- **Pending**: Orange background `#fff3e0`, text `#e65100`
- **Paid**: Blue background `#e3f2fd`, text `#1565c0`
- **Fulfilled**: Green background `#e8f5e9`, text `#2e7d32`
- **Cancelled**: Red background `#fee`, text `#c41e3a`
- **Active**: Green background `#e8f5e9`, text `#2e7d32`
- **Inactive**: Gray background `#f5f5f5`, text `#666`

**Type Badges:**
- **Online**: Blue background `#e3f2fd`, text `#1565c0`
- **Offline**: Orange background `#fff3e0`, text `#e65100`

**Background Colors:**
- Page background: Linear gradient `#f8fffe` to `#f0f9ff`
- Cards/sections: White `#fff` with box shadow
- Config sections: Light gray `#f8f8f8`
- Hover states: Light green `#e8f5e9`, light gold `#d4af37`

### 4.2 Typography

**Font Stack:**
- Primary: System fonts (Arial, sans-serif)
- Monospace: `'Courier New', Monaco, monospace` (for order IDs, code)

**Font Sizes:**
- Page title (h1): Default browser sizing
- Section headers (h2): Default, color `#1a472a`
- Subsection headers (h3): Default, color `#1a472a`
- Body text: `1rem`
- Small text (sub-info): `0.85rem`, color `#666`
- Buttons: `0.85rem` to `1rem`

**Font Weights:**
- Headers: `600` to `bold`
- Buttons: `500` to `600`
- Body: Normal
- Table headers: `600`

### 4.3 Component Styles

**Buttons:**

1. **Primary Button** (`.btn-primary`)
   - Background: `#1a472a`
   - Color: White
   - Padding: `0.75rem 1.5rem`
   - Border radius: `8px`
   - Hover: Slightly lighter green

2. **Secondary Button** (`.btn-secondary`)
   - Background: White or light gray
   - Border: `2px solid #d4af37`
   - Color: `#1a472a`
   - Hover: Background `#d4af37`, color white

3. **Action Buttons** (`.btn-action`)
   - Small, flex-1 width
   - Padding: `0.5rem 0.75rem`
   - Border radius: `6px`
   - Font size: `0.85rem`
   - Gradient backgrounds:
     - **Primary Action**: Green gradient `#1a472a` to `#2a5f3d`
     - **Edit**: Blue gradient `#2563eb` to `#1d4ed8`
     - **Delete**: Red gradient `#dc2626` to `#b91c1c`
   - Hover: Slightly lighter gradient, lift effect (`translateY(-1px)`)
   - Box shadow on hover

4. **View/Delete Buttons** (`.btn-view`, `.btn-delete`)
   - View: Green background `#1a472a`
   - Delete: Red background `#c41e3a`
   - Padding: `0.5rem 1rem`
   - Border radius: `4px`

**Tables:**

- Border collapse
- Header row: Background `#f8f8f8`, font weight `600`, color `#1a472a`
- Cell padding: `1rem`
- Border bottom: `1px solid #e0e0e0`
- Sortable headers: Cursor pointer, hover background `#e8f5e9`
- Responsive: Horizontal scroll on small screens

**Badges:**

- Padding: `0.25rem 0.75rem`
- Border radius: `4px`
- Font size: `0.85rem`
- Font weight: `600`
- Text transform: Uppercase
- Color-coded by status/type (see color palette)

**Cards:**

- Background: White
- Padding: `2rem`
- Border radius: `12px`
- Box shadow: `0 2px 10px rgba(0, 0, 0, 0.1)`
- Hover: Lift effect on stat cards (`translateY(-5px)`)

**Forms:**

- Input fields:
  - Padding: `0.75rem` to `1rem`
  - Border: `2px solid #ddd`
  - Border radius: `8px`
  - Font size: `1rem`
  - Focus: Border color `#1a472a`, no outline
- Labels:
  - Display: Block
  - Margin bottom: `0.5rem`
  - Font weight: `600`
  - Color: `#333`
- Form rows: 2-column grid (1 column on mobile)

**Modals:**

- Overlay: Fixed position, `rgba(0, 0, 0, 0.5)` background, centered
- Content:
  - Background: White
  - Padding: `2rem`
  - Border radius: `12px`
  - Max width: `600px` (larger for email preview: `700px`)
  - Max height: `80vh`
  - Overflow: Scroll
- Header:
  - Flex: Space between title and close button
  - Border bottom: `2px solid #e0e0e0`
  - Margin bottom: `1.5rem`
- Close button: Large `×`, gray, red on hover

**Tabs:**

- Container: Flex row, border bottom `2px solid #e0e0e0`
- Tab button:
  - Padding: `1rem 2rem`
  - No background
  - No border (except bottom)
  - Color: `#666`
  - Font weight: `600`
  - Cursor: Pointer
  - Hover: Color `#1a472a`
  - Active: Color `#1a472a`, border bottom `3px solid #d4af37`

### 4.4 Responsive Behavior

**Breakpoints:**
- Desktop: `> 768px`
- Mobile: `≤ 768px`

**Mobile Adaptations:**
- Header: Stack vertically
- Tabs: Vertical layout, left border instead of bottom border for active state
- Stats grid: Single column
- Form rows: Single column
- Table controls: Stack vertically
- Tables: Smaller font size (`0.85rem`), reduced padding
- Footer: Stack buttons vertically
- Config sections: Reduced padding

**Desktop Layout:**
- Max width: `1400px`
- Centered with auto margins
- 4-column stats grid
- 2-column form rows

### 4.5 Animations & Interactions

**Transitions:**
- Buttons: `all 0.2s` or `all 0.2s ease`
- Input focus: `border-color 0.2s`
- Cards: `transform 0.2s`

**Hover Effects:**
- Stat cards: Lift (`translateY(-5px)`)
- Action buttons: Lift slightly (`translateY(-1px)`), enhanced shadow
- Table headers: Background change to light green
- Filters: Border color change

**Active/Click Effects:**
- Action buttons: Reset transform, reduce shadow

**Scroll Behavior:**
- Sticky header in config tab (when enabled)
- Smooth scroll for "Shop All Products" button on main site

---

## 5. Data Models

### 5.1 Scout Data Model

```javascript
{
  id: string,              // Unique ID (e.g., "scout-1")
  name: string,            // Format: "Lastname, Firstname"
  slug: string,            // URL-safe version (e.g., "firstname-lastname")
  rank: string,            // Lion, Tiger, Wolf, Bear, Webelos, Arrow of Light
  email: string,           // Scout's email (optional)
  parentName: string,      // Parent/guardian name
  parentEmails: string[],  // Array of parent emails
  active: boolean          // Whether scout is active in current campaign
}
```

### 5.2 Order Data Model

```javascript
{
  orderId: string,         // Unique order ID (e.g., "20241117-123456")
  scoutId: string,         // Scout ID (or null for no attribution)
  customer: {
    name: string,
    email: string,
    phone: string,
    comments: string
  },
  items: [
    {
      id: string,          // Product ID
      name: string,        // Product name
      price: number,       // Unit price
      quantity: number,    // Quantity ordered
      image: string        // Image filename
    }
  ],
  total: number,           // Total order amount
  type: string,            // "online" or "offline"
  status: string,          // "pending", "paid", "fulfilled", "cancelled"
  createdAt: string,       // ISO date string
  isDonation: boolean      // Whether this is a donation order
}
```

### 5.3 Config Data Model

```javascript
{
  campaign: {
    name: string,
    startDate: string,      // ISO date
    endDate: string,        // ISO date
    pickupDate: string,
    pickupTime: string,
    pickupLocation: string,
    status: string          // "active" or "inactive"
  },
  pack: {
    name: string,
    location: string,
    leaderName: string,
    leaderEmail: string
  },
  products: [
    {
      id: string,
      name: string,
      category: string,     // "wreaths", "poinsettias", "plants"
      description: string,
      price: number,
      image: string,        // Filename
      active: boolean
    }
  ],
  donation: {
    enabled: boolean,
    recipient: string,
    description: string,
    popupTitle: string,
    popupText: string,
    popupYesButton: string,
    popupNoButton: string,
    confirmationTitle: string,
    confirmationText: string,
    confirmationYesButton: string,
    confirmationNoButton: string
  },
  zelle: {
    recipientFirstName: string,
    recipientLastName: string,
    recipientContact: string,  // Email or phone
    instructions: string,
    qrCodeText: string
  },
  content: {
    heroTitle: string,
    heroSubtitle: string,
    aboutTitle: string,
    aboutText: string,
    faqTitle: string,
    faq: [
      {
        question: string,
        answer: string
      }
    ]
  },
  scoutAttributionBanner: {
    scoutText: string,        // With $scoutname placeholder
    defaultText: string,      // For pack (no scout)
    notFoundText: string      // For invalid scout link
  },
  cart: {
    paymentInfoMessage: string
  },
  checkout: {
    placeOrderButton: string,
    continueShoppingButton: string
  },
  scoutLaw: {
    enabled: boolean,
    text: string,
    examples: string[]        // Scout law points for animation
  },
  productDisclaimer: string,
  emailTemplates: {
    [templateKey]: {
      name: string,
      description: string,
      subject: string,
      htmlBody: string
    }
  },
  images: {
    // Image path configurations
  }
}
```

### 5.4 Statistics Data Model

Calculated in real-time from orders:

```javascript
{
  totalRevenue: number,      // Sum of all order totals
  totalOrders: number,       // Count of orders
  totalUnits: number,        // Sum of all item quantities
  activeScouts: number       // Count of scouts where active === true
}
```

### 5.5 Scout Statistics (per scout)

Calculated on-demand:

```javascript
{
  revenue: number,           // Total revenue from scout's orders
  units: number,             // Total units sold by scout
  orderCount: number         // Number of orders attributed to scout
}
```

---

## 6. API Integration

### 6.1 Apps Script Endpoint

**Base URL:** Configured via `VITE_APPS_SCRIPT_URL` environment variable

**Method:** POST (all requests)

**Request Format:**
```javascript
{
  action: string,           // Action name
  data: object              // Action-specific data
}
```

**Response Format:**
```javascript
{
  success: boolean,
  data: any,                // Action-specific response data
  error: string             // Error message if success === false
}
```

### 6.2 Available Actions

1. **getScouts**
   - Request: `{ action: "getScouts" }`
   - Response: `{ success: true, data: Scout[] }`

2. **getOrders**
   - Request: `{ action: "getOrders" }`
   - Response: `{ success: true, data: Order[] }`

3. **createOrder**
   - Request: `{ action: "createOrder", data: Order }`
   - Response: `{ success: true, data: { orderId: string } }`

4. **updateOrderStatus**
   - Request: `{ action: "updateOrderStatus", data: { orderId: string, status: string } }`
   - Response: `{ success: true, data: {} }`

5. **getConfig**
   - Request: `{ action: "getConfig" }`
   - Response: `{ success: true, data: Config }`

### 6.3 Error Handling

All API calls are wrapped in try/catch blocks. On failure:
- Log error to console
- Throw user-friendly error message
- Admin sees alert or error message in UI

Example:
```javascript
try {
  const orders = await appsScriptService.getOrders()
  setOrders(orders)
} catch (error) {
  console.error('Failed to fetch orders:', error)
  throw new Error('Unable to load order data. Please check your internet connection and try again.')
}
```

---

## 7. Authentication & Security

### 7.1 Authentication System

**Type:** Client-side only (no backend validation)

**Storage:** localStorage (key: `currentUser`)

**Session Data:**
```javascript
{
  id: string,
  email: string,
  role: string,           // "admin" or "scout"
  name: string
}
```

**Hardcoded Admin Credentials:**

Located in `src/context/AuthContext.jsx`:

```javascript
const ADMIN_USERS = [
  {
    id: 'admin-1',
    email: 'pack182tech@gmail.com',
    password: 'pack182admin',
    role: 'admin',
    name: 'Pack 182 Admin'
  }
]
```

**Login Flow:**
1. User submits email and password on `/login`
2. `login(email, password)` searches `ADMIN_USERS` array
3. If match found:
   - Store session in localStorage
   - Update AuthContext state
   - Return success
4. If no match:
   - Return error: "Invalid email or password"

**Logout:**
- Clear user from AuthContext state
- Remove `currentUser` from localStorage
- Redirect to `/login`

### 7.2 Route Protection

**Implementation:** `<ProtectedRoute>` wrapper component

**Behavior:**
- Shows loading state while auth checks
- If not authenticated → Redirect to `/login`
- If authenticated but not admin (for admin routes) → Redirect to `/scout-portal`
- Otherwise → Render protected component

**Usage:**
```jsx
<Route path="/admin" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

### 7.3 Security Considerations

**Current Limitations:**
- No password hashing (plaintext comparison)
- No backend validation
- Credentials hardcoded in source code
- Session stored in localStorage (accessible via JavaScript)
- No CSRF protection
- No rate limiting

**Recommendations for Production:**
- Move authentication to backend service
- Use secure session management (JWT or server sessions)
- Hash passwords
- Implement proper role-based access control
- Add HTTPS enforcement
- Consider OAuth or SSO for admin access

---

## 8. Known Issues & Limitations

### 8.1 Critical Bugs

**Admin Dashboard Crash (Fixed in latest commit):**
- **Issue:** Dashboard crashes on load with "Cannot read properties of undefined"
- **Root Cause:** Initial state for `siteConfig` missing keys: `scoutLaw`, `productDisclaimer`, `emailTemplates`, `images`
- **Fix:** Add missing keys to initial state OR use optional chaining
- **Reference:** `ADMIN_PAGE_BUG_REPORT.md`

### 8.2 Disabled Features

**Production Restrictions:**

1. **Scout Editing/Deletion**
   - Buttons show alert: "Scout editing is disabled in production. Please update scout information directly in Google Sheets."
   - Rationale: Prevent data inconsistencies; Google Sheets is source of truth

2. **Order Deletion**
   - Button shows alert: "Order deletion is disabled in production. Please delete the order directly in Google Sheets."
   - Rationale: Preserve order history; prevent accidental deletion

3. **Config Editing**
   - Tab is commented out
   - `saveConfig()` throws error if called
   - Rationale: Config managed via Google Sheets for consistency

4. **Email Sending**
   - Welcome email preview is display-only
   - No actual email sending capability
   - Note in UI: "This email would be sent in production"
   - Rationale: Email sending not implemented; manual process

### 8.3 Functional Limitations

1. **No Pagination**
   - All orders and scouts load at once
   - Could be slow with large datasets (100+ scouts, 1000+ orders)

2. **No Bulk Operations**
   - Can't select multiple orders/scouts for batch actions
   - Status updates must be done one at a time

3. **No Export/Reporting**
   - No CSV/Excel export
   - No printable reports
   - No data visualization/charts

4. **No Order Editing**
   - Can only update status, not line items or customer info

5. **No Scout Portal Differentiation**
   - Scout login exists but scout portal not fully implemented
   - Scouts can't see their own stats in dedicated view

6. **No Real-time Updates**
   - Must manually reload page to see new data
   - No WebSocket or polling for live updates

7. **Limited Search**
   - Search only works on scouts tab
   - No search for orders
   - No advanced filtering (date ranges, amount ranges)

### 8.4 UI/UX Issues

1. **Mobile Table Scrolling**
   - Tables horizontal scroll on mobile (can be awkward)
   - Consider responsive table alternatives (cards, collapse)

2. **No Loading States**
   - When updating order status, no loading indicator
   - Could be confusing if update is slow

3. **No Success Feedback**
   - Order status update doesn't show success message
   - Only shows alert on error

4. **Modal Print Layout**
   - QR code print view could be improved
   - No dedicated print stylesheet

5. **Long Email Preview**
   - Email preview modal can be very long
   - Scrolling can be tedious

### 8.5 Data Consistency

1. **Cache Staleness**
   - Config cached for 5 minutes
   - If config changed in Sheets, admin may see stale data

2. **No Conflict Resolution**
   - If two admins update same order status simultaneously, last write wins

3. **No Audit Trail**
   - No record of who changed what and when

---

## 9. Environment Configuration

### 9.1 Required Environment Variables

**File:** `.env` or `.env.production`

**Variables:**

1. `VITE_USE_APPS_SCRIPT`
   - Value: `"true"`
   - Purpose: Enable Apps Script backend

2. `VITE_APPS_SCRIPT_URL`
   - Value: Full URL to deployed Apps Script web app
   - Format: `https://script.google.com/macros/s/{SCRIPT_ID}/exec`
   - Purpose: API endpoint for data operations

3. `VITE_APP_VERSION` (optional)
   - Value: Version string (e.g., "3.0.0")
   - Purpose: Display version number in UI

**Example `.env.production`:**
```
VITE_USE_APPS_SCRIPT=true
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwfihShhmVyC6rmSiftbieJab5yVhpRSJ0bin8KoNp04Fa2RdXr6WO02ktshAMkqMIFQA/exec
VITE_APP_VERSION=3.0.0
```

### 9.2 Build Configuration

**Build Tool:** Vite

**Output:** `dist/` directory (static files)

**Base Path:** `/wreath-sale` (for GitHub Pages)

**Configured in:** `vite.config.js`

---

## 10. Deployment

### 10.1 Build Process

```bash
npm run build
```

Outputs to `dist/` directory.

### 10.2 GitHub Pages Deployment

**Method:** Manual deployment via `gh-pages` package

**Command:**
```bash
gh-pages -d dist
```

**Branch:** `gh-pages`

**URL:** `https://pack182tech.github.io/wreath-sale`

### 10.3 Post-Deployment Checks

1. Verify admin login works
2. Check that data loads from Google Sheets
3. Test order status updates
4. Verify QR code generation
5. Check email preview generation
6. Test responsive layouts on mobile

---

## 11. Future Enhancement Recommendations

### 11.1 High Priority

1. **Fix Admin Dashboard Crash**
   - Add missing keys to `siteConfig` initial state
   - Add error boundaries to catch rendering errors

2. **Implement Proper Authentication**
   - Backend authentication service
   - Secure session management
   - Password hashing

3. **Add Loading States**
   - Show spinners during API calls
   - Disable buttons during updates
   - Better UX feedback

4. **Order Search & Filtering**
   - Search by customer name, order ID
   - Filter by status, date range, scout
   - Sort by date, amount

5. **Export Functionality**
   - CSV export for orders and scouts
   - Printable reports
   - Scout performance summaries

### 11.2 Medium Priority

1. **Pagination**
   - Paginate orders and scouts tables
   - Configurable page size

2. **Bulk Actions**
   - Select multiple orders
   - Bulk status updates
   - Bulk scout email sending

3. **Real-time Updates**
   - WebSocket or polling for live data
   - Show when other admins are online

4. **Advanced Analytics**
   - Charts and graphs (revenue over time, top scouts, etc.)
   - Campaign performance metrics
   - Forecasting

5. **Audit Trail**
   - Log all changes (who, what, when)
   - View change history

### 11.3 Low Priority

1. **Scout Portal Enhancement**
   - Dedicated scout dashboard
   - Scout-specific stats and leaderboard
   - Scout welcome/onboarding flow

2. **Email Automation**
   - Implement actual email sending
   - Scheduled welcome emails
   - Order confirmation emails
   - Reminder emails

3. **Mobile App**
   - Native mobile app for scouts
   - QR code scanning from app

4. **Multi-language Support**
   - Internationalization (i18n)
   - Translate UI to multiple languages

5. **Theme Customization**
   - Allow pack to customize colors, logo
   - White-label for other packs

---

## 12. Technical Dependencies

### 12.1 NPM Packages

**Core:**
- `react`: ^18.0.0
- `react-dom`: ^18.0.0
- `react-router-dom`: ^6.x

**UI Components:**
- `qrcode.react`: QR code generation

**Build/Dev:**
- `vite`: Build tool
- `gh-pages`: Deployment to GitHub Pages

**No External CSS Frameworks:**
- All styles are custom CSS

### 12.2 Browser Compatibility

**Target:** Modern browsers (last 2 versions)
- Chrome
- Firefox
- Safari
- Edge

**Required Features:**
- ES6+ JavaScript
- CSS Grid
- Flexbox
- localStorage
- Fetch API

**Polyfills:** None (assumes modern browser)

---

## 13. File Structure Reference

```
src/
├── pages/
│   ├── AdminDashboard.jsx       # Main admin dashboard component
│   ├── AdminDashboard.css       # Admin dashboard styles
│   ├── Login.jsx                # Login page
│   ├── ScoutPortal.jsx          # Scout portal (minimal)
│   ├── Leaderboard.jsx          # Public leaderboard
│   └── FAQ.jsx                  # FAQ page
├── components/
│   ├── EmailTemplateEditor.jsx  # Email template editor
│   ├── EmailTemplateEditor.css  # Template editor styles
│   ├── ProtectedRoute.jsx       # Route authentication wrapper
│   ├── Cart.jsx                 # Shopping cart
│   ├── CartIcon.jsx             # Cart icon
│   ├── Checkout.jsx             # Checkout flow
│   ├── OrderConfirmation.jsx    # Order confirmation
│   ├── ProductCard.jsx          # Product display
│   └── ... (other components)
├── context/
│   ├── AuthContext.jsx          # Authentication state
│   ├── CartContext.jsx          # Shopping cart state
│   └── ScoutContext.jsx         # Scout attribution state
├── services/
│   ├── appsScriptService.js     # Apps Script API client
│   └── sheetsService.js         # (unused)
├── utils/
│   ├── dataService.js           # Data abstraction layer
│   ├── configLoader.js          # Config loading & caching
│   ├── productionCheck.js       # Production environment checks
│   └── mockData.js              # (unused)
├── config/
│   └── content.json             # Fallback config
├── styles/
│   └── App.css                  # Global styles
├── App.jsx                      # Root app component
└── main.jsx                     # Entry point
```

---

## 14. Glossary

**Terms:**

- **Scout:** A Cub Scout member of Pack 182 participating in the fundraiser
- **Attribution:** Linking an order to a specific scout for credit
- **Slug:** URL-safe identifier for a scout (e.g., "john-smith")
- **QR Code:** Scannable code that links to a scout's unique sales page
- **Apps Script:** Google Apps Script web app serving as backend API
- **Config:** Site-wide configuration stored in Google Sheets
- **Campaign:** The wreath sale fundraising event (with start/end dates)
- **Order Status:** Lifecycle stage of an order (pending, paid, fulfilled, cancelled)
- **Donation Order:** Order where proceeds go to donation recipient instead of scout
- **Welcome Email:** Email sent to scout parents with their unique link/QR code

---

## 15. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-17 | Initial PRD creation based on current implementation |

---

## Appendix A: Sample Screens

### A.1 Overview Tab
![Overview showing stats cards and recent orders table]

### A.2 Orders Tab
![Orders table with status dropdowns and view/delete buttons]

### A.3 Scouts Tab
![Scouts table with search, filters, and action buttons]

### A.4 QR Code Modal
![Modal showing scout QR code with download/print options]

### A.5 Email Preview Modal
![Modal showing welcome email preview with live QR code]

### A.6 Email Template Editor
![Split view showing HTML editor and live preview]

---

## Appendix B: Code Snippets

### B.1 Scout URL Generation

```javascript
const getScoutUrl = (scout) => {
  const baseUrl = window.location.origin + import.meta.env.BASE_URL
  return `${baseUrl}?scout=${scout.slug}`
}
```

### B.2 Statistics Calculation

```javascript
const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0)
const totalOrders = ordersData.length
const totalUnits = ordersData.reduce((sum, order) =>
  sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
)
const activeScouts = scoutsData.filter(s => s.active).length
```

### B.3 Filtering and Sorting Scouts

```javascript
const getFilteredAndSortedScouts = () => {
  let filtered = [...scouts]

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(scout => {
      const parentEmailsMatch = Array.isArray(scout.parentEmails) &&
        scout.parentEmails.some(email => email.toLowerCase().includes(query))
      return scout.name?.toLowerCase()?.includes(query) ||
        scout.parentName?.toLowerCase()?.includes(query) ||
        parentEmailsMatch ||
        scout.rank?.toLowerCase()?.includes(query)
    })
  }

  // Apply rank filter
  if (filterRank) {
    filtered = filtered.filter(scout => scout.rank === filterRank)
  }

  // Apply status filter
  if (filterStatus) {
    filtered = filtered.filter(scout =>
      filterStatus === 'active' ? scout.active : !scout.active
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aVal, bVal

    switch (sortBy) {
      case 'name':
        aVal = (a.name || '').toLowerCase()
        bVal = (b.name || '').toLowerCase()
        break
      case 'revenue':
        aVal = getScoutStats(a.id).revenue
        bVal = getScoutStats(b.id).revenue
        break
      // ... other cases
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  return filtered
}
```

---

**End of Document**
