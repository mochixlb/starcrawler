import { z } from "zod";
import { FORM_CONSTANTS } from "./constants";

const DEFAULT_OPENING_TEXT = "A long time ago in a galaxy far, far away....";
const DEFAULT_LOGO_TEXT = "STAR CRAWLER";

/**
 * Zod schema for validating CrawlData
 * Single source of truth for data validation and transformation
 */
export const crawlDataSchema = z.object({
  openingText: z
    .string()
    .max(FORM_CONSTANTS.MAX_OPENING_TEXT_LENGTH, {
      message: `Opening text must be no more than ${FORM_CONSTANTS.MAX_OPENING_TEXT_LENGTH} characters`,
    })
    .transform((val) => val.trim() || DEFAULT_OPENING_TEXT),
  logoText: z
    .string()
    .max(FORM_CONSTANTS.MAX_LOGO_TEXT_LENGTH, {
      message: `Logo text must be no more than ${FORM_CONSTANTS.MAX_LOGO_TEXT_LENGTH} characters`,
    })
    .transform((val) => (val.trim() || DEFAULT_LOGO_TEXT).toUpperCase()),
  episodeNumber: z
    .string()
    .max(FORM_CONSTANTS.MAX_EPISODE_NUMBER_LENGTH, {
      message: `Episode number must be no more than ${FORM_CONSTANTS.MAX_EPISODE_NUMBER_LENGTH} characters`,
    })
    .transform((val) => val.trim().toUpperCase()),
  episodeSubtitle: z
    .string()
    .max(FORM_CONSTANTS.MAX_EPISODE_SUBTITLE_LENGTH, {
      message: `Episode subtitle must be no more than ${FORM_CONSTANTS.MAX_EPISODE_SUBTITLE_LENGTH} characters`,
    })
    .transform((val) => val.trim().toUpperCase()),
  crawlText: z
    .string()
    .max(FORM_CONSTANTS.MAX_MESSAGE_LENGTH, {
      message: `Crawl text must be no more than ${FORM_CONSTANTS.MAX_MESSAGE_LENGTH} characters`,
    })
    .transform((val) => val.trim())
    .refine((val) => val.length >= FORM_CONSTANTS.MIN_MESSAGE_LENGTH, {
      message: `Crawl text must be at least ${FORM_CONSTANTS.MIN_MESSAGE_LENGTH} characters`,
    }),
});

/**
 * Type-safe CrawlData inferred from schema
 */
type ValidatedCrawlData = z.infer<typeof crawlDataSchema>;

/**
 * Validates complete CrawlData object
 * Returns validated and transformed data or validation errors
 */
export function validateCrawlData(
  data: unknown
):
  | { success: true; data: ValidatedCrawlData }
  | { success: false; error: string } {
  const result = crawlDataSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      success: false,
      error: firstError?.message || "Invalid crawl data",
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
