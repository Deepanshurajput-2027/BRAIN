import { Content } from "../models/content.model.js";
import { Collection } from "../models/collection.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { scrapeUrl } from "../services/scraper.service.js";
import { enrichContent, generateEmbedding } from "../services/ai.service.js";
import { findRelatedContent, fetchGraphData } from "../services/graph.service.js";

// ── Add Content ──────────────────────────────────────────────────────────────
export const addContent = asyncHandler(async (req, res) => {
  const { link, tags = [], title: manualTitle, text: manualText, metadata: manualMetadata } = req.body;
  const userId = req.user._id;

  if (!link) {
    throw new ApiError(400, "Link is required");
  }

  // Normalize link (ensure protocol)
  let normalizedLink = link.trim();
  if (!normalizedLink.startsWith('http')) {
    normalizedLink = `https://${normalizedLink}`;
  }

  // 1. Scrape metadata
  const scrapedData = await scrapeUrl(normalizedLink);

  // 2. AI Enrichment (Gemini)
  // If we have manual text (highlight), use that for enrichment instead of the whole page description
  const contentToEnrich = manualText 
    ? `HIGHLIGHT: ${manualText}\n\nPAGE: ${scrapedData.title}`
    : `${scrapedData.title}\n\n${scrapedData.description || ""}`;
    
  const aiResult = await enrichContent(contentToEnrich);

  // 3. Generate Embedding (Vector Search)
  const vectorStr = manualText ? `${manualText} ${scrapedData.title}` : `${scrapedData.title} ${aiResult.summary}`;
  const vector = await generateEmbedding(vectorStr);
  console.log(`[AUDIT] Add Content - Vector Length: ${vector.length}`);

  // 4. Save to DB
  const content = await Content.create({
    link: normalizedLink,
    title: manualTitle || scrapedData.title,
    description: manualText || aiResult.summary || scrapedData.description,
    type: manualMetadata?.isHighlight ? "article" : scrapedData.type, // Treat highlights as articles for now
    tags: [...new Set([...tags, ...aiResult.tags, ...(manualMetadata?.isHighlight ? ["highlight"] : [])])],
    vector,
    content: manualText,
    metadata: { ...scrapedData.metadata, ...manualMetadata },
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, content, "Content added and enriched successfully"));
});

// ── Get All Content ───────────────────────────────────────────────────────────
export const getAllContent = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const content = await Content.find({ owner: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .select("-vector");

  const total = await Content.countDocuments({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, {
      items: content,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    }, "Content fetched successfully"));
});

// ── Delete Content ────────────────────────────────────────────────────────────
export const deleteContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const content = await Content.findOneAndDelete({ _id: id, owner: userId });

  if (!content) {
    throw new ApiError(404, "Content not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Content deleted successfully"));
});

// ── Search Content (Semantic) ─────────────────────────────────────────────────
export const searchContent = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const userId = req.user._id;

  if (!q) {
    throw new ApiError(400, "Search query is required");
  }

  // Generate embedding for the query
  const queryVector = await generateEmbedding(q);
  console.log(`[AUDIT] Search Content - Query Vector Length: ${queryVector.length}`);

  // MongoDB Vector Search Pipeline
  const results = await Content.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "vector",
        queryVector: queryVector,
        numCandidates: 100,
        limit: 10,
        filter: { owner: userId }
      }
    },
    {
      $project: {
        vector: 0,
        score: { $meta: "vectorSearchScore" }
      }
    }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Search results fetched successfully"));
});

// ── Get Related Content ───────────────────────────────────────────────────────
export const getRelated = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const related = await findRelatedContent(id, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, related, "Related content fetched successfully"));
});

// ── Get Graph Data ────────────────────────────────────────────────────────────
export const getGraph = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const graphData = await fetchGraphData(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, graphData, "Graph data fetched successfully"));
});

// ── Get Resurfaced Content ────────────────────────────────────────────────────
export const getResurfacedContent = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const now = new Date();
  const intervals = [7, 30, 90]; // days ago
  
  const dates = intervals.map(days => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return {
      start: new Date(d.setHours(0, 0, 0, 0)),
      end: new Date(d.setHours(23, 59, 59, 999))
    };
  });

  const anniversaryItems = await Content.find({
    owner: userId,
    $or: dates.map(range => ({
      createdAt: { $gte: range.start, $lte: range.end }
    }))
  }).limit(10);

  let finalItems = [...anniversaryItems];

  if (finalItems.length < 3) {
    const randomItems = await Content.aggregate([
      { $match: { owner: userId } },
      { $sample: { size: 5 } },
      { $project: { vector: 0 } }
    ]);
    
    const existingIds = new Set(finalItems.map(i => i._id.toString()));
    for (const item of randomItems) {
      if (!existingIds.has(item._id.toString()) && finalItems.length < 10) {
        finalItems.push(item);
      }
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, finalItems, "Resurfaced content fetched successfully"));
});

// ── Get Top Tags ──────────────────────────────────────────────────────────────
export const getTopTags = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const tags = await Content.aggregate([
    { $match: { owner: userId } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 15 }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, tags, "Top tags fetched successfully"));
});

// ── Get Highlights By URL ───────────────────────────────────────────────────
export const getHighlightsByUrl = asyncHandler(async (req, res) => {
  const { url } = req.query;
  const userId = req.user._id;

  if (!url) {
    throw new ApiError(400, "URL is required");
  }

  // Normalize url
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  const highlights = await Content.find({
    owner: userId,
    link: normalizedUrl,
    "metadata.isHighlight": true
  }).select("content metadata tags");

  return res
    .status(200)
    .json(new ApiResponse(200, highlights, "Highlights fetched successfully"));
});

// ── Get Stats ────────────────────────────────────────────────────────────────
export const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalContent, totalCollections, totalHighlights] = await Promise.all([
    Content.countDocuments({ owner: userId }),
    Collection.countDocuments({ owner: userId }),
    Content.countDocuments({ owner: userId, "metadata.isHighlight": true })
  ]);

  // Also get a few recent searches if we tracked them, otherwise mock for now
  const totalSearches = 42; 

  return res
    .status(200)
    .json(new ApiResponse(200, {
      totalContent,
      totalCollections,
      totalHighlights,
      totalSearches
    }, "Stats fetched successfully"));
});
