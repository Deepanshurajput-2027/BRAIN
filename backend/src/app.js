import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Relaxed for dev: limit each IP to 20 requests per hour
  message: "Too many authentication attempts, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Security & Logging ──────────────────────────────────────────────────────
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN, "http://localhost:5173", "http://localhost:5174"].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 200
  })
);

// ── Security Headers (HSTS, etc.) ──────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for local dev compatibility
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// ── HTTPS Redirection (Production Only) ──────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

app.use(limiter);
app.use("/api/v1/users", authLimiter);
app.use(morgan("dev"));

// ── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ── Static Files ─────────────────────────────────────────────────────────────
app.use(express.static("public"));

// ── Cookie Parser ─────────────────────────────────────────────────────────────
app.use(cookieParser());

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Shared cookie options ─────────────────────────────────────────────────────
// (Moved up for accessibility if needed, but keeping it simple for now)

// ── Routes ────────────────────────────────────────────────────────────────────
import userRoutes from "./routes/user.routes.js";
import contentRoutes from "./routes/content.routes.js";
import collectionRoutes from "./routes/collection.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/collections", collectionRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is up and running 🚀" });
});

// ── Serve Frontend for all other routes (SPA Support) ─────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ── Global Error Middleware (MUST be last) ────────────────────────────────────
app.use(errorMiddleware);

export default app;
