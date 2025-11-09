"use client";

import { useState, useRef } from "react";
import * as Slider from "@radix-ui/react-slider";
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Share2,
  Check,
  Maximize,
  Minimize,
  Repeat,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  copyToClipboard,
  encodeCrawlData,
  formatTime,
  buildCrawlText,
} from "@/lib/utils";
import { UI_CONSTANTS } from "@/lib/constants";
import type { CrawlData } from "@/lib/types";

export interface CrawlControlsProps {
  isPaused: boolean;
  speed: number;
  crawlData: CrawlData;
  progress: number; // 0-1
  elapsed: number; // seconds
  remaining: number; // seconds
  isLooping: boolean;
  isFullscreen: boolean;
  onPause: () => void;
  onResume: () => void;
  onSpeedChange: (speed: number) => void;
  onReplay: () => void;
  onStop: () => void;
  onSeek: (progress: number) => void;
  onToggleLoop: () => void;
  onToggleFullscreen: () => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

// Reusable hook for copy feedback
function useCopyFeedback() {
  const [copied, setCopied] = useState(false);

  const showFeedback = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), UI_CONSTANTS.COPY_FEEDBACK_DURATION);
  };

  return { copied, showFeedback };
}

// Common button styles
const iconButtonClass =
  "h-11 w-11 min-[768px]:h-9 min-[768px]:w-9 border-0 bg-transparent p-0 text-crawl-yellow hover:bg-crawl-yellow/10 focus-visible:ring-2 focus-visible:ring-crawl-yellow touch-manipulation cursor-pointer";
const iconSizeClass = "size-5 min-[768px]:size-4";

// Icon button component
interface IconButtonProps {
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  ariaLabel: string;
  title: string;
  icon: React.ReactNode;
  className?: string;
  ariaPressed?: boolean;
}

function IconButton({
  onClick,
  onKeyDown,
  ariaLabel,
  title,
  icon,
  className = "",
  ariaPressed,
}: IconButtonProps) {
  return (
    <Button
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`${iconButtonClass} ${className}`}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      title={title}
    >
      {icon}
    </Button>
  );
}

// Copy button component
interface CopyButtonProps {
  onClick: () => void;
  copied: boolean;
  label: string;
  icon: React.ReactNode;
  title: string;
}

function CopyButton({ onClick, copied, label, icon, title }: CopyButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="h-11 min-[768px]:h-9 min-w-14 min-[375px]:min-w-16 min-[768px]:min-w-18 border-0 bg-transparent px-2.5 min-[375px]:px-3 min-[768px]:px-2 py-0 text-[11px] min-[375px]:text-xs min-[768px]:text-xs font-medium text-crawl-yellow hover:bg-crawl-yellow/10 active:bg-crawl-yellow/20 focus-visible:ring-2 focus-visible:ring-crawl-yellow touch-manipulation overflow-hidden transition-colors"
      aria-label={copied ? `${label} copied!` : `Copy ${label.toLowerCase()}`}
      title={title}
    >
      <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
        {copied ? (
          <>
            <Check className="size-3.5 min-[768px]:size-3 shrink-0" />
            <span className="truncate">Copied!</span>
          </>
        ) : (
          <>
            <span className="shrink-0">{icon}</span>
            <span className="truncate">{label}</span>
          </>
        )}
      </span>
    </Button>
  );
}

// Speed button component
interface SpeedButtonProps {
  option: number;
  isActive: boolean;
  onClick: () => void;
}

function SpeedButton({ option, isActive, onClick }: SpeedButtonProps) {
  const baseClass =
    "min-w-[2.5rem] px-2 py-1 text-[11px] font-semibold transition-all first:rounded-l last:rounded-r focus:outline-none focus:ring-2 focus:ring-crawl-yellow focus:ring-offset-2 focus:ring-offset-black whitespace-nowrap overflow-hidden cursor-pointer";
  const activeClass = "bg-crawl-yellow text-black shadow-md";
  const inactiveClass =
    "text-crawl-yellow/60 hover:bg-crawl-yellow/10 hover:text-crawl-yellow";

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
      aria-label={`Set speed to ${option}x`}
      aria-pressed={isActive}
      title={`${option}x speed`}
    >
      <span className="truncate">{option}x</span>
    </button>
  );
}

// Mobile speed button component
function MobileSpeedButton({ option, isActive, onClick }: SpeedButtonProps) {
  const baseClass =
    "h-11 w-full px-0.5 py-0 text-[9px] min-[360px]:text-[10px] font-semibold transition-all rounded focus:outline-none focus:ring-2 focus:ring-crawl-yellow focus:ring-offset-2 focus:ring-offset-black touch-manipulation flex items-center justify-center whitespace-nowrap overflow-hidden cursor-pointer";
  const activeClass = "bg-crawl-yellow text-black shadow-md scale-[1.02]";
  const inactiveClass =
    "text-crawl-yellow/60 active:bg-crawl-yellow/10 active:scale-[0.98]";

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
      aria-label={`Set speed to ${option}x`}
      aria-pressed={isActive}
      title={`${option}x speed`}
    >
      <span className="truncate">{option}x</span>
    </button>
  );
}

