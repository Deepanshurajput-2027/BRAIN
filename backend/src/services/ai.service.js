import { ApiError } from "../utils/ApiError.js";

const API_KEY = process.env.GEMINI_API_KEY;

/**
 * enrichContent
 * Uses Gemini Pro to summarize and tag content via REST.
 */
export const enrichContent = async (text) => {
  try {
    console.log("Enriching content via Google REST API...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `You are a professional research assistant. Summarize the following text in under 200 characters and provide exactly 5 highly relevant, single-word tags in lowercase. 
    Respond ONLY with a valid JSON object: {"summary": "...", "tags": ["...", ...]}.
    
    TEXT:
    ${text}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const result = await resp.json();
    if (!resp.ok) {
      throw new Error(result.error?.message || "Gemini REST failure");
    }

    const fullText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!fullText) {
      throw new Error("Empty response from Gemini");
    }

    const jsonMatch = fullText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : fullText;
    const data = JSON.parse(jsonStr);

    return {
      summary: data.summary || "No summary generated",
      tags: Array.isArray(data.tags)
        ? data.tags.map((t) => t.toLowerCase().trim()).slice(0, 5)
        : [],
    };
  } catch (error) {
    console.warn("AI Enrichment Failed, using manual fallback:", error.message);

    // Manual Fallback: Extract first 150 chars as summary and common words as tags
    const summary = text.slice(0, 150).trim() + "...";
    const words = text.toLowerCase().match(/\b(\w{5,})\b/g) || [];
    const tags = [...new Set(words)].slice(0, 5);

    return {
      summary: summary || "Manual summary",
      tags: tags.length > 0 ? tags : ["general", "captured"],
    };
  }
};

/**
 * generateEmbedding
 * Uses Gemini Embeddings to create a vector via REST.
 */
export const generateEmbedding = async (text) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    console.log("Generating 768-dim embedding via Gemini API...");

    // This URL format is the most reliable for the v1beta REST endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${API_KEY}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { parts: [{ text }] },
        taskType: "RETRIEVAL_QUERY",
        outputDimensionality: 768, // Strict requirement
      }),
    });

    let result = await resp.json();

    if (!resp.ok) {
      console.warn("Retrying with gemini-embedding-2-preview...");
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2-preview:embedContent?key=${API_KEY}`;

      const fResp = await fetch(fallbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { parts: [{ text }] },
          outputDimensionality: 768 // Strict requirement
        }),
      });

      const fResult = await fResp.json();
      if (!fResp.ok) throw new Error(fResult.error?.message || "All embedding models failed.");
      
      result = fResult;
    }

    const vector = result.embedding.values;

    // Safety Check: dimensionality match
    if (vector.length !== 768) {
      console.error(`CRITICAL: Vector dimension mismatch! Expected 768, got ${vector.length}`);
      throw new Error(`Embedding dimension mismatch: ${vector.length}`);
    }

    return vector;
  } catch (error) {
    console.error("CRITICAL: Embedding Failed ->", error.message);
    // Returning a 768-length zero-vector to prevent MongoDB crash
    return new Array(768).fill(0);
  }
};