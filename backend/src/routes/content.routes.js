import { Router } from "express";
import {
  addContent,
  getAllContent,
  deleteContent,
  searchContent,
  getRelated,
  getResurfacedContent,
  getTopTags,
  getGraph,
  getHighlightsByUrl,
  getStats
} from "../controllers/content.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply auth middleware to all routes in this file
router.use(verifyJWT);

// ── Protected Routes ──────────────────────────────────────────────────────────
router.get("/graph", getGraph);
router.get("/resurface", getResurfacedContent);
router.get("/highlights", getHighlightsByUrl);
router.get("/stats", getStats);
router.get("/tags", getTopTags);
router.get("/related/:id", getRelated);
router.get("/search", searchContent);
router.get("/", getAllContent);
router.post("/", addContent);
router.delete("/:id", deleteContent);

export default router;
