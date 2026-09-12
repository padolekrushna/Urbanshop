# Urbanshop Deployment Guide

## Deploy to Vercel (Frontend)

### Prerequisites
1. Create a GitHub repository and push this project
2. Create a Vercel account at [vercel.com](https://vercel.com)
3. Import your repository into Vercel

### Frontend Deployment on Vercel

Vercel natively serves static HTML/CSS/JS files. The frontend is configured to deploy directly.

**Important**: Vercel does not natively support Python backends. You have two options:

#### Option A: Frontend on Vercel + Backend on Railway/Render (Recommended)

1. **Deploy Backend separately** on [Railway](https://railway.app) or [Render](https://render.com):
   - Connect your backend folder or repo
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `python backend/main.py`
   - Note the deployed URL (e.g., `https://urbanshop-api.onrender.com`)

2. **Deploy Frontend on Vercel**:
   - In Vercel dashboard, import your repo
   - Add environment variables in Vercel project settings:
     ```
     VITE_API_URL = https://your-backend-url.com/api
     VITE_SUPABASE_URL = your-supabase-url
     VITE_SUPABASE_ANON_KEY = your-anon-key
     ```
   - Deploy!

3. **Update `frontend/config.js`** to use relative paths or the deployed backend URL

#### Option B: Everything via Vercel (Static Only)

If using only the local API mode (no Supabase, mock backend):

1. Import repo into Vercel
2. The `vercel.json` routes will serve the static frontend
3. The backend API calls will fail unless you also deploy the backend

### Vercel Environment Variables

Set these in your Vercel project dashboard under **Settings > Environment Variables**:

| Name | Description | Example |
|------|-------------|---------|
| `VITE_API_URL` | Your backend API URL | `https://urbanshop-api.onrender.com/api` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `sb_publishable_...` |

### Quick Deploy Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
cd Urbanshop_FullStack
vercel --prod
```

## Deploy Backend (Python/FastAPI)

### Option 1: Railway.app (Free Tier)
1. Create a `Procfile` in project root:
   ```
   web: python backend/main.py
   ```
2. Connect Railway to your GitHub repo
3. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`

### Option 2: Render.com
1. Create a new Web Service
2. Connect your repo
3. Build command: `pip install -r backend/requirements.txt`
4. Start command: `python backend/main.py`

### Option 3: Fly.io
```bash
fly launch
fly deploy
```

## Database (Supabase)

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in SQL Editor
3. Update `frontend/config.js` with your credentials
4. Register a user, then in SQL Editor:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```

## Project Structure for Deployment

```
urbanshop/
├── frontend/          # Served by Vercel (static)
│   ├── index.html
│   ├── auth.html
│   ├── admin.html
│   ├── product.html
│   ├── styles.css
│   ├── app.js
│   └── config.js
├── backend/           # Deployed separately (Railway/Render)
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── supabase/
│   └── schema.sql
├── vercel.json        # Vercel config for frontend
└── package.json
```
