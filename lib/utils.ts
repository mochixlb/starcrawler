import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { fromString, toString } from "@hexagon/base64";
import type { CrawlData } from "./types";
import { validateCrawlData } from "./validation";
import { URL_CONSTANTS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Encodes crawl data to a URL-safe base64 string
 * Uses base64url encoding (URL-safe variant of base64)
 * Validates data before encoding
 */
export function encodeCrawlData(data: CrawlData): string {
  // Validate data before encoding
  const validation = validateCrawlData(data);
  if (!validation.success) {
    throw new Error(validation.error);
  }

  try {
    const json = JSON.stringify(validation.data);
    // Encode to base64url using RFC 4648 compliant library
    const encoded = fromString(json, true);

    // Check encoded length
    if (encoded.length > URL_CONSTANTS.MAX_ENCODED_LENGTH) {
      throw new Error(
        `Encoded data exceeds maximum length of ${URL_CONSTANTS.MAX_ENCODED_LENGTH} bytes`
      );
    }

    return encoded;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to encode crawl data");
  }
}

/**
 * Decodes a URL-safe base64 string back to crawl data
 * Validates structure, size, and content using Zod schema
 */
export function decodeCrawlData(encoded: string): CrawlData | null {
  // Check encoded parameter length
  if (encoded.length > URL_CONSTANTS.MAX_ENCODED_LENGTH) {
    return null;
  }

  try {
    // Decode base64url using RFC 4648 compliant library
    const json = toString(encoded, true);
    const parsed = JSON.parse(json);

    // Validate structure and content using Zod schema
    const validation = validateCrawlData(parsed);
    if (!validation.success) {
      return null;
    }

    return validation.data;
  } catch {
    return null;
  }
}

/**
 * Gets the base URL for the current page
 * Returns empty string if window is not available (SSR)
 */
export function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return `${window.location.origin}${window.location.pathname}`;
}

/**
 * Checks if a URL would exceed browser limits
 * Returns true if URL is safe, false if it would be too long
 */
export function isUrlLengthSafe(baseUrl: string, encoded: string): boolean {
  const fullUrl = `${baseUrl}?crawl=${encoded}`;
  return fullUrl.length <= URL_CONSTANTS.MAX_URL_LENGTH;
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
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

/**
 * Computes the next seek progress based on a time delta and the known total duration.
 * - Returns current progress if total duration is not available (<= 0)
 * - Clamps result to [0, 1]
 */
export function computeSeekProgress(
  currentProgress: number,
  elapsedSeconds: number,
  remainingSeconds: number,
  deltaSeconds: number
): number {
  const total = elapsedSeconds + remainingSeconds;
  if (!(total > 0) || !Number.isFinite(total)) {
    return currentProgress;
  }
  const deltaProgress = deltaSeconds / total;
  const next = currentProgress + deltaProgress;
  return Math.max(0, Math.min(1, next));
}
