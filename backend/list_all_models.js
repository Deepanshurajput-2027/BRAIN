import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAllModels() {
  try {
    // There is no direct listModels in the SDK sometimes depending on version, 
    // but we can try the REST approach or just try common ones.
    // However, the curl command showed some models.
    console.log("Fetching models via REST to be sure...");
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await resp.json();
    if (data.models) {
        console.log("Available Models:");
        data.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
    } else {
        console.log("No models found or error:", data);
    }
  } catch (err) {
    console.error("Error listing models:", err.message);
  }
}

listAllModels();
