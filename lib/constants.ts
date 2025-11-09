// Opening crawl animation constants
export const CRAWL_CONSTANTS = {
  PERSPECTIVE: "400px",
  ROTATION: 25, // degrees
  DURATION: 45, // seconds
  FONT_SIZE_BASE: "2.5rem", // 40px
  FONT_SIZE_TITLE: "3.5rem", // 56px
  FONT_SIZE_EPISODE: "2rem", // 32px
  LINE_HEIGHT: 1.7,
  LETTER_SPACING: "0.05em",
  PARAGRAPH_SPACING: "3rem",
  OPENING_TEXT_COLOR: "#4BD5EE", // Cyan blue for "A long time ago..."
  LOGO_ANIMATION_DURATION: 8, // seconds for logo shrink/recede (matches original timing)
  OPENING_TEXT_DURATION: 6, // seconds to display opening text (matches original timing)
  ANIMATION_START_DELAY: 100, // milliseconds - delay before starting crawl animation
  CRAWL_START_POSITION: "150%", // Starting Y position (off-screen at bottom)
  CRAWL_END_POSITION: "-150%", // Ending Y position (off-screen at top)
  FADE_MASK_HEIGHT: "25%", // Height of fade masks (1/4 of viewport)
} as const;

// Starfield constants
export const STARFIELD_CONSTANTS = {
  STAR_SIZES: [1, 2, 3], // pixels
  ANIMATION_SPEEDS: [120, 150, 180, 200], // seconds per cycle (very slow, subtle movement)
  STAR_COUNTS: [60, 45, 30, 15], // Reduced star counts per layer
} as const;

// Form validation constants
export const FORM_CONSTANTS = {
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 2000,
} as const;
