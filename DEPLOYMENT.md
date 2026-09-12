# Urbanshop Deployment Guide

## Keep Backend Awake (Render Free Tier)

Render's free tier puts your backend to sleep after 15 minutes of inactivity. To keep it active:

**1.** Sign up for [UptimeRobot](https://uptimerobot.com) (free)

**2.** Click **"Add New Monitor"**

**3.** Set:

| Field | Value |
|-------|-------|
| **Monitor Type** | HTTP(s) |
| **Friendly Name** | Urbanshop Backend |
| **URL** | `https://urbanshop-backend.onrender.com/api/ping` |
| **Monitoring Interval** | 5 minutes |

**4.** Click **"Create Monitor"**

UptimeRobot will ping your backend every 5 minutes, keeping it awake 24/7.

Your backend also has a `/api/ping` endpoint — this is what UptimeRobot monitors.

---

## Use Admin Panel (No Code Changes Needed)

The admin panel already works with your existing code. No changes needed in the UI.

**Steps to access Admin:**

**1.** Go to your deployed frontend URL (e.g., `https://urbanshop-frontend.onrender.com`)

**2.** Go to `/auth.html` and **Sign Up** with your email and password

**3.** Go to [Supabase Dashboard](https://app.supabase.com) → **SQL Editor**

**4.** Run this SQL (replace with your email):

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

**5.** Sign out from your app, then **Sign Back In**

**6.** Visit `/admin.html` — you now have admin access!

**To revoke admin:** Run the same SQL but set `role = 'user'`

---

## Deploy to Render (Recommended - Free)

Render supports both frontend (static) and backend (Python) in one project.

### Quick Deploy

**1.** Go to [render.com](https://render.com) → Sign up with GitHub

**2.** Click **"New"** → **"Import repo"**

**3.** Select your `padolekrushna/Urbanshop` repo

**4.** Render auto-detects `render.yaml` and creates both services:

| Service | Type | URL |
|---------|------|-----|
| `urbanshop-backend` | Web (Python) | `https://urbanshop-backend.onrender.com` |
| `urbanshop-frontend` | Static Site | `https://urbanshop-frontend.onrender.com` |

**5.** Go to `urbanshop-frontend` → **Settings** → **Environment Variables**:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://urbanshop-backend.onrender.com/api` |
| `VITE_SUPABASE_URL` | Your Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Key |

**6.** Click **"Save Changes"** — auto-redeploys with new env vars

**7.** Done! Your app is live at `https://urbanshop-frontend.onrender.com`

---

## Manual Deploy (Backend Only)

If you prefer to deploy backend separately:

### Backend on Render
1. **New** → **"Web Service"**
2. Connect repo
3. **Build Command**: `pip install -r backend/requirements.txt`
4. **Start Command**: `python backend/main.py`
5. Set env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`
6. Creates URL like `https://urbanshop-xxxx.onrender.com`

### Frontend on Render Static
1. **New** → **"Static Site"**
2. Connect repo
3. **Publish Directory**: `frontend`
4. Set `VITE_API_URL` to your backend URL

---

## Database (Supabase)

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in SQL Editor
3. Update `frontend/config.js` with your credentials
4. Register a user, then in SQL Editor:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
   ```

---

## Backend API URL

After deploying backend, update `render.yaml` or set manually:

| Service | VITE_API_URL |
|---------|-------------|
| Both on Render | `https://urbanshop-backend.onrender.com/api` |
| Backend on Railway | `https://web-production-5e30a.up.railway.app/api` |
