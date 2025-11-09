import { describe, it, expect } from "vitest";
import { validateCrawlData, crawlDataSchema } from "../validation";
import { FORM_CONSTANTS } from "../constants";

describe("crawlDataSchema", () => {
  describe("openingText", () => {
    it("should accept valid opening text", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.openingText).toBe("A long time ago...");
      }
    });

    it("should trim whitespace from opening text", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "  A long time ago...  ",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.openingText).toBe("A long time ago...");
      }
    });

    it("should use default when opening text is empty", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.openingText).toBe(
          "A long time ago in a galaxy far, far away...."
        );
      }
    });

    it("should reject opening text exceeding max length", () => {
      const longText = "A".repeat(FORM_CONSTANTS.MAX_OPENING_TEXT_LENGTH + 1);
      const result = crawlDataSchema.safeParse({
        openingText: longText,
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          `Opening text must be no more than ${FORM_CONSTANTS.MAX_OPENING_TEXT_LENGTH} characters`
        );
      }
    });
  });

  describe("logoText", () => {
    it("should accept valid logo text", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.logoText).toBe("EPISODE LOGO");
      }
    });

    it("should convert logo text to uppercase", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "episode logo",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.logoText).toBe("EPISODE LOGO");
      }
    });

    it("should trim and use default when logo text is empty", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "   ",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.logoText).toBe("STAR CRAWLER");
      }
    });

    it("should reject logo text exceeding max length", () => {
      const longText = "A".repeat(FORM_CONSTANTS.MAX_LOGO_TEXT_LENGTH + 1);
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: longText,
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          `Logo text must be no more than ${FORM_CONSTANTS.MAX_LOGO_TEXT_LENGTH} characters`
        );
      }
    });
  });

  describe("episodeNumber", () => {
    it("should accept valid episode number", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.episodeNumber).toBe("IV");
      }
    });

    it("should convert episode number to uppercase and trim", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "  iv  ",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.episodeNumber).toBe("IV");
      }
    });

    it("should accept empty episode number", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.episodeNumber).toBe("");
      }
    });

    it("should reject episode number exceeding max length", () => {
      const longText = "A".repeat(FORM_CONSTANTS.MAX_EPISODE_NUMBER_LENGTH + 1);
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: longText,
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          `Episode number must be no more than ${FORM_CONSTANTS.MAX_EPISODE_NUMBER_LENGTH} characters`
        );
      }
    });
  });

  describe("episodeSubtitle", () => {
    it("should accept valid episode subtitle", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.episodeSubtitle).toBe("THE BEGINNING");
      }
    });

    it("should convert episode subtitle to uppercase and trim", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "  the beginning  ",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.episodeSubtitle).toBe("THE BEGINNING");
      }
    });

    it("should accept empty episode subtitle", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.episodeSubtitle).toBe("");
      }
    });

    it("should reject episode subtitle exceeding max length", () => {
      const longText = "A".repeat(
        FORM_CONSTANTS.MAX_EPISODE_SUBTITLE_LENGTH + 1
      );
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: longText,
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          `Episode subtitle must be no more than ${FORM_CONSTANTS.MAX_EPISODE_SUBTITLE_LENGTH} characters`
        );
      }
    });
  });

  describe("crawlText", () => {
    it("should accept valid crawl text", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.crawlText).toBe("It is a period of civil war.");
      }
    });

    it("should trim whitespace from crawl text", () => {
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "  It is a period of civil war.  ",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.crawlText).toBe("It is a period of civil war.");
      }
    });

    it("should reject crawl text shorter than minimum length", () => {
      const shortText = "A".repeat(FORM_CONSTANTS.MIN_MESSAGE_LENGTH - 1);
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: shortText,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          `Crawl text must be at least ${FORM_CONSTANTS.MIN_MESSAGE_LENGTH} characters`
        );
      }
    });

    it("should accept crawl text at minimum length", () => {
      const minText = "A".repeat(FORM_CONSTANTS.MIN_MESSAGE_LENGTH);
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: minText,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.crawlText).toBe(minText);
      }
    });

    it("should reject crawl text exceeding max length", () => {
      const longText = "A".repeat(FORM_CONSTANTS.MAX_MESSAGE_LENGTH + 1);
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: longText,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          `Crawl text must be no more than ${FORM_CONSTANTS.MAX_MESSAGE_LENGTH} characters`
        );
      }
    });

    it("should accept crawl text at max length", () => {
      const maxText = "A".repeat(FORM_CONSTANTS.MAX_MESSAGE_LENGTH);
      const result = crawlDataSchema.safeParse({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: maxText,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.crawlText).toBe(maxText);
      }
    });
  });

  describe("complete schema validation", () => {
    it("should validate complete valid crawl data", () => {
      const validData = {
        openingText: "A long time ago in a galaxy far, far away....",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText:
          "It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.",
      };

      const result = crawlDataSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchObject({
          openingText: validData.openingText,
          logoText: "EPISODE LOGO",
          episodeNumber: "IV",
          episodeSubtitle: "THE BEGINNING",
          crawlText: validData.crawlText,
        });
      }
    });

    it("should reject invalid data types", () => {
      const invalidData = {
        openingText: 123,
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      };

      const result = crawlDataSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should reject missing required fields", () => {
      const incompleteData = {
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        // Missing episodeNumber, episodeSubtitle, crawlText
      };

      const result = crawlDataSchema.safeParse(incompleteData);

      expect(result.success).toBe(false);
    });
  });
});

describe("validateCrawlData", () => {
  it("should return success with validated data for valid input", () => {
    const validData = {
      openingText: "A long time ago...",
      logoText: "EPISODE LOGO",
      episodeNumber: "IV",
      episodeSubtitle: "THE BEGINNING",
      crawlText: "It is a period of civil war.",
    };

    const result = validateCrawlData(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject({
        openingText: "A long time ago...",
        logoText: "EPISODE LOGO",
        episodeNumber: "IV",
        episodeSubtitle: "THE BEGINNING",
        crawlText: "It is a period of civil war.",
      });
    }
  });

  it("should return error for invalid input", () => {
    const invalidData = {
      openingText: "A".repeat(FORM_CONSTANTS.MAX_OPENING_TEXT_LENGTH + 1),
      logoText: "EPISODE LOGO",
      episodeNumber: "IV",
      episodeSubtitle: "THE BEGINNING",
      crawlText: "It is a period of civil war.",
    };

    const result = validateCrawlData(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
      expect(result.error).toContain("Opening text must be no more than");
    }
  });

  it("should return error message for missing crawl text", () => {
    const invalidData = {
      openingText: "A long time ago...",
      logoText: "EPISODE LOGO",
      episodeNumber: "IV",
      episodeSubtitle: "THE BEGINNING",
      crawlText: "short", // Too short
    };

    const result = validateCrawlData(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
      expect(result.error).toContain("Crawl text must be at least");
    }
  });

  it("should return generic error message when error details are missing", () => {
    // This tests the fallback error message
    const invalidData = null;

    const result = validateCrawlData(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
    }
  });
});
