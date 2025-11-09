// Star Wars crawl animation constants
export const CRAWL_CONSTANTS = {
  PERSPECTIVE: "400px",
  ROTATION: 25, // degrees
  DURATION: 45, // seconds
  FONT_SIZE_BASE: "2.5rem", // 40px
  FONT_SIZE_TITLE: "3.5rem", // 56px
  LINE_HEIGHT: 1.7,
  LETTER_SPACING: "0.05em",
  PARAGRAPH_SPACING: "3rem",
} as const;

// Starfield constants
export const STARFIELD_CONSTANTS = {
  STAR_SIZES: [1, 2, 3], // pixels
  ANIMATION_SPEEDS: [120, 150, 180, 200], // seconds per cycle (very slow, subtle movement)
  STAR_COUNTS: [100, 75, 50, 25], // Star counts per layer
} as const;

// Form validation constants
export const FORM_CONSTANTS = {
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 2000,
} as const;

