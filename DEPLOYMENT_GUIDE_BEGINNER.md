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

## Step 3: Deploy to Vercel
1.  Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2.  Click **"Add New"** -> **"Project"**.
3.  Import your `BRAIN` repository.
4.  **The Most Important Part**: Click the **Environment Variables** dropdown.
5.  Add **ALL** the variables from your `.env.example` file.
    *   *Example*: Name: `MONGO_URI`, Value: `(Your Atlas Link)`
6.  Click **Deploy**.

---

## Step 4: Final Link-Up
Once Vercel gives you a URL (e.g., `https://my-brain.vercel.app`):
1.  Add that URL to your Vercel Environment Variables as `FRONTEND_URL` and `CORS_ORIGIN`.
2.  Update `VITE_API_URL` to point to your backend (e.g., `https://my-brain.vercel.app/api/v1`).
3.  **Redeploy** one last time.

---

### 🛡️ Why are we doing this?
*   **Security**: Your keys stay hidden in Vercel's encrypted vault.
*   **Uptime**: Your app will run 24/7 without your computer being on.
*   **Professionalism**: You get a real link you can use on your phone or share with others.

**If any step fails, just paste the error here and I will fix it for you!**
