# Rent With You - Production Real Estate Web Application

**Rent With You** is a modern, responsive, high-performance real estate platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase** (PostgreSQL, Auth, Storage, and RLS).

Designed and crafted strictly following the brand design specifications and wireframes.

---

## 🌟 Features & Highlights

- **Branding & Visual Design:**
  - Deep Navy Blue (`#1B2A4A`) hero containers and primary buttons.
  - Warm Amber/Gold (`#E59A38`) accents, badges, and CTAs.
  - Warm Cream/Beige (`#FAF8F5`) cards and crisp white canvas.
  - Integrated WhatsApp CTA Green (`#1F8A5B`) with pre-filled context messages.
- **Top Navigation Bar (Sticky on all pages):**
  - Brand Logo with Amber/Gold square icon.
  - 6 Menu items: `Home`, `For Owner & Developer`, `Rent`, `Buy`, `Commercial`, `About`.
  - Right actions: `Profile` (Auth), `Wishlist` (live counter), `Connect Us` (Call & WhatsApp modal).
- **Home Page:**
  - Full-screen Navy Hero with interactive tabbed search (`Rent` | `Buy` | `Commercial`) and budget/property-type/bedroom/furnishing filters.
  - "What do you need today?" quick service cards:
    - **Packers & Movers** (Dedicated comprehensive moving quote modal).
    - **Furniture** (Browse monthly rental packages and buy brand-new furniture).
    - **Rent** & **Buy** shortcuts.
  - Two Category Showcase sections (`Rental properties` with budget chips & `Buy - new projects`) with interactive pagination.
- **Listing Pages (`/rent`, `/buy`, `/commercial`):**
  - Left sidebar filters: Location, Property Type, Bedrooms, Furnishing, Price dual range slider.
  - Dynamic listing count and sorting (`Newest`, `Price: Low to High`, `Price: High to Low`).
- **Property Detail Page (`/property/[id]`):**
  - Breadcrumbs navigation.
  - Multi-image gallery with interactive thumbnails and full-screen lightbox modal.
  - 2x2 key fact cards (`Type`, `Bedrooms`, `Furnishing`, `Available from`).
  - Direct conversion CTAs: **Chat on WhatsApp** (`+91 9911169115`) and **Call now**.
  - Verified property ID and Owner/Dealer metadata.
- **For Owner & Developer (`/list-your-property`):**
  - 2-minute listing form with drag-and-drop photo uploader directly uploading to Supabase Storage `property-images`.
  - Submissions enter approval workflow with `status = 'pending'`.
  - "Why list with us?" value highlights.
- **Dedicated Admin Panel (`/admin`):**
  - Strict access control restricted to `NEXT_PUBLIC_ADMIN_EMAIL`.
  - Overview metrics: Total Properties, Pending Review, Live Approved, Total Enquiries, Visitor Counter.
  - **Pending Approvals Queue:** One-click `Approve & Publish`, `Reject`, or `Edit Details`, plus direct owner WhatsApp/Call buttons.
  - **All Properties Manager:** Searchable and filterable table with full edit, badge management, and delete actions.
  - **Enquiries & Leads Desk:** Real-time customer enquiries with one-click WhatsApp reply.
- **Global Footer:**
  - Complete contact details, popular searches, quick links, city directory links.
  - Live 7-digit digital-style **Visitor Counter** (`0000000`) and smooth scroll Back-to-Top button.
- **Full Fallback / Offline Readiness:**
  - Even before Supabase credentials are plugged in, the app operates with mock seed data and local storage syncing!

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v18.17+ or v20+ / v22+
- **npm** or **pnpm** or **yarn**

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_ADMIN_EMAIL=rentwithyou.gurgaon@gmail.com
```

### 4. Supabase Database & Storage Setup
1. Open your project on [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** and run the contents of [`supabase/schema.sql`](file:///supabase/schema.sql).
   - This sets up the `properties`, `wishlists`, `enquiries`, and `site_stats` tables with Row Level Security (RLS) policies and functions.
3. Next, run [`supabase/seed.sql`](file:///supabase/seed.sql) to populate realistic properties for Gurgaon, Delhi, and Noida.
4. Go to **Storage** on Supabase Dashboard:
   - Ensure the bucket named `property-images` exists and is set to **Public**.
   - (The script in `schema.sql` creates this bucket automatically).

### 5. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🛡️ Admin Panel Access
- The Admin Panel is located at `/admin`.
- Access is strictly governed by `NEXT_PUBLIC_ADMIN_EMAIL` (`rentwithyou.gurgaon@gmail.com`).
- For instant testing in local development without email login, use the **"Switch to Demo Admin"** button available on `/admin` or `/profile`.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub or GitLab.
2. Go to [Vercel](https://vercel.com) and click **"Add New" > "Project"**.
3. Import this repository.
4. Add the Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAIL`
5. Click **Deploy**. Vercel will build and launch your production application!

---

## 📞 Global Contact Info
- **Phone / WhatsApp:** `+91 9911169115`
- **Email:** `rentwithyou.gurgaon@gmail.com`
- **Instagram:** `@rent.withyou`
- **Address:** Golf Course Extension Road, Sector 65, Gurgaon, Haryana 122001
- **Copyright:** © 2026 Rent With You. All rights reserved.
