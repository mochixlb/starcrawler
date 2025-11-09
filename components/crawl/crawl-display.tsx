"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { CRAWL_CONSTANTS } from "@/lib/constants";
import { FadeMask } from "@/components/crawl/fade-mask";
import type { CrawlDisplayProps } from "@/lib/types";

type AnimationPhase = "opening-text" | "logo" | "crawl";

export function CrawlDisplay({
  crawlData,
  isPlaying,
  onComplete,
}: CrawlDisplayProps) {
  const controls = useAnimation();
  const [phase, setPhase] = useState<AnimationPhase>("opening-text");
  const [isComplete, setIsComplete] = useState(false);
  const [crawlStarted, setCrawlStarted] = useState(false);
  const animationStartedRef = useRef(false);

  // Check for reduced motion preference
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Animation durations
  const openingTextDuration = shouldReduceMotion
    ? 1
    : CRAWL_CONSTANTS.OPENING_TEXT_DURATION;
  const logoDuration = shouldReduceMotion
    ? 1
    : CRAWL_CONSTANTS.LOGO_ANIMATION_DURATION;
  const crawlDuration = shouldReduceMotion ? 5 : CRAWL_CONSTANTS.DURATION;

  // Handle phase transitions
  useEffect(() => {
    if (!isPlaying) {
      setPhase("opening-text");
      setIsComplete(false);
      setCrawlStarted(false);
      animationStartedRef.current = false;
      controls.stop();
      controls.set({ y: CRAWL_CONSTANTS.CRAWL_START_POSITION });
      return;
    }

    // Opening text phase
    if (phase === "opening-text") {
      const timer = setTimeout(() => {
        setPhase("logo");
      }, openingTextDuration * 1000);
      return () => clearTimeout(timer);
    }

    // Logo phase - start crawl text 3 seconds before logo finishes
    if (phase === "logo") {
      // Start crawl animation early (3 seconds before logo ends)
      const crawlStartDelay = Math.max(0, (logoDuration - 3) * 1000);
      const crawlStartTimer = setTimeout(() => {
        setCrawlStarted(true);
      }, crawlStartDelay);
      
      // Transition to crawl phase when logo finishes
      const phaseTimer = setTimeout(() => {
        setPhase("crawl");
      }, logoDuration * 1000);
      
      return () => {
        clearTimeout(crawlStartTimer);
        clearTimeout(phaseTimer);
      };
    }

    // Crawl phase completion timer
    if (phase === "crawl" && !isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        onComplete?.();
      }, crawlDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [
    isPlaying,
    phase,
    isComplete,
    controls,
    openingTextDuration,
    logoDuration,
    crawlDuration,
    onComplete,
  ]);

  // Start crawl animation early (during logo phase) or when phase becomes "crawl"
  useEffect(() => {
    if ((crawlStarted || phase === "crawl") && isPlaying && !animationStartedRef.current) {
      animationStartedRef.current = true;
      // Reset to starting position (off-screen at bottom)
      controls.set({ y: CRAWL_CONSTANTS.CRAWL_START_POSITION });
      // Start animation immediately
      controls.start({
        y: CRAWL_CONSTANTS.CRAWL_END_POSITION,
        transition: {
          duration: crawlDuration,
          ease: "linear",
        },
      });
    }
  }, [crawlStarted, phase, isPlaying, controls, crawlDuration]);

  // Reset when crawlData changes
  useEffect(() => {
    setPhase("opening-text");
    setIsComplete(false);
    setCrawlStarted(false);
    animationStartedRef.current = false;
    controls.set({ y: CRAWL_CONSTANTS.CRAWL_START_POSITION });
  }, [crawlData, controls]);

  // Format crawl text into paragraphs
  const formatMessage = (text: string): string[] => {
    const paragraphs = text.split(/\n\n+/);
    return paragraphs.filter((p) => p.trim().length > 0);
  };

  const paragraphs = formatMessage(crawlData.crawlText);

  if (!isPlaying) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-10 overflow-hidden"
      style={{
        perspective: CRAWL_CONSTANTS.PERSPECTIVE,
        perspectiveOrigin: "50% 50%",
      }}
      aria-live="polite"
      aria-label="Opening crawl animation"
    >
      <FadeMask position="top" />
      <FadeMask position="bottom" />

      {/* Opening Text - Blue static text */}
      {phase === "opening-text" && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p
            className="font-opening-text text-center text-3xl md:text-4xl lg:text-5xl"
            style={{
              color: CRAWL_CONSTANTS.OPENING_TEXT_COLOR,
              letterSpacing: "0.15em",
              fontWeight: 400,
            }}
          >
            {crawlData.openingText}
          </p>
        </motion.div>
      )}

      {/* Logo Animation - 3D shrink/recede */}
      {phase === "logo" && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ scale: 3.5, opacity: 0, y: 0 }}
          animate={{
            scale: [3.5, 3, 0.1],
            opacity: [0, 1, 0],
            y: [0, 0, -150],
          }}
          transition={{
            duration: logoDuration,
            ease: [0.25, 0.1, 0.25, 1], // Custom ease-out curve for smooth deceleration
            times: [0, 0.2, 1], // Smooth continuous motion
          }}
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
        >
          <div
            className="font-logo text-crawl-yellow"
            style={{
              fontSize: "clamp(4rem, 15vw, 12rem)",
              lineHeight: 1,
              letterSpacing: "0.1em",
              textAlign: "center",
              textTransform: "uppercase",
              fontWeight: 900,
              width: "100vw",
            }}
          >
            {crawlData.logoText}
          </div>
        </motion.div>
      )}

      {/* Crawl Text - Scrolling animation with Episode info */}
      {(crawlStarted || phase === "crawl") && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `rotateX(${CRAWL_CONSTANTS.ROTATION}deg)`,
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
            zIndex: phase === "logo" ? 10 : 20,
          }}
        >
          <motion.div
            className="w-full max-w-4xl px-8 text-center"
            animate={controls}
            initial={{ y: CRAWL_CONSTANTS.CRAWL_START_POSITION }}
            style={{
              willChange: "transform",
            }}
          >
            <div
              className="space-y-6 font-crawl text-crawl-yellow"
              style={{
                fontSize: CRAWL_CONSTANTS.FONT_SIZE_BASE,
                lineHeight: CRAWL_CONSTANTS.LINE_HEIGHT,
                letterSpacing: CRAWL_CONSTANTS.LETTER_SPACING,
                textAlign: "center",
              }}
            >
              {/* Episode Number */}
              {crawlData.episodeNumber && (
                <div
                  style={{
                    fontSize: CRAWL_CONSTANTS.FONT_SIZE_EPISODE,
                    marginBottom: CRAWL_CONSTANTS.PARAGRAPH_SPACING,
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  EPISODE {crawlData.episodeNumber}
                </div>
              )}

              {/* Episode Subtitle */}
              {crawlData.episodeSubtitle && (
                <div
                  style={{
                    fontSize: CRAWL_CONSTANTS.FONT_SIZE_TITLE,
                    marginBottom: CRAWL_CONSTANTS.PARAGRAPH_SPACING,
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  {crawlData.episodeSubtitle}
                </div>
              )}

              {/* Crawl Text Paragraphs */}
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
      )}
    </div>
  );
}
