import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CrawlData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Encodes crawl data to a URL-safe base64 string
 * Uses base64url encoding (URL-safe variant of base64)
 */
export function encodeCrawlData(data: CrawlData): string {
  try {
    const json = JSON.stringify(data);
    // Convert to base64url (URL-safe base64)
    const base64 = btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    return base64;
  } catch (error) {
    console.error("Failed to encode crawl data:", error);
    throw new Error("Failed to encode crawl data");
  }
}

/**
 * Decodes a URL-safe base64 string back to crawl data
 */
export function decodeCrawlData(encoded: string): CrawlData | null {
  try {
    // Convert base64url back to standard base64
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as CrawlData;
  } catch (error) {
    console.error("Failed to decode crawl data:", error);
    return null;
  }
}

/**
 * Copies text to clipboard with fallback support
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Formats seconds into MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.floor(Math.abs(seconds) % 60);
  const sign = seconds < 0 ? "-" : "";
  return `${sign}${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Builds full crawl text from crawl data
 */
export function buildCrawlText(crawlData: CrawlData): string {
  const textParts: string[] = [];

  if (crawlData.openingText) {
    textParts.push(crawlData.openingText);
  }

  if (crawlData.logoText) {
    textParts.push(`\n${crawlData.logoText}\n`);
  }

  if (crawlData.episodeNumber || crawlData.episodeSubtitle) {
    const episodeParts: string[] = [];
    if (crawlData.episodeNumber) {
      episodeParts.push(`EPISODE ${crawlData.episodeNumber}`);
    }
    if (crawlData.episodeSubtitle) {
      episodeParts.push(crawlData.episodeSubtitle);
    }
    if (episodeParts.length > 0) {
      textParts.push(`\n${episodeParts.join("\n")}\n`);
    }
  }

  if (crawlData.crawlText) {
    textParts.push(crawlData.crawlText);
  }

  return textParts.join("\n\n");
}
