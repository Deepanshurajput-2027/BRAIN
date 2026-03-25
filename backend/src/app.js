import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

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
