import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["article", "video", "tweet", "image", "pdf", "document", "other"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    content: {
      type: String, // Main text/transcript
    },
    summary: { // Added for AI summarization
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    vector: { // Added for AI embeddings / semantic search
      type: [Number],
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed, // Flexible for type-specific data (e.g., YouTube video ID, OpenGraph images)
    },
  },
  { timestamps: true }
);

export const Content = mongoose.model("Content", contentSchema);
