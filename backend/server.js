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
    origin: "https://brain-second.vercel.app", // Hardcoded for now to fix the error immediately
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// 2. MOUNT ROUTES
// This ensures that when frontend calls /api/v1/users/login, it works!
app.use("/api/v1/users", userRouter);

// 3. HEALTH CHECK (To test if backend is live)
app.get("/", (req, res) => {
    res.json({ message: "Backend is running! 🚀" });
});

// 4. DATABASE CONNECTION
connectDB().catch(err => console.error("MongoDB connection error:", err));

// 5. EXPORT FOR VERCEL (Most Important)
export default app;