"use client";

import { useState, useEffect, useRef } from "react";
import * as Slider from "@radix-ui/react-slider";
import {
  Play,
  Pause,
  Share2,
  Check,
  Maximize,
  Minimize,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard, formatTime, buildCrawlText } from "@/lib/utils";
import { UI_CONSTANTS } from "@/lib/constants";
import type { CrawlData } from "@/lib/types";
import { ShareModal } from "./share-modal";

export interface CrawlControlsProps {
  isPaused: boolean;
  crawlData: CrawlData;
  progress: number; // 0-1
  elapsed: number; // seconds
  remaining: number; // seconds
  isFullscreen: boolean;
  onPause: () => void;
  onResume: () => void;
  onSeek: (progress: number) => void;
  onToggleFullscreen: () => void;
  controlsVisible?: boolean;
  onControlsVisibilityChange?: (visible: boolean) => void;
}

// Reusable hook for copy feedback
function useCopyFeedback() {
  const [copied, setCopied] = useState(false);

  const showFeedback = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), UI_CONSTANTS.COPY_FEEDBACK_DURATION);
  };

  return { copied, showFeedback };
}

// Icon button component
interface IconButtonProps {
  onClick: () => void;
  ariaLabel: string;
  title: string;
  icon: React.ReactNode;
  className?: string;
}

function IconButton({
  onClick,
  ariaLabel,
  title,
  icon,
  className = "",
}: IconButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`h-10 w-10 border-0 bg-transparent p-0 text-crawl-yellow hover:bg-crawl-yellow/10 focus-visible:ring-2 focus-visible:ring-crawl-yellow touch-manipulation cursor-pointer transition-colors ${className}`}
      aria-label={ariaLabel}
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

