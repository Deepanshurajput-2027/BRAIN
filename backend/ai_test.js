import dotenv from "dotenv";
dotenv.config();
import { enrichContent, generateEmbedding } from "./src/services/ai.service.js";

async function testFullAI() {
  console.log("--- Testing AI Enrichment ---");
  try {
    const enrichResult = await enrichContent("Rick Astley - Never Gonna Give You Up (Official Music Video)");
    console.log("Enrichment Success:", enrichResult);
  } catch (error) {
    console.error("Enrichment Failed:", error.message);
  }

  console.log("\n--- Testing AI Embedding ---");
  try {
    const vector = await generateEmbedding("Never gonna give you up, never gonna let you down");
    console.log("Embedding Success!");
    console.log("Vector length:", vector?.length);
    console.log("First 5 values:", vector?.slice(0, 5));
  } catch (error) {
    console.error("Embedding Failed:", error.message);
  }
}

testFullAI();
