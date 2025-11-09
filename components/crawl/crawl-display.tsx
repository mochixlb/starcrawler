"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { CRAWL_CONSTANTS } from "@/lib/constants";
import type { CrawlDisplayProps } from "@/components/shared/types";

export function CrawlDisplay({
  message,
  isPlaying,
  onComplete,
}: CrawlDisplayProps) {
  const controls = useAnimation();
  const [isComplete, setIsComplete] = useState(false);

  // Check for reduced motion preference
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Animation duration in seconds
  const animationDuration = shouldReduceMotion ? 5 : CRAWL_CONSTANTS.DURATION;

  // Start animation when isPlaying becomes true
  useEffect(() => {
    if (isPlaying && !isComplete) {
      setIsComplete(false);
      controls.start({
        y: "-100%",
        transition: {
          duration: animationDuration,
          ease: "linear",
        },
      });
    } else if (!isPlaying) {
      controls.stop();
    }
  }, [isPlaying, controls, animationDuration, isComplete]);

  // Handle animation completion
  useEffect(() => {
    if (isPlaying && !isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        onComplete?.();
      }, animationDuration * 1000);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, isComplete, onComplete, animationDuration]);

  // Reset animation when message changes
  useEffect(() => {
    setIsComplete(false);
    controls.set({ y: "100%" });
  }, [message, controls]);

  // Format message into paragraphs (split by double newlines or long lines)
  const formatMessage = (text: string): string[] => {
    // Split by double newlines first
    const paragraphs = text.split(/\n\n+/);
    return paragraphs.filter((p) => p.trim().length > 0);
  };

  const paragraphs = formatMessage(message);

  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        perspective: CRAWL_CONSTANTS.PERSPECTIVE,
        perspectiveOrigin: "50% 50%",
      }}
      aria-live="polite"
      aria-label="Star Wars opening crawl"
    >
      {/* Fade mask at top */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-1/4"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      {/* Fade mask at bottom */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-1/4"
        style={{
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      {/* 3D container with rotation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `rotateX(${CRAWL_CONSTANTS.ROTATION}deg)`,
          transformOrigin: "50% 100%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Text container that scrolls */}
        <motion.div
          className="w-full max-w-4xl px-8 text-center"
          animate={controls}
          initial={{ y: "100%" }}
          style={{
            willChange: "transform",
          }}
        >
          <div
            className="font-starwars text-starwars-yellow"
            style={{
              fontSize: CRAWL_CONSTANTS.FONT_SIZE_TITLE,
              lineHeight: CRAWL_CONSTANTS.LINE_HEIGHT,
              letterSpacing: CRAWL_CONSTANTS.LETTER_SPACING,
              textAlign: "center",
              textTransform: "uppercase",
              fontWeight: 900,
            }}
          >
            STAR WARS
          </div>

          <div
            className="mt-8 space-y-6 font-starwars text-starwars-yellow"
            style={{
              fontSize: CRAWL_CONSTANTS.FONT_SIZE_BASE,
              lineHeight: CRAWL_CONSTANTS.LINE_HEIGHT,
              letterSpacing: CRAWL_CONSTANTS.LETTER_SPACING,
              textAlign: "center",
            }}
          >
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  marginBottom: CRAWL_CONSTANTS.PARAGRAPH_SPACING,
                }}
              >
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
