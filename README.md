# MACHINE MINDS — CTF Platform

**THINK. DECODE. CONQUER.**

A Capture The Flag competition platform built for **Parivartan 2026**. Built with Next.js, Supabase, and Tailwind CSS.

## Features

- Email/password authentication (Supabase Auth)
- Team creation and joining via invite codes
- 6 challenge categories: Web, Crypto, Forensics, OSINT, Reverse Engineering, AI Security
- Secure server-side flag validation (SHA-256 hashed)
- Real-time leaderboard with first-blood tracking
- Hint system with configurable point penalties
- Rate-limited submissions
- Admin dashboard: challenge CRUD, team management, submission monitoring, competition controls
- Responsive dark theme with cybersecurity aesthetic
- Deployable on Vercel

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd machine-minds
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Go to **Project Settings > API** and copy:
   - Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in the values from step 2.

### 4. Run the database migration

Go to your Supabase project > **SQL Editor** and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, indexes, RLS policies, and default settings.

### 5. (Optional) Seed example challenges

Run the contents of `supabase/seed.sql` in the SQL Editor.

### 6. Create an admin user

1. Start the app and register a new account.
2. In Supabase > **SQL Editor**, run:

```sql
UPDATE public.profiles SET is_admin = true WHERE email = 'your-email@example.com';
```

### 7. Run locally

```bash
npm run dev
```

Visit http://localhost:3000.

### 8. Configure Supabase Auth

In Supabase Dashboard > **Authentication > URL Configuration**:

- Set **Site URL** to your deployed URL (e.g., https://your-app.vercel.app)
- Add http://localhost:3000 to **Redirect URLs** for local development

**Important**: Under **Authentication > Email**, disable "Confirm email" for faster testing, or configure an email provider.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to vercel.com and import the repository.
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel domain)
4. Deploy.
5. Update the **Site URL** in Supabase Auth settings to match your Vercel domain.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_SITE_URL` | Your app's public URL |

## Project Structure

```
app/
  page.tsx              Landing page
  login/                Login page
  register/             Registration page
  dashboard/            Participant dashboard
  challenges/           Challenge listing and details
  leaderboard/          Team rankings
  rules/                Competition rules
  admin/                Admin dashboard (protected)
    challenges/         Challenge management
    teams/              Team management
    submissions/        Submission monitoring
    settings/           Competition settings
  actions/              Server actions
  api/auth/callback/    OAuth callback
components/
  ui/                   Reusable UI components
  layout/               Navbar, footer
  dashboard/            Dashboard-specific components
  challenges/           Challenge-specific components
  admin/                Admin-specific components
lib/
  supabase/             Supabase client helpers
  auth/                 Auth utilities
  utils.ts              Utility functions
types/
  index.ts              TypeScript types
supabase/
  migrations/           SQL migrations
  seed.sql              Example challenge data
```

## Adding Challenges

Use the admin dashboard at `/admin/challenges` to create challenges. Enter the flag in plaintext; it is hashed (SHA-256) before storage and never exposed.

## Security Notes

- Flags are stored as SHA-256 hashes; plaintext flags never reach the client
- All flag validation happens server-side
- Admin status is checked server-side via the service role key
- Row Level Security enforces data access at the database level
- The Supabase service role key is only used in server-side code
- Submissions are rate-limited per user
- Duplicate solves are prevented by database unique constraints
