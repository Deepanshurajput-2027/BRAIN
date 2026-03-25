import { Content } from "../models/content.model.js";

/**
 * findRelatedContent
 * @param {string} contentId - ID of the source content
 * @param {string} userId - Owner restricted
 * @returns {Array} - Top 6 semantically similar items
 */
export const findRelatedContent = async (contentId, userId) => {
  const sourceContent = await Content.findOne({ _id: contentId, owner: userId });
  
  if (!sourceContent || !sourceContent.vector || sourceContent.vector.length === 0) {
    return [];
  }

  const pipeline = [
    {
      $vectorSearch: {
        index: "vector_index",
        path: "vector",
        queryVector: sourceContent.vector,
        numCandidates: 100,
        limit: 7, // 6 related + 1 for self
        filter: { owner: userId },
      },
    },
    {
      $match: {
        _id: { $ne: sourceContent._id }, // Exclude self
      },
    },
    {
      $limit: 6,
    },
    {
      $project: {
        vector: 0,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ];

  return await Content.aggregate(pipeline);
};

/**
 * getGraphData
 * @param {string} userId
 * @returns {Object} - { nodes, links } for d3.js
 */
export const fetchGraphData = async (userId) => {
  // Fetch last 30 items
  const items = await Content.find({ 
    owner: userId, 
    vector: { $exists: true, $not: { $size: 0 } } 
  })
    .sort({ createdAt: -1 })
    .limit(30)
    .select("title type tags vector link summary");

  const nodes = items.map((item) => ({
    id: item._id.toString(),
    title: item.title,
    type: item.type,
    tags: item.tags,
    link: item.link,
    summary: item.summary,
  }));

  const links = [];

  // Construct links based on cosine similarity or simple overlap
  // For a "Real Developer" move, we'll use a basic vector distance approach in JS 
  // since we only have 30 nodes (O(N^2) = 900 calcs is fine here).
  
  const cosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const similarity = cosineSimilarity(items[i].vector, items[j].vector);
      
      // Only create link if similarity > 0.82 (threshold for "related")
      if (similarity > 0.82) {
        links.push({
          source: items[i]._id.toString(),
          target: items[j]._id.toString(),
          value: similarity,
        });
      }
    }
  }

  // ── Topic Clustering (Greedy Connected Components) ─────────────────────────
  const clusters = {};
  let clusterId = 1;
  const visited = new Set();

  const getNeighbors = (id) => links
    .filter(l => l.source === id || l.target === id)
    .map(l => l.source === id ? l.target : l.source);

  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      const stack = [node.id];
      const currentCluster = clusterId++;
      
      while (stack.length > 0) {
        const currentId = stack.pop();
        if (!visited.has(currentId)) {
          visited.add(currentId);
          clusters[currentId] = currentCluster;
          stack.push(...getNeighbors(currentId));
        }
      }
    }
  });

  // Assign cluster to nodes
  const nodesWithClusters = nodes.map(node => ({
    ...node,
    cluster: clusters[node.id] || 0
  }));

  return { nodes: nodesWithClusters, links };
};
