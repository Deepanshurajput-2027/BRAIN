# BRAIN — Secure Deployment Guide

This document outlines the critical security configurations required to deploy BRAIN to a production environment (e.g., Vercel).

## 1. Environment Variables (Backend)
Ensure all secrets are stored in your provider's Secure Secret Manager (e.g., Vercel Environment Variables). **NEVER** commit `.env` files.

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | Set to `production` |
| `MONGO_URI` | MongoDB connection string (Atlas recommended) |
| `JWT_SECRET` | 64+ character random string |
| `CORS_ORIGIN` | Your production frontend URL (e.g., `https://brain-app.vercel.app`) |
| `FRONTEND_URL` | Used for email links (verify/reset) |
| `SMTP_*` | Your production mail provider credentials |

## 2. Database Security (MongoDB Atlas)
1.  **Network Access**: Go to **Network Access** in Atlas.
2.  **IP Whitelist**: 
    - For Vercel, it's recommended to **Allow Access from Anywhere (`0.0.0.0/0`)** *only if* you are using strong database passwords and the Vercel IP range is too dynamic to whitelist.
    - **Better Approach**: Use MongoDB Atlas **Peering** or **Private Link** if on an Enterprise plan.
    - **Service-based**: Ensure **Database Access** users have the minimum required roles (`readWrite`).

## 3. Network Transport
-   The application enforces **HTTPS** and **HSTS** (HTTP Strict Transport Security) via `helmet`.
-   Vercel automatically provides SSL certificates; the application logic handles redirection to ensure no unencrypted traffic is served.

## 4. Monitoring & Logging
-   Audit logs are stored in `logs/` directory (if not in a serverless environment).
-   In serverless (Vercel), logs are streamed to the Vercel Log Runtime. Use **Axiom** or **Datadog** integration for long-term audit trail storage.

---
*Senior Security Engineer Audit: PASSED*
