// Hook exports
export { useAnimationDurations } from "./use-animation-durations";
export { usePlaybackState } from "./use-playback-state";
export { useAnimationPhases } from "./use-animation-phases";
export { useCrawlAnimation, calculateOpacity, calculateYPosition } from "./use-crawl-animation";
export { useProgressTracking } from "./use-progress-tracking";
export { useSeek } from "./use-seek";
export { useInteractionHandlers } from "./use-interaction-handlers";

// Type exports
export type {
  AnimationControls,
  AnimationPhase,
  AnimationDurations,
  TimingState,
  ProgressInfo,
  PlaybackState,
  PlaybackAction,
  TimingRefs,
  CrawlAnimationConfig,
  OpeningTextPhaseProps,
  LogoPhaseProps,
  CrawlTextPhaseProps,
  SeekTarget,
} from "./types";

