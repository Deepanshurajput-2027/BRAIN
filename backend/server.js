import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // ✅ ADD THIS
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRouter from "./src/routes/user.routes.js";
import contentRouter from "./src/routes/content.routes.js";
import collectionRouter from "./src/routes/collection.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser()); // ✅ ADD THIS — must be before routes

app.use(cors({
    origin: ["https://brain-second.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/collections", collectionRouter);

connectDB().catch(err => console.error("MongoDB connection error:", err));

export default app;
