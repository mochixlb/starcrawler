// Opening crawl animation constants
export const CRAWL_CONSTANTS = {
  PERSPECTIVE: "400px",
  ROTATION: 25, // degrees
  DURATION: 45, // seconds
  // Font sizes optimized for readability across all screen sizes
  // Mobile: smaller base, Desktop: larger for cinematic effect
  FONT_SIZE_BASE: "clamp(0.875rem, 3.5vw + 0.5rem, 2rem)", // Responsive: 14px mobile → 32px desktop
  FONT_SIZE_TITLE: "clamp(1.25rem, 4.5vw + 0.75rem, 2.75rem)", // Responsive: 20px mobile → 44px desktop
  FONT_SIZE_EPISODE: "clamp(0.75rem, 2.5vw + 0.5rem, 1.5rem)", // Responsive: 12px mobile → 24px desktop
  LINE_HEIGHT: 1.6, // Slightly tighter for better readability (original uses ~1.6)
  LETTER_SPACING: "0.06em", // Slightly increased for better readability
  PARAGRAPH_SPACING: "clamp(1.25rem, 3vw + 0.5rem, 2.5rem)", // Responsive spacing
  OPENING_TEXT_COLOR: "#4BD5EE", // Cyan blue for "A long time ago..."
  LOGO_ANIMATION_DURATION: 8, // seconds for logo shrink/recede (matches original timing)
  OPENING_TEXT_DURATION: 6, // seconds to display opening text (matches original timing)
  CRAWL_START_POSITION: "100%", // Starting Y position (off-screen at bottom)
  CRAWL_END_POSITION: "-200%", // Ending Y position (off-screen at top, further for fade effect)
  FADE_MASK_HEIGHT: "30%", // Height of fade masks (increased for better fade effect)
  // Classic crawl yellow: RGB(229, 177, 58) = #E5B13A
  CRAWL_YELLOW: "#E5B13A",
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
  MAX_MESSAGE_LENGTH: 1000,
  MAX_OPENING_TEXT_LENGTH: 200,
  MAX_LOGO_TEXT_LENGTH: 50,
  MAX_EPISODE_NUMBER_LENGTH: 20,
  MAX_EPISODE_SUBTITLE_LENGTH: 100,
} as const;

// URL validation constants
export const URL_CONSTANTS = {
  MAX_ENCODED_LENGTH: 10 * 1024, // 10KB max encoded parameter length
  MAX_URL_LENGTH: 2000, // Browser URL limit (conservative)
} as const;

// UI constants
export const UI_CONSTANTS = {
  COPY_FEEDBACK_DURATION: 2000, // milliseconds
} as const;
