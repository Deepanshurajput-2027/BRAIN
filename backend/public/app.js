import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "../src/middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.CORS_ORIGIN,
        "http://localhost:5173",
        "http://localhost:5174",
      ].filter(Boolean);

      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 200,
  })
);

app.use(morgan("dev"));

// ── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


// ── Cookie Parser ─────────────────────────────────────────────────────────────
app.use(cookieParser());

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Shared cookie options ─────────────────────────────────────────────────────
// (Moved up for accessibility if needed, but keeping it simple for now)

// ── Routes ────────────────────────────────────────────────────────────────────
import userRoutes from "../src/routes/user.routes.js";
import contentRoutes from "../src/routes/content.routes.js";
import collectionRoutes from "../src/routes/collection.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/collections", collectionRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is up and running 🚀" });
});


// ── Global Error Middleware (MUST be last) ────────────────────────────────────
app.use(errorMiddleware);

export default app;
