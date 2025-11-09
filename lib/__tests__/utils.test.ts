import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  encodeCrawlData,
  decodeCrawlData,
  isUrlLengthSafe,
  formatTime,
  buildCrawlText,
  copyToClipboard,
} from "../utils";
import type { CrawlData } from "../types";
import { URL_CONSTANTS } from "../constants";

describe("encodeCrawlData", () => {
  it("should encode valid crawl data to base64url string", () => {
    const data: CrawlData = {
      openingText: "A long time ago",
      logoText: "STAR CRAWLER",
      episodeNumber: "I",
      episodeSubtitle: "The Quest Begins",
      crawlText: "This is a test crawl text that is long enough.",
    };

    const encoded = encodeCrawlData(data);

    expect(encoded).toBeTypeOf("string");
    expect(encoded.length).toBeGreaterThan(0);
    // Base64url should not contain +, /, or = characters
    expect(encoded).not.toContain("+");
    expect(encoded).not.toContain("/");
    expect(encoded).not.toContain("=");
  });

  it("should throw error for invalid data", () => {
    const invalidData = {
      crawlText: "a".repeat(3000), // Exceeds MAX_MESSAGE_LENGTH
    } as unknown as CrawlData;

    expect(() => encodeCrawlData(invalidData)).toThrow();
  });

  it("should throw error when encoded data exceeds max length", () => {
    const data: CrawlData = {
      openingText: "A long time ago",
      logoText: "STAR CRAWLER",
      episodeNumber: "I",
      episodeSubtitle: "The Quest Begins",
      crawlText: "x".repeat(URL_CONSTANTS.MAX_ENCODED_LENGTH),
    };

    expect(() => encodeCrawlData(data)).toThrow(
      "Encoded data exceeds maximum length"
    );
  });

  it("should validate data before encoding", () => {
    const data: CrawlData = {
      openingText: "   ", // Will be trimmed and use default
      logoText: "test",
      episodeNumber: "I",
      episodeSubtitle: "Subtitle",
      crawlText: "Valid crawl text that meets minimum length requirements.",
    };

    const encoded = encodeCrawlData(data);
    const decoded = decodeCrawlData(encoded);

    expect(decoded?.openingText).toBe("A long time ago in a galaxy far, far away....");
    expect(decoded?.logoText).toBe("TEST");
  });
});

describe("decodeCrawlData", () => {
  it("should decode valid base64url string to crawl data", () => {
    const originalData: CrawlData = {
      openingText: "A long time ago",
      logoText: "STAR CRAWLER",
      episodeNumber: "I",
      episodeSubtitle: "The Quest Begins",
      crawlText: "This is a test crawl text that is long enough.",
    };

    const encoded = encodeCrawlData(originalData);
    const decoded = decodeCrawlData(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded).toEqual(originalData);
  });

  it("should return null for invalid base64 string", () => {
    const invalidEncoded = "not-valid-base64!!!";
    const decoded = decodeCrawlData(invalidEncoded);

    expect(decoded).toBeNull();
  });

  it("should return null for corrupted JSON", () => {
    // Create a valid base64 string but with invalid JSON
    const invalidJson = Buffer.from("invalid json").toString("base64url");
    const decoded = decodeCrawlData(invalidJson);

    expect(decoded).toBeNull();
  });

  it("should return null for data exceeding max length", () => {
    const longString = "x".repeat(URL_CONSTANTS.MAX_ENCODED_LENGTH + 1);
    const decoded = decodeCrawlData(longString);

    expect(decoded).toBeNull();
  });

  it("should return null for data that fails validation", () => {
    // Create encoded data with invalid structure
    const invalidData = { invalid: "data" };
    const encoded = Buffer.from(JSON.stringify(invalidData)).toString("base64url");
    const decoded = decodeCrawlData(encoded);

    expect(decoded).toBeNull();
  });
});

