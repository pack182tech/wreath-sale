# Backend Setup Guide - Pack 182 Wreath Sale

This guide will help you set up the backend services for the Pack 182 Wreath Sale platform. Currently, the application uses mock data stored in localStorage. This guide outlines how to integrate with real backend services.

---

## Overview

The application currently needs backend services for:
1. **Database** - Store scouts, orders, and configuration
2. **Authentication** - User login and session management
3. **Email Service** - Order confirmations and notifications
4. **Payment Processing** - Zelle integration (currently manual)

---

## Option 1: Firebase Setup (Recommended)

Firebase provides a complete backend solution with minimal setup.

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `pack182-wreath-sale`
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firebase Services

#### **Firestore Database**
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in **production mode**
4. Choose your location (us-central recommended)
5. Click "Enable"

#### **Authentication**
1. Go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider
4. Click "Save"

#### **Hosting** (for deployment)
1. Go to "Hosting"
2. Click "Get started"
3. Follow the setup instructions

### Step 3: Get Firebase Credentials

1. In Firebase Console, click the gear icon → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register app name: `Pack 182 Wreath Sale`
5. Copy the Firebase configuration object

### Step 4: Configure Environment Variables

Create a `.env` file in the project root (see `.env.example` below)

### Step 5: Install Firebase SDK

```bash
npm install firebase
```

### Step 6: Update Data Layer

Replace mock data functions in `src/utils/mockData.js` with Firebase calls.

---

## Option 2: Supabase Setup

Supabase is an open-source Firebase alternative with PostgreSQL.

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Sign up and create new project
3. Choose project name: `pack182-wreath-sale`
4. Set a strong database password
5. Choose region (us-east-1 recommended)

### Step 2: Create Database Tables

Run this SQL in the Supabase SQL Editor:

```sql
-- Scouts table
CREATE TABLE scouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  rank TEXT NOT NULL,
  email TEXT,
  parent_name TEXT,
  parent_email TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  scout_id UUID REFERENCES scouts(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  comments TEXT,
  supporting_scout TEXT,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL
);

-- Site configuration table
CREATE TABLE site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_scout_id ON orders(scout_id);
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

### Step 3: Set Up Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for scouts (for attribution)
CREATE POLICY "Allow public read on active scouts"
  ON scouts FOR SELECT
  USING (active = true);

-- Authenticated users can manage orders
CREATE POLICY "Allow authenticated insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read orders"
  ON orders FOR SELECT
  USING (true);
```

### Step 4: Get Supabase Credentials

1. In Supabase Dashboard, go to "Settings" → "API"
2. Copy:
   - Project URL
   - anon/public key
   - service_role key (keep secret!)

### Step 5: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

---

## Option 3: Custom Backend with Node.js/Express

### Step 1: Create Backend Server

```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv pg stripe nodemailer
```

### Step 2: PostgreSQL Database Setup

Install PostgreSQL and create database:

```bash
createdb pack182_wreath_sale
```

Run the SQL schema from Option 2 (Supabase) above.

### Step 3: Create Express Server

Create `backend/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// API Routes
app.get('/api/scouts', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM scouts WHERE active = true');
  res.json(rows);
});

app.post('/api/orders', async (req, res) => {
  const { order } = req.body;
  // Insert order logic
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

---

## Email Service Setup

### Option A: SendGrid

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create API key
3. Verify sender email
4. Add to `.env`:
   ```
   SENDGRID_API_KEY=your_key_here
   SENDGRID_FROM_EMAIL=threebridgespack182@gmail.com
   ```

### Option B: Gmail SMTP

1. Enable 2-factor authentication on Gmail
2. Generate app-specific password
3. Add to `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=threebridgespack182@gmail.com
   SMTP_PASS=your_app_password
   ```

---

## Environment Variables Template

See `.env.example` file in the project root.

---

## Next Steps After Setup

1. **Update Data Layer**: Replace `src/utils/mockData.js` functions with API calls
2. **Update Auth Context**: Replace localStorage auth with real authentication
3. **Add Error Handling**: Implement proper error handling for API calls
4. **Add Loading States**: Show spinners while data is loading
5. **Test All Features**: Verify scouts, orders, and admin functions work

---

## Deployment Options

### Option 1: Vercel (Frontend) + Firebase/Supabase (Backend)
- Push code to GitHub
- Connect Vercel to repository
- Add environment variables in Vercel dashboard
- Deploy

### Option 2: Firebase Hosting (Full Stack)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Option 3: Netlify (Frontend) + Custom Backend
- Connect Netlify to GitHub repository
- Set build command: `npm run build`
- Set publish directory: `dist`
- Add environment variables

---

## Security Checklist

- [ ] Never commit `.env` file to git
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS policies
- [ ] Implement rate limiting on API endpoints
- [ ] Validate all user input
- [ ] Use parameterized queries to prevent SQL injection
- [ ] Implement proper authentication and authorization
- [ ] Enable row-level security (RLS) on database
- [ ] Regularly backup database

---

## Support

For questions about backend setup:
- Firebase Docs: https://firebase.google.com/docs
- Supabase Docs: https://supabase.com/docs
- Express Docs: https://expressjs.com/

---

**Last Updated**: November 9, 2025
**Version**: 1.2.0
