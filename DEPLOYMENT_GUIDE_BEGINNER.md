# 🚀 The Ultimate Deployment Guide: From Local to Live

This guide will walk you through the entire process of putting your "Second Brain" on the internet so you and others can use it from anywhere.

---

## Step 1: Push your code to GitHub
Vercel (the hosting service) works best when your code is on GitHub.
1.  Go to [github.com](https://github.com) and create a new **Private Repository** named `BRAIN`.
2.  In your terminal (inside the `BRAIN` folder), run these commands:
    ```powershell
    git init
    git add .
    git commit -m "Initial commit: Secure & Production Ready"
    git branch -M main
    git remote add origin YOUR_GITHUB_REPO_URL
    git push -u origin main
    ```
    *(Note: We already set up `.gitignore`, so your personal secrets in `.env` will **not** be uploaded to GitHub.)*

---

## Step 2: Get your Production "Ingredients" (Secrets)
You need "Production" versions of your keys. Here is how to get them:

### 1. Database (MongoDB Atlas)
*   Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
*   Create a **Free Cluster**.
*   Click **Connect** -> **Drivers** -> Copy the connection string.
*   It will look like: `mongodb+srv://user:password@cluster.mongodb.net/BRAIN?retryWrites=true&w=majority`
*   **Important**: Replace `password` with the database user password you created.
*   **Networking (CRITICAL)**: Go to **Network Access** in MongoDB Atlas. Click **"Add IP Address"** and choose **"Allow Access from Anywhere"** (`0.0.0.0/0`). Vercel needs this to connect.

### 2. AI Brain (Gemini API)
*   Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
*   Click **Create API Key**.
*   Copy the key (starts with `AIzaSy...`).

### 3. Emails (Resend - Recommended)
*   Go to [Resend.com](https://resend.com) (Free and easiest for beginners).
*   Go to **API Keys** -> Create one.
*   Go to **Settings** -> **SMTP**.
*   Copy these values:
    *   `SMTP_HOST`: `smtp.resend.com`
    *   `SMTP_PORT`: `465` (or 587)
    *   `SMTP_USER`: `resend`
    *   `SMTP_PASS`: Your API Key

---

## Step 3: Deploy to Vercel (The Easy Way)

We are going to use a **"Unified Deployment"**. This means we merge the Frontend into the Backend so you only have **one** link and **zero** CORS issues.

### 1. Merge the Frontend
You can do this automatically or manually:

**Option A: Automate it (Recommended)**
Run this in your terminal:
```powershell
./build-prod.ps1
```

**Option B: Manual way (Copy & Paste)**
1.  Go into your **`frontend`** folder and run `npm run build`.
2.  You will see a new **`dist`** folder appear. Copy everything inside it.
3.  Go to your **`backend`** folder. Create a folder named **`public`** (if it doesn't exist).
4.  Paste everything you copied into the **`backend/public`** folder.

### 2. Vercel Settings (CRITICAL)
When you add the project to Vercel, make sure these are set:
1.  **Root Directory**: Set this to **`backend`**.
2.  **Framework Preset**: Change this to **`Other`** (Do NOT use Vite).
3.  **Build Command**: Leave it **Empty** (Vercel will run your `server.js` automatically).
4.  **Output Directory**: Leave it **Empty**.
5.  **Rewrites**: I have already added a `vercel.json` file that handles this for you.

---

## Step 4: Done! 🎉
That's it! Your site will now be live at the URL Vercel gives you. Because we merged them, you don't have to worry about complex "handshakes" between URLs.

---

### 🛡️ Why are we doing this?
*   **Security**: Your keys stay hidden in Vercel's encrypted vault.
*   **Uptime**: Your app will run 24/7 without your computer being on.
*   **Professionalism**: You get a real link you can use on your phone or share with others.

**If any step fails, just paste the error here and I will fix it for you!**
