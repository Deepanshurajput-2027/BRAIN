import { Router } from "express";
import {
  createCollection,
  getCollections,
  addContentToCollection,
  removeContentFromCollection,
  getCollectionDetails,
  deleteCollection,
} from "../controllers/collection.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createCollection);
router.get("/", getCollections);
router.get("/:id", getCollectionDetails);
router.delete("/:id", deleteCollection);
router.post("/add-content", addContentToCollection);
router.post("/remove-content", removeContentFromCollection);

export default router;
