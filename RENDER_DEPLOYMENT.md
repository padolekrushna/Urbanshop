# Render Deployment Guide for Urbanshop Backend

## Prerequisites
- GitHub account with your repository
- Render account (free tier at render.com)
- UptimeRobot account (free tier)
- Supabase project (already configured)

## Step 1: Prepare Your Code for Render

Your `backend/main.py` has been updated with:
- Health endpoint at `/health` and `/api/health` for UptimeRobot
- Configurable CORS via `ALLOWED_ORIGINS` environment variable
- Proper port handling for Render's `$PORT` variable

Your `render.yaml` has been updated with:
- Correct start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Environment variables for Supabase and CORS

## Step 2: Deploy Backend on Render

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository (`padolekrushna/Urbanshop`)
4. Configure the service:
   - **Name**: `urbanshop-backend`
   - **Environment**: `Python 3`
   - **Plan**: `Free`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`

5. Set Environment Variables (in Render dashboard → Environment):
   - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app,http://localhost:8080`
   - `SUPABASE_URL`: `https://bxagesejrodvhlmfiunj.supabase.co`
   - `SUPABASE_ANON_KEY`: `sb_publishable_VYPZoCGSUXBLmTl1jFVcYg_a3ERNCq6`
   - `SUPABASE_SERVICE_ROLE_KEY`: *(from your Supabase dashboard)*
   - `JWT_SECRET`: *(generate a secure secret)*

6. Click **"Create"** and wait for deployment

## Step 3: Get Your Backend URL

After deployment, Render will provide a URL like:
`https://urbanshop-backend.onrender.com`

**Test it:**
- Health check: `https://urbanshop-backend.onrender.com/health`
- API docs: `https://urbanshop-backend.onrender.com/docs`
- Products: `https://urbanshop-backend.onrender.com/api/products`

## Step 4: Update Frontend Config

Edit `frontend/config.js` and replace:
```javascript
API_URL: "https://your-render-backend.onrender.com/api"
```
with your actual Render URL.

## Step 5: Deploy Frontend on Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Framework: `Other` (since it's static HTML/CSS/JS)
   - Build Command: *(leave empty)*
   - Output Directory: `frontend`
4. Deploy and get your Vercel URL

## Step 6: Update CORS in Render

In Render dashboard → Environment, update `ALLOWED_ORIGINS` to:
```
https://your-frontend.vercel.app,http://localhost:8080
```

## Step 7: Set Up UptimeRobot to Keep Backend Awake

Render's free tier sleeps after 15 minutes of inactivity. UptimeRobot will ping every 5 minutes to keep it awake.

1. Go to https://uptimerobot.com
2. Create free account
3. Click **"Add Monitor"**
4. Configure:
   - **Monitor Type**: `HTTP(s)`
   - **URL**: `https://your-render-backend.onrender.com/health`
   - **Interval**: `5 minutes`
   - **Monitor Friendly Name**: `Urbanshop Backend Health`
5. Save the monitor

## Step 8: (Optional) Set Up Custom Domain

In Render:
- Go to your service → Settings → Custom Domain
- Add your domain (e.g., `api.urbanshop.com`)

In Vercel:
- Go to project → Settings → Domains
- Add your domain (e.g., `www.urbanshop.com`)

## Verification Checklist

- [ ] Backend deployed on Render
- [ ] `/health` endpoint returns `{"status": "ok"}`
- [ ] `/api/products` returns product data
- [ ] Frontend deployed on Vercel
- [ ] Frontend can fetch from backend (CORS working)
- [ ] UptimeRobot monitoring active
- [ ] Supabase credentials set in Render
- [ ] Admin panel accessible (if using Supabase auth)

## Notes

- **Free tier limits**: Render free tier has 750 hours/month and sleeps after 15 min inactivity
- **UptimeRobot free tier**: Supports 50 monitors at 5-minute intervals
- **Supabase free tier**: Database pauses after 1 week of inactivity; regular backend pings prevent this
- **Cost**: All components free (Render, Vercel, UptimeRobot, Supabase free tiers)