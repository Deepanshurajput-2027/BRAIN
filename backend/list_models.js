import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Testing gemini-1.5-flash...");
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash!");
  } catch (err) {
    console.error("Failed gemini-1.5-flash:", err.message);
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Testing gemini-pro...");
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-pro!");
    } catch (err2) {
        console.error("Failed gemini-pro:", err2.message);
    }
  }
}

listModels();
