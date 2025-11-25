"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { X } from "lucide-react";
import { CRAWL_CONSTANTS } from "@/lib/constants";
import { FadeMask } from "@/components/crawl/fade-mask";
import { Button } from "@/components/ui/button";
import type { CrawlDisplayProps } from "@/lib/types";

type AnimationPhase = "opening-text" | "logo" | "crawl";

export function CrawlDisplay({
  crawlData,
  isPlaying,
  isPaused = false,
  onComplete,
  onProgressChange,
  seekTo,
  onPause,
  onResume,
  onClose,
  controlsVisible = false,
  onControlsVisibilityChange,
  onPhaseChange,
}: CrawlDisplayProps) {
  const controls = useAnimation();
  const [phase, setPhase] = useState<AnimationPhase>("opening-text");
  const hasCompletedRef = useRef(false);
  const markComplete = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setIsComplete(true);
    onComplete?.();
  };

  // Notify parent of phase changes
  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);
  const [isComplete, setIsComplete] = useState(false);
  const [crawlStarted, setCrawlStarted] = useState(false);
  const animationStartedRef = useRef(false);
  const currentProgressRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const totalPausedTimeRef = useRef(0);
  const pauseStartTimeRef = useRef<number | null>(null);
  const controlsShownOnceRef = useRef(false);

  // Check for reduced motion preference
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Base animation durations (for progress tracking)
  const baseCrawlDuration = shouldReduceMotion ? 5 : CRAWL_CONSTANTS.DURATION;

  // Animation durations
  const openingTextDuration = shouldReduceMotion
    ? 1
    : CRAWL_CONSTANTS.OPENING_TEXT_DURATION;
  const logoDuration = shouldReduceMotion
    ? 1
    : CRAWL_CONSTANTS.LOGO_ANIMATION_DURATION;
  const crawlDuration = baseCrawlDuration;

  // Handle pause/resume for crawl animation
  useEffect(() => {
    if (phase === "crawl" && crawlStarted && animationStartedRef.current) {
      if (isPaused) {
        // Pause: stop animation and track pause start time
        controls.stop();
        if (pauseStartTimeRef.current === null) {
          pauseStartTimeRef.current = Date.now();
        }
      } else {
        // Resume: calculate elapsed time accounting for pauses
        if (pauseStartTimeRef.current !== null) {
          const pauseDuration = Date.now() - pauseStartTimeRef.current;
          totalPausedTimeRef.current += pauseDuration;
          pauseStartTimeRef.current = null;
        }

        // Calculate current progress based on base duration and remaining duration
        const elapsed = startTimeRef.current
          ? (Date.now() - startTimeRef.current - totalPausedTimeRef.current) /
            1000
          : 0;
        currentProgressRef.current = Math.min(elapsed / baseCrawlDuration, 1);
        const remainingDuration =
          crawlDuration * (1 - currentProgressRef.current);

        // Calculate current Y position
        const startY = parseFloat(CRAWL_CONSTANTS.CRAWL_START_POSITION);
        const endY = parseFloat(CRAWL_CONSTANTS.CRAWL_END_POSITION);
        const currentY = startY + (endY - startY) * currentProgressRef.current;

        // Calculate target opacity based on current progress
        const fadeStart = 0.7;
        const fadeEnd = 1.0;
        const targetOpacity =
          currentProgressRef.current >= fadeStart
            ? Math.max(
                0,
                1 -
                  (currentProgressRef.current - fadeStart) /
                    (fadeEnd - fadeStart)
              )
            : 1;

        // Resume from current position
        controls.set({ y: `${currentY}%`, opacity: targetOpacity });
        controls
          .start({
            y: CRAWL_CONSTANTS.CRAWL_END_POSITION,
            opacity: targetOpacity,
            transition: {
              duration: remainingDuration,
              ease: "linear",
            },
          });
      }
    }
  }, [
    isPaused,
    phase,
    crawlStarted,
    controls,
    crawlDuration,
    baseCrawlDuration,
    markComplete,
  ]);

  // Calculate total duration (opening + logo + crawl)
  const totalDuration = openingTextDuration + logoDuration + baseCrawlDuration;

  // Track overall animation progress (all phases)
  const overallStartTimeRef = useRef<number | null>(null);
  const overallPausedTimeRef = useRef(0);
  const overallPauseStartRef = useRef<number | null>(null);

  // Track overall progress
  useEffect(() => {
    if (isPlaying && overallStartTimeRef.current === null) {
      overallStartTimeRef.current = Date.now();
    }
    if (!isPlaying) {
      overallStartTimeRef.current = null;
      overallPausedTimeRef.current = 0;
      overallPauseStartRef.current = null;
      hasCompletedRef.current = false;
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPaused && overallPauseStartRef.current === null) {
      overallPauseStartRef.current = Date.now();
    } else if (!isPaused && overallPauseStartRef.current !== null) {
      overallPausedTimeRef.current += Date.now() - overallPauseStartRef.current;
      overallPauseStartRef.current = null;
    }
  }, [isPaused]);

  // Track animation progress and report to parent
  useEffect(() => {
    if (isPlaying && !isComplete && !isPaused) {
      const interval = setInterval(() => {
        if (overallStartTimeRef.current !== null && onProgressChange) {
          const overallElapsed =
            (Date.now() -
              overallStartTimeRef.current -
              overallPausedTimeRef.current -
              (overallPauseStartRef.current
                ? Date.now() - overallPauseStartRef.current
                : 0)) /
            1000;
          const overallProgress = Math.min(overallElapsed / totalDuration, 1);
          const overallRemaining = Math.max(0, totalDuration - overallElapsed);

          // Stop tracking if animation is complete
          if (isComplete || overallRemaining <= 0) {
            return;
          }

          // For crawl phase, also track crawl-specific progress
          if (
            phase === "crawl" &&
            crawlStarted &&
            startTimeRef.current !== null
          ) {
            const crawlElapsed =
              (Date.now() -
                startTimeRef.current -
                totalPausedTimeRef.current -
                (pauseStartTimeRef.current
                  ? Date.now() - pauseStartTimeRef.current
                  : 0)) /
              1000;
            currentProgressRef.current = Math.min(
              crawlElapsed / baseCrawlDuration,
              1
            );

            // Fade out as text goes into the distance (start fading at 70% progress)
            const fadeStart = 0.7;
            const fadeEnd = 1.0;
            if (currentProgressRef.current >= fadeStart) {
              const fadeProgress =
                (currentProgressRef.current - fadeStart) /
                (fadeEnd - fadeStart);
              const opacity = Math.max(0, 1 - fadeProgress);
              controls.set({ opacity });
            } else {
              controls.set({ opacity: 1 });
            }

            // If crawl animation has completed, mark as complete
            // Completion is handled by the crawl-phase effect to avoid duplicates
          }

          onProgressChange(overallProgress, overallElapsed, overallRemaining);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [
    isPlaying,
    phase,
    crawlStarted,
    isPaused,
    baseCrawlDuration,
    totalDuration,
    onProgressChange,
    isComplete,
    markComplete,
  ]);

  // Track phase transition start times for pause/resume
  const phaseStartTimeRef = useRef<number | null>(null);
  const phasePausedTimeRef = useRef(0);
  const phasePauseStartRef = useRef<number | null>(null);

  // Handle phase transitions
  useEffect(() => {
    if (!isPlaying) {
      setPhase("opening-text");
      setIsComplete(false);
      setCrawlStarted(false);
      hasCompletedRef.current = false;
      animationStartedRef.current = false;
      currentProgressRef.current = 0;
      startTimeRef.current = null;
      totalPausedTimeRef.current = 0;
      pauseStartTimeRef.current = null;
      phaseStartTimeRef.current = null;
      phasePausedTimeRef.current = 0;
      phasePauseStartRef.current = null;
      controls.stop();
      controls.set({ y: CRAWL_CONSTANTS.CRAWL_START_POSITION });
      return;
    }

    // Skip phase transition logic if we're in crawl phase - crawl animation handles its own timing
    if (phase === "crawl" && crawlStarted) {
      return;
    }

    // Initialize phase start time if not set
    if (phaseStartTimeRef.current === null) {
      phaseStartTimeRef.current = Date.now();
    }

    // Handle pause/resume for phase timers
    if (isPaused) {
      if (phasePauseStartRef.current === null) {
        phasePauseStartRef.current = Date.now();
      }
      return; // Don't set timers when paused
    } else {
      // Resume: add paused time to total
      if (phasePauseStartRef.current !== null) {
        const pauseDuration = Date.now() - phasePauseStartRef.current;
        phasePausedTimeRef.current += pauseDuration;
        phasePauseStartRef.current = null;
      }
    }

    // Calculate elapsed time accounting for pauses
    const elapsed = phaseStartTimeRef.current
      ? (Date.now() - phaseStartTimeRef.current - phasePausedTimeRef.current) /
        1000
      : 0;

    // Opening text phase
    if (phase === "opening-text") {
      const remaining = Math.max(0, openingTextDuration - elapsed);
      if (remaining <= 0) {
        setPhase("logo");
        phaseStartTimeRef.current = Date.now();
        phasePausedTimeRef.current = 0;
        return;
      }
      const timer = setTimeout(() => {
        setPhase("logo");
        phaseStartTimeRef.current = Date.now();
        phasePausedTimeRef.current = 0;
      }, remaining * 1000);
      return () => clearTimeout(timer);
    }

    // Logo phase - start crawl text 3 seconds before logo finishes
    if (phase === "logo") {
      const remaining = Math.max(0, logoDuration - elapsed);

      // Start crawl animation early (3 seconds before logo ends)
      const crawlStartDelay = Math.max(0, remaining - 3);
      const crawlStartTimer = setTimeout(() => {
        setCrawlStarted(true);
      }, crawlStartDelay * 1000);

      // Transition to crawl phase when logo finishes
      if (remaining <= 0) {
        setPhase("crawl");
        phaseStartTimeRef.current = Date.now();
        phasePausedTimeRef.current = 0;
        return () => clearTimeout(crawlStartTimer);
      }

      const phaseTimer = setTimeout(() => {
        setPhase("crawl");
        phaseStartTimeRef.current = Date.now();
        phasePausedTimeRef.current = 0;
      }, remaining * 1000);

      return () => {
        clearTimeout(crawlStartTimer);
        clearTimeout(phaseTimer);
      };
    }

    // Crawl phase completion timer
    // Note: For crawl phase, we don't use phaseStartTimeRef - we use startTimeRef instead
    // The crawl animation is handled separately, so we only need to check completion
    // based on the crawl animation progress, not phase timing
    if (phase === "crawl" && !isComplete && crawlStarted) {
      // Use crawl animation timing instead of phase timing
      const crawlElapsed = startTimeRef.current
        ? (Date.now() - startTimeRef.current - totalPausedTimeRef.current) /
          1000
        : 0;
      const crawlRemaining = Math.max(0, baseCrawlDuration - crawlElapsed);

      if (crawlRemaining <= 0) {
        markComplete();
        return;
      }
      const timer = setTimeout(() => {
        markComplete();
      }, crawlRemaining * 1000);
      return () => clearTimeout(timer);
    }
  }, [
    isPlaying,
    phase,
    isComplete,
    isPaused,
    controls,
    openingTextDuration,
    logoDuration,
    crawlDuration,
    markComplete,
    crawlStarted,
    baseCrawlDuration,
    startTimeRef,
    totalPausedTimeRef,
  ]);

  // Handle seeking
  useEffect(() => {
    if (seekTo !== undefined && seekTo >= 0 && seekTo <= 1 && isPlaying) {
      const seekTime = seekTo * totalDuration;

      // If seeking to the very start (progress = 0 or very close), restart from beginning
      if (seekTo <= 0.001 || seekTime < 0.1) {
        // Restart from opening text phase
        setPhase("opening-text");
        setIsComplete(false);
        hasCompletedRef.current = false;
        setCrawlStarted(false);
        animationStartedRef.current = false;
        currentProgressRef.current = 0;
        startTimeRef.current = null;
        totalPausedTimeRef.current = 0;
        pauseStartTimeRef.current = null;
        phaseStartTimeRef.current = Date.now();
        phasePausedTimeRef.current = 0;
        phasePauseStartRef.current = null;
        overallStartTimeRef.current = Date.now();
        overallPausedTimeRef.current = 0;
        overallPauseStartRef.current = null;
        controls.stop();
        controls.set({ y: CRAWL_CONSTANTS.CRAWL_START_POSITION });
        return;
      }

      // If seeking to opening-text phase
      if (seekTime < openingTextDuration) {
        const openingSeekProgress = seekTime / openingTextDuration;
        setPhase("opening-text");
        setIsComplete(false);
        hasCompletedRef.current = false;
        setCrawlStarted(false);
        animationStartedRef.current = false;
        currentProgressRef.current = 0;
        startTimeRef.current = null;
        totalPausedTimeRef.current = 0;
        pauseStartTimeRef.current = null;
        // Set phase start time so elapsed calculation gives correct progress
        phaseStartTimeRef.current =
          Date.now() - openingSeekProgress * openingTextDuration * 1000;
        phasePausedTimeRef.current = 0;
        phasePauseStartRef.current = null;
        overallStartTimeRef.current = Date.now() - seekTime * 1000;
        overallPausedTimeRef.current = 0;
        overallPauseStartRef.current = null;
        controls.stop();
        controls.set({ y: CRAWL_CONSTANTS.CRAWL_START_POSITION });
        return;
      }

      // If seeking to logo phase
      if (seekTime < openingTextDuration + logoDuration) {
        const logoSeekTime = seekTime - openingTextDuration;
        const logoSeekProgress = logoSeekTime / logoDuration;
        setPhase("logo");
        setIsComplete(false);
        hasCompletedRef.current = false;
        setCrawlStarted(false);
        animationStartedRef.current = false;
        currentProgressRef.current = 0;
        startTimeRef.current = null;
        totalPausedTimeRef.current = 0;
        pauseStartTimeRef.current = null;
        // Set phase start time so elapsed calculation gives correct progress
        phaseStartTimeRef.current =
          Date.now() - logoSeekProgress * logoDuration * 1000;
        phasePausedTimeRef.current = 0;
        phasePauseStartRef.current = null;
        overallStartTimeRef.current = Date.now() - seekTime * 1000;
        overallPausedTimeRef.current = 0;
        overallPauseStartRef.current = null;
        controls.stop();
        controls.set({ y: CRAWL_CONSTANTS.CRAWL_START_POSITION });
        return;
      }

      // If seeking to crawl phase
      if (seekTime >= openingTextDuration + logoDuration) {
        // Seeking within crawl phase
        const crawlSeekTime = seekTime - openingTextDuration - logoDuration;
        const crawlSeekProgress = Math.max(
          0,
          Math.min(1, crawlSeekTime / baseCrawlDuration)
        );

        setPhase("crawl");
        setCrawlStarted(true);
        hasCompletedRef.current = false;
        animationStartedRef.current = true;

        const startY = parseFloat(CRAWL_CONSTANTS.CRAWL_START_POSITION);
        const endY = parseFloat(CRAWL_CONSTANTS.CRAWL_END_POSITION);
        const targetY = startY + (endY - startY) * crawlSeekProgress;

        currentProgressRef.current = crawlSeekProgress;

        const seekElapsed = baseCrawlDuration * crawlSeekProgress;
        const now = Date.now();
        startTimeRef.current = now - seekElapsed * 1000;
        totalPausedTimeRef.current = 0;
        pauseStartTimeRef.current = null;
        phaseStartTimeRef.current = null; // Not used in crawl phase
        phasePausedTimeRef.current = 0;
        phasePauseStartRef.current = null;
        overallStartTimeRef.current = now - seekTime * 1000;
        overallPausedTimeRef.current = 0;
        overallPauseStartRef.current = null;

        // Update opacity based on seek progress
        const fadeStart = 0.7;
        const fadeEnd = 1.0;
        let targetOpacity = 1;
        if (crawlSeekProgress >= fadeStart) {
          const fadeProgress =
            (crawlSeekProgress - fadeStart) / (fadeEnd - fadeStart);
          targetOpacity = Math.max(0, 1 - fadeProgress);
        } else {
          targetOpacity = 1;
        }

        controls.set({ y: `${targetY}%`, opacity: targetOpacity });

        const remainingDuration = crawlDuration * (1 - crawlSeekProgress);
        if (!isPaused) {
          if (remainingDuration <= 0) {
            // Edge-case: already at the end after seek
            markComplete();
          } else {
            controls.start({
              y: CRAWL_CONSTANTS.CRAWL_END_POSITION,
              opacity: targetOpacity,
              transition: {
                duration: remainingDuration,
                ease: "linear",
              },
            });
          }
        }
      }
    }
  }, [
    seekTo,
    phase,
    crawlStarted,
    isPlaying,
    isPaused,
    controls,
    baseCrawlDuration,
    crawlDuration,
    openingTextDuration,
    logoDuration,
    totalDuration,
    markComplete,
  ]);

  // Start crawl animation early (during logo phase) or when phase becomes "crawl"
  useEffect(() => {
    if (
      (crawlStarted || phase === "crawl") &&
      isPlaying &&
      !animationStartedRef.current &&
      !isPaused
    ) {
      animationStartedRef.current = true;
      currentProgressRef.current = 0;
      startTimeRef.current = Date.now();
      totalPausedTimeRef.current = 0;
      pauseStartTimeRef.current = null;
      // Reset to starting position (off-screen at bottom)
      controls.set({ y: CRAWL_CONSTANTS.CRAWL_START_POSITION, opacity: 1 });
      // Start animation immediately with completion callback
      controls
        .start({
          y: CRAWL_CONSTANTS.CRAWL_END_POSITION,
          opacity: 0, // Fade to 0 at the end
          transition: {
            duration: crawlDuration,
            ease: "linear",
          },
        });
    }
  }, [
    crawlStarted,
    phase,
    isPlaying,
    isPaused,
    controls,
    crawlDuration,
    markComplete,
  ]);

  // Reset when crawlData changes
  // Use a ref to track previous crawlData to only reset when it actually changes
  const previousCrawlDataRef = useRef(crawlData);
  useEffect(() => {
    // Only reset if crawlData actually changed (not just a reference change)
    const crawlDataChanged =
      previousCrawlDataRef.current !== crawlData &&
      (previousCrawlDataRef.current === null ||
        crawlData === null ||
        JSON.stringify(previousCrawlDataRef.current) !==
          JSON.stringify(crawlData));

    if (crawlDataChanged) {
      setPhase("opening-text");
      setIsComplete(false);
      hasCompletedRef.current = false;
      setCrawlStarted(false);
      animationStartedRef.current = false;
      currentProgressRef.current = 0;
      startTimeRef.current = null;
      totalPausedTimeRef.current = 0;
      pauseStartTimeRef.current = null;
      controls.set({ y: CRAWL_CONSTANTS.CRAWL_START_POSITION, opacity: 1 });
      previousCrawlDataRef.current = crawlData;
    }
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

  // Reset the flag when playback stops or when controls auto-hide
  // Also initialize flag based on initial controls visibility
  useEffect(() => {
    if (!isPlaying) {
      controlsShownOnceRef.current = false;
      return;
    }
    // If controls are visible when playback starts, mark as shown so taps immediately work
    if (controlsVisible && !controlsShownOnceRef.current) {
      controlsShownOnceRef.current = true;
    }
    // Reset flag when controls auto-hide (like YouTube - next tap will be "first tap" again)
    if (!controlsVisible) {
      controlsShownOnceRef.current = false;
    }
  }, [isPlaying, controlsVisible]);

  // Helper function to check if target is an interactive element
  const isInteractiveElement = (target: HTMLElement): boolean => {
    return !!(
      target.closest("button") ||
      target.closest('[role="button"]') ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest('[role="slider"]') ||
      target.closest("[data-controls-area]")
    );
  };

  // Handle interaction (touch or click) to toggle pause/play
  const handleInteraction = useCallback(
    (e: TouchEvent | MouseEvent, isTouch: boolean) => {
      if (!isPlaying) return;
      const target = e.target as HTMLElement;

      // Ignore interactions on controls or interactive elements
      if (isInteractiveElement(target)) {
        return;
      }

      if (isTouch) {
        // Prevent synthetic click and double-firing on mobile
        e.preventDefault();
      }

      // Show controls
      onControlsVisibilityChange?.(true);

      // On mobile: first tap only shows controls, subsequent taps toggle pause/play
      // On desktop: always toggle pause/play immediately
      if (isTouch) {
        const isFirstTap = !controlsShownOnceRef.current;
        if (isFirstTap) {
          controlsShownOnceRef.current = true;
          return; // First tap - only show controls
        }
      }

      // Toggle pause/play
      if (isPaused) {
        onResume?.();
      } else {
        onPause?.();
      }
    },
    [isPlaying, isPaused, onPause, onResume, onControlsVisibilityChange]
  );

  // Global touch handler (capture) for mobile
  useEffect(() => {
    const handleTouchStartCapture = (e: TouchEvent) => {
      handleInteraction(e, true);
    };
    document.addEventListener("touchstart", handleTouchStartCapture, {
      capture: true,
      passive: false,
    });
    return () => {
      document.removeEventListener("touchstart", handleTouchStartCapture, {
        capture: true,
      } as any);
    };
  }, [handleInteraction]);

  // Global click handler for desktop
  useEffect(() => {
    const handleClickCapture = (e: MouseEvent) => {
      // Only handle clicks on desktop (not touch devices to avoid double-firing)
      if (window.matchMedia("(pointer: fine)").matches) {
        handleInteraction(e, false);
      }
    };
    document.addEventListener("click", handleClickCapture, {
      capture: true,
    });
    return () => {
      document.removeEventListener("click", handleClickCapture, {
        capture: true,
      } as any);
    };
  }, [handleInteraction]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering click-to-pause
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-10 overflow-hidden cursor-pointer"
      style={{
        perspective: CRAWL_CONSTANTS.PERSPECTIVE,
        perspectiveOrigin: "50% 50%",
        touchAction: "manipulation",
      }}
      aria-live="polite"
      aria-label="Opening crawl animation"
    >
      {/* Close Button */}
      {onClose && (
        <Button
          onClick={handleClose}
          className={`fixed top-4 left-4 sm:left-auto sm:right-4 z-50 h-12 w-12 min-h-[44px] min-w-[44px] border-2 border-crawl-yellow/50 bg-black/90 p-0 text-crawl-yellow/90 backdrop-blur-md transition-all duration-300 hover:border-crawl-yellow hover:bg-crawl-yellow/15 hover:text-crawl-yellow active:scale-95 focus-visible:ring-2 focus-visible:ring-crawl-yellow shadow-lg shadow-black/50 touch-manipulation ${
            controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ touchAction: "manipulation" }}
          aria-label="Close crawl and return to form"
          title="Close (Esc)"
        >
          <X className="size-6" />
        </Button>
      )}

      <FadeMask position="top" />
      <FadeMask position="bottom" />

      {/* Opening Text - Blue static text */}
      {phase === "opening-text" && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-start md:justify-center px-4 md:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p
            className="font-opening-text text-left md:text-center text-3xl md:text-4xl lg:text-5xl"
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

      {/* Logo Animation - appears instantly, shrinks and recedes into distance */}
      {phase === "logo" && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ scale: 3.5, opacity: 1, y: 0 }}
          animate={{
            scale: 0.1,
            y: -150,
            opacity: 0,
          }}
          transition={{
            duration: logoDuration,
            ease: [0.25, 0.1, 0.25, 1],
            opacity: {
              duration: logoDuration * 0.5,
              delay: logoDuration * 0.5,
              ease: "easeIn",
            },
          }}
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
        >
          <div
            className="font-logo-hollow text-crawl-yellow"
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
            className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
            animate={controls}
            initial={{ y: CRAWL_CONSTANTS.CRAWL_START_POSITION, opacity: 1 }}
            style={{
              willChange: "transform, opacity",
              maxWidth: "min(90vw, 1200px)", // Wider on large screens, responsive on mobile
            }}
          >
            <div
              className="space-y-6 font-crawl text-crawl-yellow"
              style={{
                fontSize: CRAWL_CONSTANTS.FONT_SIZE_BASE,
                lineHeight: CRAWL_CONSTANTS.LINE_HEIGHT,
                letterSpacing: CRAWL_CONSTANTS.LETTER_SPACING,
              }}
            >
              {/* Episode Number - Centered */}
              {crawlData.episodeNumber && (
                <div
                  style={{
                    fontSize: CRAWL_CONSTANTS.FONT_SIZE_EPISODE,
                    marginBottom: CRAWL_CONSTANTS.PARAGRAPH_SPACING,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  EPISODE {crawlData.episodeNumber}
                </div>
              )}

              {/* Episode Subtitle - Centered */}
              {crawlData.episodeSubtitle && (
                <div
                  style={{
                    fontSize: CRAWL_CONSTANTS.FONT_SIZE_TITLE,
                    marginBottom: CRAWL_CONSTANTS.PARAGRAPH_SPACING,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {crawlData.episodeSubtitle}
                </div>
              )}

              {/* Crawl Text Paragraphs - Justified (like classic opening crawls) */}
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  style={{
                    marginBottom: CRAWL_CONSTANTS.PARAGRAPH_SPACING,
                    textAlign: "justify",
                    textAlignLast: "left", // Last line left-aligned (matches original)
                    hyphens: "auto", // Enable hyphenation for better justification
                    WebkitHyphens: "auto",
                    msHyphens: "auto",
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
