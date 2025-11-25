"use client";

import { useEffect, useRef } from "react";
import type { AnimationControls } from "./types";
import { CRAWL_CONSTANTS } from "@/lib/constants";
import type { AnimationDurations, TimingRefs, AnimationPhase, SeekTarget } from "./types";
import { calculateOpacity, calculateYPosition } from "./use-crawl-animation";

interface UseSeekParams {
  seekTo: number | undefined;
  isPlaying: boolean;
  isPaused: boolean;
  durations: AnimationDurations;
  timingRefs: TimingRefs;
  controls: AnimationControls;
  onPhaseChange: (phase: AnimationPhase) => void;
  onStartCrawl: () => void;
  onStartAnimation: () => void;
  onComplete: () => void;
  onResetState: () => void;
}

/**
 * Hook to handle seeking to different positions in the animation
 */
export function useSeek({
  seekTo,
  isPlaying,
  isPaused,
  durations,
  timingRefs,
  controls,
  onPhaseChange,
  onStartCrawl,
  onStartAnimation,
  onComplete,
  onResetState,
}: UseSeekParams): void {
  // Track last processed seek value to prevent infinite loops
  const lastProcessedSeekRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Guard: skip if no seek value, out of range, not playing, or already processed
    if (seekTo === undefined || seekTo < 0 || seekTo > 1 || !isPlaying) {
      lastProcessedSeekRef.current = undefined;
      return;
    }

    // Skip if we already processed this exact seek value
    if (lastProcessedSeekRef.current === seekTo) {
      return;
    }

    // Mark as processed before making changes
    lastProcessedSeekRef.current = seekTo;

    const seekTarget = calculateSeekTarget(seekTo, durations);

    // Reset timing refs for seek
    resetTimingForSeek(timingRefs, seekTarget);

    if (seekTarget.phase === "opening-text") {
      seekToOpeningText(seekTarget, timingRefs, controls, onPhaseChange, onResetState);
    } else if (seekTarget.phase === "logo") {
      seekToLogo(seekTarget, timingRefs, controls, onPhaseChange, onResetState);
    } else {
      seekToCrawl(
        seekTarget,
        isPaused,
        durations,
        timingRefs,
        controls,
        onPhaseChange,
        onStartCrawl,
        onStartAnimation,
        onComplete
      );
    }
  }, [
    seekTo,
    isPlaying,
    isPaused,
    durations,
    timingRefs,
    controls,
    onPhaseChange,
    onStartCrawl,
    onStartAnimation,
    onComplete,
    onResetState,
  ]);
}

/**
 * Calculate which phase and position to seek to
 */
function calculateSeekTarget(seekProgress: number, durations: AnimationDurations): SeekTarget {
  const seekTime = seekProgress * durations.total;

  // Seeking to very start
  if (seekProgress <= 0.001 || seekTime < 0.1) {
    return {
      phase: "opening-text",
      phaseProgress: 0,
      crawlProgress: 0,
      overallTime: 0,
    };
  }

  // Opening text phase
  if (seekTime < durations.openingText) {
    return {
      phase: "opening-text",
      phaseProgress: seekTime / durations.openingText,
      crawlProgress: 0,
      overallTime: seekTime,
    };
  }

  // Logo phase
  if (seekTime < durations.openingText + durations.logo) {
    const logoTime = seekTime - durations.openingText;
    return {
      phase: "logo",
      phaseProgress: logoTime / durations.logo,
      crawlProgress: 0,
      overallTime: seekTime,
    };
  }

  // Crawl phase
  const crawlTime = seekTime - durations.openingText - durations.logo;
  const crawlProgress = Math.max(0, Math.min(1, crawlTime / durations.crawl));
  return {
    phase: "crawl",
    phaseProgress: crawlProgress,
    crawlProgress,
    overallTime: seekTime,
  };
}

/**
 * Reset timing refs for a seek operation
 */
function resetTimingForSeek(timingRefs: TimingRefs, target: SeekTarget): void {
  const now = Date.now();

  // Reset overall timing
  timingRefs.overallStartTime.current = now - target.overallTime * 1000;
  timingRefs.overallPausedTime.current = 0;
  timingRefs.overallPauseStart.current = null;

  // Reset completion guard
  timingRefs.hasCompleted.current = false;
}

function seekToOpeningText(
  target: SeekTarget,
  timingRefs: TimingRefs,
  controls: AnimationControls,
  onPhaseChange: (phase: AnimationPhase) => void,
  onResetState: () => void
): void {
  onResetState();
  onPhaseChange("opening-text");

  // Set phase timing
  timingRefs.phaseStartTime.current = Date.now() - target.phaseProgress * 6 * 1000; // Approximate opening text duration
  timingRefs.phasePausedTime.current = 0;
  timingRefs.phasePauseStart.current = null;

  controls.stop();
  controls.set({ y: CRAWL_CONSTANTS.CRAWL_START_POSITION });
}

function seekToLogo(
  target: SeekTarget,
  timingRefs: TimingRefs,
  controls: AnimationControls,
  onPhaseChange: (phase: AnimationPhase) => void,
  onResetState: () => void
): void {
  onResetState();
  onPhaseChange("logo");

  // Set phase timing
  timingRefs.phaseStartTime.current = Date.now() - target.phaseProgress * 8 * 1000; // Approximate logo duration
  timingRefs.phasePausedTime.current = 0;
  timingRefs.phasePauseStart.current = null;

  controls.stop();
  controls.set({ y: CRAWL_CONSTANTS.CRAWL_START_POSITION });
}

function seekToCrawl(
  target: SeekTarget,
  isPaused: boolean,
  durations: AnimationDurations,
  timingRefs: TimingRefs,
  controls: AnimationControls,
  onPhaseChange: (phase: AnimationPhase) => void,
  onStartCrawl: () => void,
  onStartAnimation: () => void,
  onComplete: () => void
): void {
  onPhaseChange("crawl");
  onStartCrawl();
  onStartAnimation();

  // Set crawl timing
  const crawlElapsed = durations.crawl * target.crawlProgress;
  timingRefs.crawlStartTime.current = Date.now() - crawlElapsed * 1000;
  timingRefs.crawlPausedTime.current = 0;
  timingRefs.crawlPauseStart.current = null;
  timingRefs.currentProgress.current = target.crawlProgress;

  // Phase timing not used in crawl phase
  timingRefs.phaseStartTime.current = null;
  timingRefs.phasePausedTime.current = 0;
  timingRefs.phasePauseStart.current = null;

  // Calculate position and opacity
  const targetY = calculateYPosition(target.crawlProgress);
  const opacity = calculateOpacity(target.crawlProgress);

  controls.set({ y: `${targetY}%`, opacity });

  const remainingDuration = durations.crawl * (1 - target.crawlProgress);

  if (!isPaused) {
    if (remainingDuration <= 0) {
      onComplete();
    } else {
      controls.start({
        y: CRAWL_CONSTANTS.CRAWL_END_POSITION,
        opacity,
        transition: {
          duration: remainingDuration,
          ease: "linear",
        },
      });
    }
  }
}