function CopyButton({
  onClick,
  copied,
  label,
  icon,
  title,
  className = "",
}: CopyButtonProps & { className?: string }) {
  return (
    <Button
      onClick={onClick}
      className={`h-10 w-28 border-0 bg-transparent px-3 py-0 font-crawl text-xs font-bold uppercase tracking-wider text-crawl-yellow hover:bg-crawl-yellow/10 active:bg-crawl-yellow/20 focus-visible:ring-2 focus-visible:ring-crawl-yellow touch-manipulation overflow-hidden transition-colors ${className}`}
      style={{
        letterSpacing: "0.05em",
      }}
      aria-label={copied ? `${label} copied!` : `Copy ${label.toLowerCase()}`}
      title={title}
    >
      <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
        {copied ? (
          <>
            <Check className="size-3.5 shrink-0" />
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

export function CrawlControls({
  isPaused,
  crawlData,
  progress,
  elapsed,
  remaining,
  isFullscreen,
  onPause,
  onResume,
  onSeek,
  onToggleFullscreen,
  controlsVisible: externalVisible,
  onControlsVisibilityChange,
}: CrawlControlsProps) {
  const { copied: copiedText, showFeedback: showTextFeedback } =
    useCopyFeedback();
  const [internalVisible, setInternalVisible] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);

  // Use external visibility if provided, otherwise use internal state
  const isVisible =
    externalVisible !== undefined ? externalVisible : internalVisible;
  const setIsVisible = onControlsVisibilityChange || setInternalVisible;

  // Auto-hide controls on mouse movement (YouTube-like)
  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);

      // Clear existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Hide after 3 seconds of inactivity
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    // Show controls initially, then hide after 3 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      clearTimeout(initialTimeout);
    };
  }, [setIsVisible]);

  const handleShare = () => {
    setIsShareModalOpen(true);
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
    pendingSeekRef.current = newProgress;

    if (!isDraggingRef.current) {
      onSeek(newProgress);
      pendingSeekRef.current = null;
    }
  };

  const handleSliderValueCommit = (values: number[]) => {
    const finalProgress = values[0] ?? 0;
    onSeek(finalProgress);
    pendingSeekRef.current = null;
    isDraggingRef.current = false;
  };

  const handleSliderMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleSliderMouseUp = () => {
    if (isDraggingRef.current) {
      if (pendingSeekRef.current !== null) {
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
        onSeek(pendingSeekRef.current);
        pendingSeekRef.current = null;
      }
    }
    isDraggingRef.current = false;
  };

  const totalTime = elapsed + remaining;
  const timeDisplay = (
    <div
      className="flex items-center gap-1 font-opening-text text-xs font-medium text-crawl-yellow whitespace-nowrap"
      style={{ letterSpacing: "0.05em" }}
    >
      <span className="truncate">{formatTime(elapsed)}</span>
      <span className="text-crawl-yellow/60 shrink-0">/</span>
      <span className="truncate">{formatTime(totalTime)}</span>
    </div>
  );

  return (
    <>
      {/* Centered Play Button (Mobile Only) */}
      <div
        className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 pointer-events-none sm:hidden ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={isPaused ? onResume : onPause}
          className="pointer-events-auto flex h-24 w-24 items-center justify-center bg-transparent p-0 text-crawl-yellow transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crawl-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-black touch-manipulation cursor-pointer"
          aria-label={isPaused ? "Resume crawl" : "Pause crawl"}
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? (
            <Play className="size-16 fill-current" />
          ) : (
            <Pause className="size-16 fill-current" />
          )}
        </button>
      </div>

      {/* Bottom Controls */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onMouseEnter={() => {
          setIsVisible(true);
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
          }
        }}
        onMouseLeave={() => {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
          }
          hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, 1000);
        }}
        onTouchStart={() => {
          setIsVisible(true);
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
          }
        }}
        style={{
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <div className="w-full bg-gradient-to-t from-black/90 via-black/80 to-transparent pb-4 pt-8">
          {/* Progress Bar */}
          <div className="mb-3 px-4">
            <Slider.Root
              className="relative flex h-5 w-full touch-none select-none items-center cursor-pointer"
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
              <Slider.Track
                className="relative h-2 w-full grow bg-crawl-yellow/20 cursor-pointer"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))",
                }}
              >
                <Slider.Range
                  className="absolute h-full bg-crawl-yellow"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))",
                  }}
                />
              </Slider.Track>
              <Slider.Thumb
                className="block h-5 w-5 border-2 border-crawl-yellow bg-crawl-yellow shadow-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-crawl-yellow focus:ring-offset-2 focus:ring-offset-black touch-manipulation cursor-pointer"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))",
                }}
                aria-label="Crawl progress slider"
              />
            </Slider.Root>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between px-4">
            {/* Left: Play button and Timer (Desktop) / Timer only (Mobile) */}
            <div className="flex items-center gap-3">
              {/* Desktop: Show play button */}
              <div className="hidden sm:flex">
                <IconButton
                  onClick={isPaused ? onResume : onPause}
                  ariaLabel={isPaused ? "Resume crawl" : "Pause crawl"}
                  title={isPaused ? "Resume (Space)" : "Pause (Space)"}
                  icon={
                    isPaused ? (
                      <Play className="size-5 fill-current" />
                    ) : (
                      <Pause className="size-5 fill-current" />
                    )
                  }
                />
              </div>
              {timeDisplay}
            </div>

            {/* Right: Copy text, Share, Fullscreen */}
            <div className="flex items-center gap-2">
              {/* Hide Copy Text button on mobile to save space */}
              <CopyButton
                onClick={handleCopyText}
                copied={copiedText}
                label="Copy Text"
                icon={<Copy className="size-3.5 shrink-0" />}
                title="Copy text"
                className="hidden sm:flex"
              />
              <IconButton
                onClick={handleShare}
                ariaLabel="Share"
                title="Share"
                icon={<Share2 className="size-5" />}
              />
              <IconButton
                onClick={onToggleFullscreen}
                ariaLabel={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
                title={
                  isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"
                }
                icon={
                  isFullscreen ? (
                    <Minimize className="size-5" />
                  ) : (
                    <Maximize className="size-5" />
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        crawlData={crawlData}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
}
