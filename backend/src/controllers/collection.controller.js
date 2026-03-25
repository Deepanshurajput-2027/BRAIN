import { Collection } from "../models/collection.model.js";
import { Content } from "../models/content.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ── Create Collection ────────────────────────────────────────────────────────
export const createCollection = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id;

  if (!title) {
    throw new ApiError(400, "Collection title is required");
  }

  const collection = await Collection.create({
    title,
    description,
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, collection, "Collection created successfully"));
});

// ── Get All Collections ───────────────────────────────────────────────────────
export const getCollections = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const collections = await Collection.find({ owner: userId }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, collections, "Collections fetched successfully"));
});

// ── Add Content to Collection ────────────────────────────────────────────────
export const addContentToCollection = asyncHandler(async (req, res) => {
  const { collectionId, contentId } = req.body;
  const userId = req.user._id;

  const collection = await Collection.findOne({ _id: collectionId, owner: userId });
  if (!collection) throw new ApiError(404, "Collection not found");

  const content = await Content.findOne({ _id: contentId, owner: userId });
  if (!content) throw new ApiError(404, "Content not found");

  if (collection.items.includes(contentId)) {
    return res.status(200).json(new ApiResponse(200, collection, "Content already in collection"));
  }

  collection.items.push(contentId);
  await collection.save();

  return res
    .status(200)
    .json(new ApiResponse(200, collection, "Content added to collection successfully"));
});

// ── Remove Content from Collection ───────────────────────────────────────────
export const removeContentFromCollection = asyncHandler(async (req, res) => {
  const { collectionId, contentId } = req.body;
  const userId = req.user._id;

  const collection = await Collection.findOne({ _id: collectionId, owner: userId });
  if (!collection) throw new ApiError(404, "Collection not found");

  collection.items = collection.items.filter(id => id.toString() !== contentId);
  await collection.save();

  return res
    .status(200)
    .json(new ApiResponse(200, collection, "Content removed from collection successfully"));
});

// ── Get Collection with Items ────────────────────────────────────────────────
export const getCollectionDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const collection = await Collection.findOne({ _id: id, owner: userId }).populate("items");
  if (!collection) throw new ApiError(404, "Collection not found");

  return res
    .status(200)
    .json(new ApiResponse(200, collection, "Collection details fetched successfully"));
});

// ── Delete Collection ─────────────────────────────────────────────────────────
export const deleteCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const collection = await Collection.findOneAndDelete({ _id: id, owner: userId });
  if (!collection) throw new ApiError(404, "Collection not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Collection deleted successfully"));
});
