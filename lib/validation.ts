import { FORM_CONSTANTS } from "./constants";

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateCrawlText(text: string): ValidationResult {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return {
      isValid: false,
      error: "Please enter crawl text",
    };
  }

  if (trimmedText.length < FORM_CONSTANTS.MIN_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Crawl text must be at least ${FORM_CONSTANTS.MIN_MESSAGE_LENGTH} characters`,
    };
  }

  if (trimmedText.length > FORM_CONSTANTS.MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Crawl text must be no more than ${FORM_CONSTANTS.MAX_MESSAGE_LENGTH} characters`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