export function CrawlControls({
  isPaused,
  speed,
  crawlData,
  progress,
  elapsed,
  remaining,
  isLooping,
  isFullscreen,
  onPause,
  onResume,
  onSpeedChange,
  onReplay,
  onStop,
  onSeek,
  onToggleLoop,
  onToggleFullscreen,
}: CrawlControlsProps) {
  const { copied: copiedLink, showFeedback: showLinkFeedback } =
    useCopyFeedback();
  const { copied: copiedText, showFeedback: showTextFeedback } =
    useCopyFeedback();
  const isDraggingRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const handleShare = async () => {
    const encoded = encodeCrawlData(crawlData);
    const shareUrl = `${window.location.origin}${window.location.pathname}?crawl=${encoded}`;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      showLinkFeedback();
    }
  };

  const handleCopyText = async () => {
    const fullText = buildCrawlText(crawlData);
    const success = await copyToClipboard(fullText);
    if (success) {
      showTextFeedback();
    }
  };

  const handleSliderChange = (values: number[]) => {
    const newProgress = values[0] ?? 0;
    // Store the pending seek value
    pendingSeekRef.current = newProgress;

    // If not dragging, seek immediately (e.g., keyboard navigation)
    if (!isDraggingRef.current) {
      onSeek(newProgress);
      pendingSeekRef.current = null;
    }
    // While dragging, we'll seek on drag end via handleSliderValueCommit or handleSliderMouseUp
  };

  const handleSliderValueCommit = (values: number[]) => {
    // This fires when user releases the slider after dragging (mouse up / touch end)
    // Note: This may not fire on simple clicks, so handleSliderMouseUp handles those cases
    const finalProgress = values[0] ?? 0;

    // Seek to the final value
    onSeek(finalProgress);
    // Clear pending seek to avoid double-seeking in handleSliderMouseUp
    pendingSeekRef.current = null;
    isDraggingRef.current = false;
  };

  // Track drag state
  const handleSliderMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleSliderMouseUp = () => {
    if (isDraggingRef.current) {
      if (pendingSeekRef.current !== null) {
        // Seek to the pending value (whether click or drag)
        onSeek(pendingSeekRef.current);
        pendingSeekRef.current = null;
      }
    }

    isDraggingRef.current = false;
  };

  const handleSliderTouchStart = () => {
    isDraggingRef.current = true;
  };

  const handleSliderTouchEnd = () => {
    if (isDraggingRef.current) {
      if (pendingSeekRef.current !== null) {
        // Seek to the pending value (whether tap or drag)
        onSeek(pendingSeekRef.current);
        pendingSeekRef.current = null;
      }
    }

    isDraggingRef.current = false;
  };

  const totalTime = elapsed + remaining;
  const timeDisplay = (
    <div className="flex items-center gap-0.5 text-[10px] min-[768px]:text-xs font-medium text-crawl-yellow whitespace-nowrap">
      <span className="truncate">{formatTime(elapsed)}</span>
      <span className="text-crawl-yellow/60 shrink-0">/</span>
      <span className="truncate">{formatTime(totalTime)}</span>
    </div>
  );

  return (
    <div className="w-full max-w-4xl rounded-lg border border-crawl-yellow/50 bg-black/80 p-2 min-[768px]:p-3 backdrop-blur-sm">
      {/* Progress Bar */}
      <div className="mb-2 min-[768px]:mb-3">
        <Slider.Root
          className="relative flex h-8 min-[768px]:h-5 w-full touch-none select-none items-center cursor-pointer"
          value={[progress]}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderValueCommit}
          onMouseDown={handleSliderMouseDown}
          onMouseUp={handleSliderMouseUp}
          onMouseLeave={handleSliderMouseUp}
          onTouchStart={handleSliderTouchStart}
          onTouchEnd={handleSliderTouchEnd}
          min={0}
          max={1}
          step={0.001}
          aria-label="Crawl progress"
        >
          <Slider.Track className="relative h-2.5 min-[768px]:h-2 w-full grow rounded-full bg-crawl-yellow/20 cursor-pointer">
            <Slider.Range className="absolute h-full rounded-full bg-crawl-yellow" />
          </Slider.Track>
          <Slider.Thumb
            className="block h-6 w-6 min-[768px]:h-3 min-[768px]:w-3 rounded-full bg-crawl-yellow shadow-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-crawl-yellow focus:ring-offset-2 focus:ring-offset-black touch-manipulation cursor-pointer"
            aria-label="Crawl progress slider"
          />
        </Slider.Root>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between gap-2 min-[768px]:gap-3">
        {/* Playback Controls */}
        <div
          className="flex items-center justify-between min-[768px]:justify-start gap-1.5 min-[768px]:gap-1 min-w-0 shrink-0"
          role="group"
          aria-label="Playback controls"
        >
          <div className="flex items-center gap-1.5 min-[768px]:gap-1 shrink-0">
            <IconButton
              onClick={onReplay}
              onKeyDown={(e) => handleKeyDown(e, onReplay)}
              ariaLabel="Replay crawl"
              title="Replay (R)"
              icon={<RotateCcw className={iconSizeClass} />}
            />

            <IconButton
              onClick={isPaused ? onResume : onPause}
              onKeyDown={(e) => handleKeyDown(e, isPaused ? onResume : onPause)}
              ariaLabel={isPaused ? "Resume crawl" : "Pause crawl"}
              title={isPaused ? "Resume (Space)" : "Pause (Space)"}
              icon={
                isPaused ? (
                  <Play className={`${iconSizeClass} fill-current`} />
                ) : (
                  <Pause className={`${iconSizeClass} fill-current`} />
                )
              }
              ariaPressed={!isPaused}
            />

            <IconButton
              onClick={onStop}
              onKeyDown={(e) => handleKeyDown(e, onStop)}
              ariaLabel="Stop crawl"
              title="Stop"
              icon={<Square className={`${iconSizeClass} fill-current`} />}
            />
          </div>

          {/* Time Display - Mobile */}
          <div className="min-[768px]:hidden">{timeDisplay}</div>
        </div>

        {/* Center - Speed and Time (Desktop) */}
        <div className="hidden min-[768px]:flex flex-1 items-center justify-center gap-3 min-w-0">
          {/* Speed Control */}
          <div
            className="inline-flex items-center gap-px rounded border border-crawl-yellow/20 bg-black/60 p-0.5 shrink-0"
            role="group"
            aria-label="Playback speed"
          >
            {SPEED_OPTIONS.map((option) => (
              <SpeedButton
                key={option}
                option={option}
                isActive={speed === option}
                onClick={() => onSpeedChange(option)}
              />
            ))}
          </div>

          {/* Time Display */}
          <div className="shrink-0 min-w-0">{timeDisplay}</div>
        </div>

        {/* Mobile Speed Row */}
        <div className="flex min-[768px]:hidden items-center justify-center w-full">
          <div
            className="w-full grid grid-cols-6 gap-1.5 min-[360px]:gap-2 rounded-lg border border-crawl-yellow/20 bg-black/60 p-1.5 min-[360px]:p-2"
            role="group"
            aria-label="Playback speed"
          >
            {SPEED_OPTIONS.map((option) => (
              <MobileSpeedButton
                key={option}
                option={option}
                isActive={speed === option}
                onClick={() => onSpeedChange(option)}
              />
            ))}
          </div>
        </div>

        {/* Settings and Share */}
        <div
          className="flex items-center gap-2 min-[375px]:gap-2.5 min-[768px]:gap-1 shrink-0"
          role="group"
          aria-label="Settings controls"
        >
          <IconButton
            onClick={onToggleLoop}
            ariaLabel={isLooping ? "Disable loop" : "Enable loop"}
            title={isLooping ? "Loop enabled" : "Loop disabled"}
            icon={
              <Repeat
                className={`${iconSizeClass} ${
                  isLooping ? "fill-current" : ""
                }`}
              />
            }
            className={isLooping ? "bg-crawl-yellow/10" : ""}
            ariaPressed={isLooping}
          />

          <IconButton
            onClick={onToggleFullscreen}
            ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={
              isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"
            }
            icon={
              isFullscreen ? (
                <Minimize className={iconSizeClass} />
              ) : (
                <Maximize className={iconSizeClass} />
              )
            }
          />

          <div
            className="h-8 min-[768px]:h-6 w-px bg-crawl-yellow/30 mx-0.5 min-[768px]:mx-0"
            aria-hidden="true"
          />

          <CopyButton
            onClick={handleCopyText}
            copied={copiedText}
            label="Copy"
            icon={<Copy className="size-3.5 min-[768px]:size-3 shrink-0" />}
            title="Copy text"
          />

          <CopyButton
            onClick={handleShare}
            copied={copiedLink}
            label="Share"
            icon={<Share2 className="size-3.5 min-[768px]:size-3 shrink-0" />}
            title="Share"
          />
        </div>
      </div>
    </div>
  );
}
