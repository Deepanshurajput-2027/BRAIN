import mongoose from "mongoose";
import dotenv from "dotenv";
import { Content } from "./src/models/content.model.js";

dotenv.config();

const cleanup = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB for cleanup...");
    
    const result = await Content.deleteMany({});
    console.log(`\n🧹 Database Cleanup Complete:`);
    console.log(`- Successfully deleted ${result.deletedCount} documents from the 'contents' collection.`);
    console.log(`- Reason: Clearing legacy 3072-dimension vectors to prevent PlanExecutor errors.\n`);
    
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error.message);
    process.exit(1);
  }
};

cleanup();
