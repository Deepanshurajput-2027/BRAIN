import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
// ... import your routes here ...

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// 1. Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// 2. Routes (Add your actual routes here)
app.get("/health", (req, res) => res.json({ status: "ok" }));

// 3. Database & Server Logic
connectDB()
  .then(() => {
    // This part only runs locally. Vercel ignores app.listen()
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
    }
  })
  .catch((err) => console.error("DB Error:", err));

// 4. CRITICAL: The Export
// Vercel needs this to handle the routing
export default app;