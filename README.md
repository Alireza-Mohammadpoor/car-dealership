# پنل مدیریت نمایشگاه خودرو (Car Dealership Management Panel)

A private, internal management application for a car dealership with fewer than 100 vehicles. Built with React, Vite, TypeScript, Tailwind CSS, and Supabase. Fully Persian (Farsi) and RTL.

This is **not** a public website — it's a single-admin internal tool for adding cars, uploading photos, and finding any vehicle instantly through one global search box.

---

## Tech Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth + Storage)
- React Hook Form + Zod
- TanStack React Query
- React Router
- Lucide React icons

---

## Step 1 — Install dependencies

```bash
npm install
```

---

## Step 2 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose an organization, name (e.g. `dealership-panel`), a strong database password, and a region close to you.
4. Wait for the project to finish provisioning (~2 minutes).

---

## Step 3 — Create the database tables

1. In your Supabase project, open **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the file `supabase/schema.sql` from this project, copy its **entire contents**, and paste it into the SQL editor.
4. Click **Run**.

This single script creates:
- The `cars` table (all vehicle fields).
- The `car_images` table (linked to `cars` via `car_id`, with `on delete cascade`).
- Indexes on frequently searched columns (brand, model, year, plate, VIN, phone, status).
- An `updated_at` auto-update trigger.
- Row Level Security (RLS) policies (see Step 4 — already included in the script).
- The `car-images` Storage bucket and its access policies (see Step 5 — already included).

> The script is idempotent — you can safely re-run it if needed (it drops and recreates policies).

---

## Step 4 — Row Level Security (already configured by the script)

The script enables RLS on both `cars` and `car_images` and adds policies so that:

- Only **authenticated** users can `select`, `insert`, `update`, or `delete` rows.
- Anonymous (logged-out) visitors cannot read or write anything.

You don't need to do anything extra here — just confirm it worked:

1. Go to **Table Editor** → click on `cars` → the **RLS** badge should say "Enabled".
2. Go to **Authentication → Policies** to see the policies listed.

---

## Step 5 — Storage bucket (already configured by the script)

The script also creates a public bucket named `car-images` and sets policies so that:

- Only authenticated users can upload, update, or delete files.
- Anyone with a direct link (i.e. the app itself) can **view** images, since the bucket is public — this is what allows uploaded photos to display in the `<img>` tags of the app.

To confirm: go to **Storage** in the sidebar — you should see a `car-images` bucket.

If for any reason the bucket wasn't created by the script, create it manually:

1. Go to **Storage** → **New bucket**.
2. Name: `car-images`.
3. Toggle **Public bucket** to ON.
4. Click **Create bucket**, then re-run just the storage policy portion of `schema.sql`.

---

## Step 6 — Create the first (and only) admin user

This app is designed for a single dealership employee/admin.

1. Go to **Authentication → Users** in your Supabase dashboard.
2. Click **Add user** → **Create new user**.
3. Enter an email and password for the admin (e.g. `admin@yourdealership.com`).
4. Make sure **Auto Confirm User** is checked (so no email confirmation step is required).
5. Click **Create user**.

Use this email and password to log in to the app.

> To add a second staff member later, just repeat this step with another email — no code changes required.

---

## Step 7 — Environment variables

1. In your Supabase project, go to **Settings → API**.
2. Copy the **Project URL** and the **anon public** key.
3. In the root of this project, copy `.env.example` to a new file named `.env`:

```bash
cp .env.example .env
```

4. Open `.env` and fill in the values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> ⚠️ Never commit `.env` to version control, and never use the **service_role** key in this frontend app — only the **anon/public** key belongs here. `.env` is already listed in `.gitignore`.

---

## Step 8 — Run the application locally

```bash
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`) and log in with the admin credentials created in Step 6.

---

## Building for production

```bash
npm run build
```

This type-checks the project and outputs a production build to `dist/`. You can preview the production build locally with:

```bash
npm run preview
```

Deploy the contents of `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, your own server, etc). Remember to set the same `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` environment variables in your hosting provider's dashboard.

---

## Project Structure

```text
src/
├── components/
│   ├── layout/        # Sidebar, MobileNav, DashboardLayout
│   ├── cars/           # SearchBar, CarCard, CarTable, ImageGallery
│   ├── forms/          # CarForm, ImageUploader
│   └── ui/             # StatusBadge, ConfirmModal, LoadingState, EmptyState
├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── Cars/
│   ├── AddCar/
│   ├── CarDetails/
│   └── EditCar/
├── lib/
│   └── supabase.ts     # Supabase client
├── hooks/
│   ├── useAuth.tsx      # Auth context (Supabase Auth)
│   ├── useToast.tsx     # Toast notifications
│   └── useCars.ts       # React Query hooks for cars
├── services/
│   ├── cars.ts          # CRUD + global search queries
│   └── storage.ts       # Image upload/compression/delete
├── types/
│   └── car.ts
├── utils/
│   └── format.ts        # Price/date/mileage formatting
├── App.tsx              # Routes + protected routes
└── main.tsx
```

---

## How the global search works

Typing anything into the search box (dashboard or the "خودروها" page) queries **all** relevant fields at once — brand, model, trim, color, license plate, VIN, owner name, owner phone, description, and even numeric fields like year/price/mileage (matched as text so partial numbers work, e.g. typing `0912` finds phone numbers containing it). Matching is case-insensitive and partial (`kia` matches `Kia Sportage`, `sport` matches `Sportage`, `2022` matches any 2022 vehicle).

---

## Final checklist (already implemented)

- [x] Login / logout via Supabase Auth
- [x] Protected routes (redirect to `/login` when unauthenticated)
- [x] Add / edit / delete a vehicle
- [x] Multiple image upload with preview, removal, and "set as main image"
- [x] Client-side image compression (resized + converted to WebP before upload)
- [x] Global search across all fields, with partial matching
- [x] Car details page with gallery, clickable `tel:` phone link, status badge
- [x] Status change (available / reserved / sold)
- [x] Data persists in Postgres (Supabase) — survives refresh and browser close
- [x] Fully RTL, Persian UI, Vazirmatn font
- [x] Responsive: sidebar on desktop, mobile menu + card layout on small screens
- [x] Loading, error, and empty states throughout, all in Persian
- [x] Delete confirmation modal
- [x] Row Level Security so only the authenticated admin can read/write data
