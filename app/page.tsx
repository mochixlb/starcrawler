"use client";

import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Starfield } from "@/components/crawl/starfield";
import { CrawlInput } from "@/components/crawl/crawl-input";
import { CrawlDisplay } from "@/components/crawl/crawl-display";
import { CrawlControls } from "@/components/crawl/crawl-controls";
import { ShareButton } from "@/components/crawl/share-button";
import type { CrawlData } from "@/lib/types";
import { decodeCrawlData, encodeCrawlData } from "@/lib/utils";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize state immediately from URL to prevent flash
  const initialEncoded = searchParams.get("crawl");
  const initialCrawlData = useMemo(() => {
    if (initialEncoded) {
      return decodeCrawlData(initialEncoded);
    }
    return null;
  }, [initialEncoded]);
  
  const [crawlData, setCrawlData] = useState<CrawlData | null>(initialCrawlData);
  const [isPlaying, setIsPlaying] = useState(!!initialEncoded);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [replayKey, setReplayKey] = useState(0);
  const [lastEncodedUrl, setLastEncodedUrl] = useState<string | null>(initialEncoded);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [seekTo, setSeekTo] = useState<number | undefined>(undefined);

  // Update crawl data when URL changes
  useEffect(() => {
    const encoded = searchParams.get("crawl");
    
    // Only reload if URL param changed
    if (encoded === lastEncodedUrl) return;
    
    if (encoded) {
      const decoded = decodeCrawlData(encoded);
      if (decoded) {
        setCrawlData(decoded);
        setLastEncodedUrl(encoded);
        // Auto-play when loaded from shared link
        setIsPlaying(true);
        setIsPaused(false);
        setSpeed(1.0);
      }
    } else {
      // No crawl param - clear data if it was previously loaded from URL
      if (lastEncodedUrl !== null) {
        setCrawlData(null);
        setIsPlaying(false);
        setLastEncodedUrl(null);
      }
    }
  }, [searchParams, lastEncodedUrl]);

  // Handle form submission
  const handleSubmit = (data: CrawlData) => {
    setCrawlData(data);
    setIsPlaying(true);
    setIsPaused(false);
    setSpeed(1.0);
    // Update URL with encoded crawl data
    const encoded = encodeCrawlData(data);
    setLastEncodedUrl(encoded);
    router.replace(`/?crawl=${encoded}`, { scroll: false });
  };

  // Handle animation completion
  const handleComplete = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setSpeed(1.0);
  };

  // Handle replay
  const handleReplay = useCallback(() => {
    if (crawlData) {
      // Reset animation by incrementing replay key to force remount
      setIsPlaying(false);
      setIsPaused(false);
      setSpeed(1.0);
      setReplayKey((prev) => prev + 1);
      
      // Restart after a brief delay to ensure reset completes
      setTimeout(() => {
        setIsPlaying(true);
      }, 50);
    }
  }, [crawlData]);

  // Handle stop
  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setSpeed(1.0);
  }, []);

  // Handle pause/resume
  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Handle speed change
  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  // Handle progress updates from CrawlDisplay
  const handleProgressChange = useCallback((newProgress: number, newElapsed: number, newRemaining: number) => {
    setProgress(newProgress);
    setElapsed(newElapsed);
    setRemaining(newRemaining);
  }, []);

  // Handle seeking
  const handleSeek = useCallback((newProgress: number) => {
    setSeekTo(newProgress);
    // Clear seekTo after a brief moment to allow re-seeking
    setTimeout(() => setSeekTo(undefined), 100);
  }, []);

  // Handle loop toggle
  const handleToggleLoop = useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

  // Handle fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fallback for browsers that don't support fullscreen
        console.warn("Fullscreen not supported");
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    if (!isPlaying || !crawlData) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (isPaused) {
            handleResume();
          } else {
            handlePause();
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          // Seek backward 5 seconds
          const backwardProgress = Math.max(0, progress - 5 / (elapsed + remaining));
          handleSeek(backwardProgress);
          break;
        case "ArrowRight":
          e.preventDefault();
          // Seek forward 5 seconds
          const forwardProgress = Math.min(1, progress + 5 / (elapsed + remaining));
          handleSeek(forwardProgress);
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleReplay();
          break;
        case "f":
        case "F":
          e.preventDefault();
          handleToggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, crawlData, isPaused, progress, elapsed, remaining, handlePause, handleResume, handleReplay, handleToggleFullscreen, handleSeek]);

  // Reset to input form
  const handleReset = () => {
    setCrawlData(null);
    setIsPlaying(false);
    setIsPaused(false);
    setSpeed(1.0);
    setProgress(0);
    setElapsed(0);
    setRemaining(0);
    setIsLooping(false);
    setIsFullscreen(false);
    setSeekTo(undefined);
    // Clear URL params
    router.replace("/", { scroll: false });
  };

  return (
    <main className="relative min-h-screen bg-crawl-black">
      {/* Starfield background */}
      <Starfield />

      {/* Main content */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
        {!crawlData || !isPlaying ? (
          <div className="w-full max-w-2xl space-y-4">
            <div className="text-center">
              <h1 className="mb-2 font-crawl text-3xl font-bold text-crawl-yellow sm:text-4xl md:text-5xl">
                STAR CRAWLER
              </h1>
              <p className="text-sm text-gray-200 sm:text-base">
                Create and share your own opening crawl
              </p>
            </div>

            <CrawlInput
              onSubmit={handleSubmit}
              initialData={crawlData || undefined}
            />

            {crawlData && !isPlaying && (
              <div className="mt-6 flex justify-center gap-3">
                <ShareButton crawlData={crawlData} />
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-md border border-crawl-yellow/50 px-5 py-2.5 text-sm font-medium text-crawl-yellow transition-colors hover:border-crawl-yellow hover:bg-crawl-yellow/10"
                >
                  <RotateCcw className="size-4" />
                  Reset
                </button>
              </div>
            )}
          </div>
        ) : (
          <CrawlDisplay
            key={replayKey}
            crawlData={crawlData}
            isPlaying={isPlaying}
            isPaused={isPaused}
            speed={speed}
            onComplete={handleComplete}
            onProgressChange={handleProgressChange}
            seekTo={seekTo}
            isLooping={isLooping}
          />
        )}

        {/* Controls overlay when crawl is playing */}
        {isPlaying && crawlData && (
          <div className="fixed bottom-4 left-1/2 z-30 w-full max-w-4xl -translate-x-1/2 px-4">
            <CrawlControls
              isPaused={isPaused}
              speed={speed}
              crawlData={crawlData}
              progress={progress}
              elapsed={elapsed}
              remaining={remaining}
              isLooping={isLooping}
              isFullscreen={isFullscreen}
              onPause={handlePause}
              onResume={handleResume}
              onSpeedChange={handleSpeedChange}
              onReplay={handleReplay}
              onStop={handleStop}
              onSeek={handleSeek}
              onToggleLoop={handleToggleLoop}
              onToggleFullscreen={handleToggleFullscreen}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen bg-crawl-black">
        <Starfield />
        <div className="relative z-20 flex min-h-screen flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="mb-2 font-crawl text-3xl font-bold text-crawl-yellow sm:text-4xl md:text-5xl">
              STAR CRAWLER
            </h1>
            <p className="text-sm text-gray-200 sm:text-base">
              Loading...
            </p>
          </div>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
