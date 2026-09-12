# Urbanshop

A completely redesigned, Amazon-like eCommerce frontend built with Vanilla HTML, CSS, and JavaScript. No React, no Vite, no Node.js environment headaches! It communicates directly with a FastAPI backend and optionally Supabase for authentication and database management.

## Quick Run

### 1. Backend (FastAPI)
The backend is built with Python and FastAPI.

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```
3. Activate the virtual environment:
   - **Windows:**
     ```powershell
     .venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source .venv/bin/activate
     ```
4. Install the requirements:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the server:
   ```bash
   python main.py
   ```
The API will run at `http://localhost:8000`. You can view the docs at `http://localhost:8000/docs`.

### 2. Frontend (Vanilla HTML/CSS/JS)
The frontend doesn't require any Node/NPM installation!

1. Go to the `frontend` directory.
2. Simply open `index.html` in your web browser.
3. Alternatively, for the best experience (to avoid CORS/file protocol issues), you can run a quick python server inside the `frontend` directory:
   ```bash
   cd frontend
   python -m http.server 8080
   ```
   Then open `http://localhost:8080` in your browser.

## Configuration & Supabase Setup (Optional but recommended)
By default, the application runs using the local FastAPI server data. To enable real user accounts, wishlist persistence, and the admin panel, you should link it to Supabase.

1. Create a free project at [Supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, paste and run the entire `supabase/schema.sql` file. This sets up the database schema and storage.
3. Open `frontend/config.js` in a text editor.
4. Replace the placeholder values with your Supabase credentials:
   ```javascript
   const CONFIG = {
       API_URL: "http://localhost:8000/api",
       SUPABASE_URL: "https://your-project-id.supabase.co",
       SUPABASE_ANON_KEY: "your-anon-key"
   };
   ```
5. Open `index.html` in your browser.

## Features Included
- **Professional UI**: Mobile-first, user-friendly, Amazon-like design.
- **Advertisement Panel**: Beautiful ad section for discounted items on the home page.
- **Product Browsing**: Clean grid layout for products.
- **Wishlist**: Save items locally.
- **Authentication**: Sign up and Sign in handled securely via Supabase.
- **Admin Panel**: Secure dashboard to manage products.

## Deployment

### Deploy Frontend to Vercel
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

### Deploy Backend to Railway/Render
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.