describe("isUrlLengthSafe", () => {
  it("should return true for URLs within limit", () => {
    const baseUrl = "https://example.com";
    const encoded = "short-encoded-string";

    expect(isUrlLengthSafe(baseUrl, encoded)).toBe(true);
  });

  it("should return false for URLs exceeding limit", () => {
    const baseUrl = "https://example.com";
    const longEncoded = "x".repeat(URL_CONSTANTS.MAX_URL_LENGTH);

    expect(isUrlLengthSafe(baseUrl, longEncoded)).toBe(false);
  });

  it("should account for query parameter prefix", () => {
    const baseUrl = "https://example.com";
    const encoded = "x".repeat(URL_CONSTANTS.MAX_URL_LENGTH - baseUrl.length - 7); // -7 for "?crawl="

    expect(isUrlLengthSafe(baseUrl, encoded)).toBe(true);
  });
});

describe("formatTime", () => {
  it("should format positive seconds correctly", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(30)).toBe("0:30");
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(90)).toBe("1:30");
    expect(formatTime(125)).toBe("2:05");
    expect(formatTime(3661)).toBe("61:01");
  });

  it("should format negative seconds correctly", () => {
    expect(formatTime(-30)).toBe("-0:30");
    expect(formatTime(-60)).toBe("-1:00");
    expect(formatTime(-125)).toBe("-2:05");
  });

  it("should handle large values", () => {
    expect(formatTime(3599)).toBe("59:59");
    expect(formatTime(3600)).toBe("60:00");
  });

  it("should pad seconds with zero", () => {
    expect(formatTime(5)).toBe("0:05");
    expect(formatTime(65)).toBe("1:05");
  });
});

describe("buildCrawlText", () => {
  it("should build complete crawl text with all fields", () => {
    const data: CrawlData = {
      openingText: "A long time ago",
      logoText: "STAR CRAWLER",
      episodeNumber: "I",
      episodeSubtitle: "The Quest Begins",
      crawlText: "This is the crawl text.",
    };

    const result = buildCrawlText(data);

    expect(result).toContain("A long time ago");
    expect(result).toContain("STAR CRAWLER");
    expect(result).toContain("EPISODE I");
    expect(result).toContain("The Quest Begins");
    expect(result).toContain("This is the crawl text.");
  });

  it("should handle missing optional fields", () => {
    const data: CrawlData = {
      openingText: "",
      logoText: "",
      episodeNumber: "",
      episodeSubtitle: "",
      crawlText: "Just crawl text.",
    };

    const result = buildCrawlText(data);

    expect(result).toBe("Just crawl text.");
  });

  it("should format episode information correctly", () => {
    const data: CrawlData = {
      openingText: "Opening",
      logoText: "Logo",
      episodeNumber: "IV",
      episodeSubtitle: "A New Hope",
      crawlText: "Crawl text.",
    };

    const result = buildCrawlText(data);

    expect(result).toContain("EPISODE IV");
    expect(result).toContain("A New Hope");
  });

  it("should handle only episode number", () => {
    const data: CrawlData = {
      openingText: "",
      logoText: "",
      episodeNumber: "V",
      episodeSubtitle: "",
      crawlText: "Crawl text.",
    };

    const result = buildCrawlText(data);

    expect(result).toContain("EPISODE V");
    expect(result).not.toContain("EPISODE V\n\n");
  });
});

describe("copyToClipboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should use modern clipboard API when available", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    const result = await copyToClipboard("test text");

    expect(result).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith("test text");
  });

  it("should fallback to execCommand when clipboard API unavailable", async () => {
    // Remove clipboard API
    Object.assign(navigator, {
      clipboard: undefined,
    });

    // Mock document.execCommand
    const mockExecCommand = vi.fn().mockReturnValue(true);
    document.execCommand = mockExecCommand;

    // Mock createElement and DOM methods
    const mockTextArea = {
      value: "",
      style: {},
      focus: vi.fn(),
      select: vi.fn(),
    };

    const mockAppendChild = vi.fn();
    const mockRemoveChild = vi.fn();
    vi.spyOn(document, "createElement").mockReturnValue(mockTextArea as unknown as HTMLElement);
    vi.spyOn(document.body, "appendChild").mockImplementation(mockAppendChild);
    vi.spyOn(document.body, "removeChild").mockImplementation(mockRemoveChild);

    const result = await copyToClipboard("fallback text");

    expect(result).toBe(true);
    expect(mockExecCommand).toHaveBeenCalledWith("copy");
  });

  it("should return false on error", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error("Clipboard error")),
      },
    });

    const result = await copyToClipboard("error text");

    expect(result).toBe(false);
  });
});

