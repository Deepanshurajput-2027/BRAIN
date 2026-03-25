import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRouter from "./src/routes/user.routes.js"; // Ensure this path is correct

dotenv.config();

const app = express();

// 1. MIDDLEWARES (Must come before routes)
app.use(express.json());
app.use(cors({
    origin: ["https://brain-second.vercel.app", "http://localhost:5173"], // Add your exact frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
// 2. MOUNT ROUTES
// This ensures that when frontend calls /api/v1/users/login, it works!
app.use("/api/v1/users", userRouter);

// 4. DATABASE CONNECTION
connectDB().catch(err => console.error("MongoDB connection error:", err));

// 5. EXPORT FOR VERCEL (Most Important)
export default app;