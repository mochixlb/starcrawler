import { describe, it, expect } from "vitest";
import { validateCrawlData, crawlDataSchema } from "../validation";
import type { CrawlData } from "../types";
import { FORM_CONSTANTS } from "../constants";

describe("validateCrawlData", () => {
  describe("valid data", () => {
    it("should validate and transform valid crawl data", () => {
      const data: CrawlData = {
        openingText: "A long time ago",
        logoText: "STAR CRAWLER",
        episodeNumber: "I",
        episodeSubtitle: "The Quest Begins",
        crawlText: "This is a valid crawl text that meets the minimum length requirement.",
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.openingText).toBe("A long time ago");
        expect(result.data.logoText).toBe("STAR CRAWLER");
        expect(result.data.episodeNumber).toBe("I");
        expect(result.data.episodeSubtitle).toBe("The Quest Begins");
        expect(result.data.crawlText).toBe(
          "This is a valid crawl text that meets the minimum length requirement."
        );
      }
    });

    it("should apply default values for empty strings", () => {
      const data: CrawlData = {
        openingText: "   ",
        logoText: "",
        episodeNumber: "I",
        episodeSubtitle: "Subtitle",
        crawlText: "Valid crawl text that meets minimum length requirements.",
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.openingText).toBe("A long time ago in a galaxy far, far away....");
        expect(result.data.logoText).toBe("STAR CRAWLER");
      }
    });

    it("should transform logo text to uppercase", () => {
      const data: CrawlData = {
        openingText: "Opening",
        logoText: "lowercase logo",
        episodeNumber: "I",
        episodeSubtitle: "Subtitle",
        crawlText: "Valid crawl text that meets minimum length requirements.",
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.logoText).toBe("LOWERCASE LOGO");
      }
    });

    it("should transform episode fields to uppercase", () => {
      const data: CrawlData = {
        openingText: "Opening",
        logoText: "Logo",
        episodeNumber: "iv",
        episodeSubtitle: "a new hope",
        crawlText: "Valid crawl text that meets minimum length requirements.",
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.episodeNumber).toBe("IV");
        expect(result.data.episodeSubtitle).toBe("A NEW HOPE");
      }
    });

    it("should trim whitespace from all fields", () => {
      const data: CrawlData = {
        openingText: "  Trimmed  ",
        logoText: "  Logo  ",
        episodeNumber: "  I  ",
        episodeSubtitle: "  Subtitle  ",
        crawlText: "  Valid crawl text that meets minimum length requirements.  ",
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.openingText).toBe("Trimmed");
        expect(result.data.logoText).toBe("LOGO");
        expect(result.data.episodeNumber).toBe("I");
        expect(result.data.episodeSubtitle).toBe("SUBTITLE");
        expect(result.data.crawlText).toBe(
          "Valid crawl text that meets minimum length requirements."
        );
      }
    });
  });

  describe("invalid data", () => {
    it("should reject crawl text below minimum length", () => {
      const data: CrawlData = {
        openingText: "Opening",
        logoText: "Logo",
        episodeNumber: "I",
        episodeSubtitle: "Subtitle",
        crawlText: "Short", // Too short
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("at least");
      }
    });

    it("should reject crawl text exceeding maximum length", () => {
      const data: CrawlData = {
        openingText: "Opening",
        logoText: "Logo",
        episodeNumber: "I",
        episodeSubtitle: "Subtitle",
        crawlText: "x".repeat(FORM_CONSTANTS.MAX_MESSAGE_LENGTH + 1),
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("no more than");
      }
    });

    it("should reject opening text exceeding maximum length", () => {
      const data: CrawlData = {
        openingText: "x".repeat(FORM_CONSTANTS.MAX_OPENING_TEXT_LENGTH + 1),
        logoText: "Logo",
        episodeNumber: "I",
        episodeSubtitle: "Subtitle",
        crawlText: "Valid crawl text that meets minimum length requirements.",
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Opening text");
      }
    });

    it("should reject logo text exceeding maximum length", () => {
      const data: CrawlData = {
        openingText: "Opening",
        logoText: "x".repeat(FORM_CONSTANTS.MAX_LOGO_TEXT_LENGTH + 1),
        episodeNumber: "I",
        episodeSubtitle: "Subtitle",
        crawlText: "Valid crawl text that meets minimum length requirements.",
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Logo text");
      }
    });

    it("should reject episode number exceeding maximum length", () => {
      const data: CrawlData = {
        openingText: "Opening",
        logoText: "Logo",
        episodeNumber: "x".repeat(FORM_CONSTANTS.MAX_EPISODE_NUMBER_LENGTH + 1),
        episodeSubtitle: "Subtitle",
        crawlText: "Valid crawl text that meets minimum length requirements.",
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Episode number");
      }
    });

    it("should reject episode subtitle exceeding maximum length", () => {
      const data: CrawlData = {
        openingText: "Opening",
        logoText: "Logo",
        episodeNumber: "I",
        episodeSubtitle: "x".repeat(FORM_CONSTANTS.MAX_EPISODE_SUBTITLE_LENGTH + 1),
        crawlText: "Valid crawl text that meets minimum length requirements.",
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Episode subtitle");
      }
    });

    it("should reject data with wrong structure", () => {
      const invalidData = {
        wrongField: "value",
      };

      const result = validateCrawlData(invalidData);

      expect(result.success).toBe(false);
    });

    it("should reject non-object data", () => {
      const result = validateCrawlData("not an object");

      expect(result.success).toBe(false);
    });

    it("should reject null data", () => {
      const result = validateCrawlData(null);

      expect(result.success).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle maximum valid lengths", () => {
      const data: CrawlData = {
        openingText: "x".repeat(FORM_CONSTANTS.MAX_OPENING_TEXT_LENGTH),
        logoText: "x".repeat(FORM_CONSTANTS.MAX_LOGO_TEXT_LENGTH),
        episodeNumber: "x".repeat(FORM_CONSTANTS.MAX_EPISODE_NUMBER_LENGTH),
        episodeSubtitle: "x".repeat(FORM_CONSTANTS.MAX_EPISODE_SUBTITLE_LENGTH),
        crawlText: "x".repeat(FORM_CONSTANTS.MAX_MESSAGE_LENGTH),
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(true);
    });

    it("should handle minimum valid crawl text length", () => {
      const data: CrawlData = {
        openingText: "Opening",
        logoText: "Logo",
        episodeNumber: "I",
        episodeSubtitle: "Subtitle",
        crawlText: "x".repeat(FORM_CONSTANTS.MIN_MESSAGE_LENGTH),
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(true);
    });

    it("should handle special characters", () => {
      const data: CrawlData = {
        openingText: "A long time ago...",
        logoText: "STAR™ CRAWLER®",
        episodeNumber: "I-II-III",
        episodeSubtitle: "The Quest: Begins!",
        crawlText: "Valid crawl text with special chars: !@#$%^&*() that meets minimum length.",
      };

      const result = validateCrawlData(data);

      expect(result.success).toBe(true);
    });
  });
});

describe("crawlDataSchema", () => {
  it("should be a valid Zod schema", () => {
    expect(crawlDataSchema).toBeDefined();
    expect(typeof crawlDataSchema.parse).toBe("function");
  });
});

