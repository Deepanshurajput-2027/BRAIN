import dotenv from "dotenv";
dotenv.config();
import { generateEmbedding } from "./src/services/ai.service.js";

const verify = async () => {
  try {
    const text = "Humor and Funny content";
    console.log(`Testing embedding for: "${text}"`);
    const vector = await generateEmbedding(text);
    console.log(`[AUDIT] Vector Length: ${vector.length}`);
    if (vector.length === 768) {
      console.log("✅ Dimensionality Test Passed: 768");
    } else {
      console.error(`❌ Dimensionality Test Failed: ${vector.length}`);
    }
    process.exit(0);
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
};

verify();
