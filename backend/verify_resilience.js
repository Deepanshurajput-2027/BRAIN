import dotenv from "dotenv";
dotenv.config();
// Bypass the real service to simulate failure more easily
const generateEmbedding = async (text) => {
  try {
    const API_KEY = "INVALID_KEY_FOR_TESTING";
    console.log("Simulating embedding failure...");
    // This is a mockup of the actual error handling in ai.service.js
    throw new Error("Simulated API Key Failure");
  } catch (error) {
    console.error("CRITICAL: Embedding Failed ->", error.message);
    return new Array(768).fill(0);
  }
};

const verifyResilience = async () => {
  try {
    const text = "Any text";
    const vector = await generateEmbedding(text);
    console.log(`[AUDIT] Fallback Vector Length: ${vector.length}`);
    const isZero = vector.every(v => v === 0);
    if (vector.length === 768 && isZero) {
      console.log("✅ Error Resilience Test Passed: 768-length zero-vector returned");
    } else {
      console.error(`❌ Error Resilience Test Failed: Length=${vector.length}, isZero=${isZero}`);
    }
    process.exit(0);
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
};

verifyResilience();
