import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Scrapes metadata (OpenGraph tags, standard meta tags, title) from a given URL.
 * Automatically determines the fundamental content "type" (video, tweet, article).
 *
 * @param {string} url
 * @returns {Promise<{
 *   title: string;
 *   description?: string;
 *   type: string;
 *   metadata: Record<string, any>;
 * }>}
 */
export const scrapeUrl = async (url) => {
  try {
    const normalizedUrl = url.trim().toLowerCase();
    
    // 1. Direct File Type Detection (Bypass standard scraping for binary/static files)
    if (normalizedUrl.endsWith(".pdf")) {
      return {
        title: url.split("/").pop() || "PDF Document",
        type: "pdf",
        metadata: { isDirectFile: true, extension: "pdf" },
      };
    }

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    if (imageExtensions.some(ext => normalizedUrl.endsWith(ext))) {
      return {
        title: url.split("/").pop() || "Image Content",
        type: "image",
        metadata: { isDirectFile: true, extension: normalizedUrl.split(".").pop(), image: url },
      };
    }

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 8000,
    });

    const $ = cheerio.load(html);

    // Extraction Strategy: OpenGraph -> Standard Meta -> Document Fallback
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "Untitled Content";

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content");

    const image = $('meta[property="og:image"]').attr("content");

    // Default basic type detection based on hostname matching
    let type = "article";
    const urlHostname = new URL(url).hostname.toLowerCase();

    const metadata = {};
    if (image) metadata.image = image;

    if (
      urlHostname.includes("youtube.com") ||
      urlHostname.includes("youtu.be")
    ) {
      type = "video";
      const videoIdMatch = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      );
      if (videoIdMatch) {
        metadata.youtubeId = videoIdMatch[1];
      }
    } else if (urlHostname.includes("twitter.com") || urlHostname.includes("x.com")) {
      type = "tweet";
      // Better default title for tweets if scraping fails
      if (title === "Untitled Content" || title === url) {
        const tweetId = url.split("/").pop();
        return {
          title: `Tweet by @${url.split("/")[3]}`,
          type,
          metadata: { ...metadata, tweetId },
        };
      }
    }

    return {
      title: title.trim(),
      description: description?.trim(),
      type,
      metadata,
    };
  } catch (error) {
    // If we can't scrape, return a minimal fallback payload
    // rather than rejecting entirely so the user can still save the link manually.
    console.error(`Scrape failed for ${url}:`, error.message);
    return {
      title: url,
      type: "other",
      metadata: { error: "Failed to scrape metadata" },
    };
  }
};
