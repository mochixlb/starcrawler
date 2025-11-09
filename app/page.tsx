"use client";

import { useState } from "react";
import { RotateCcw, Square } from "lucide-react";
import { Starfield } from "@/components/crawl/starfield";
import { CrawlInput } from "@/components/crawl/crawl-input";
import { CrawlDisplay } from "@/components/crawl/crawl-display";
import type { CrawlData } from "@/lib/types";

export default function Home() {
  const [crawlData, setCrawlData] = useState<CrawlData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle form submission
  const handleSubmit = (data: CrawlData) => {
    setCrawlData(data);
    setIsPlaying(true);
  };

  // Handle animation completion
  const handleComplete = () => {
    setIsPlaying(false);
  };

  // Reset to input form
  const handleReset = () => {
    setCrawlData(null);
    setIsPlaying(false);
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
                Create your own opening crawl
              </p>
            </div>

            <CrawlInput
              onSubmit={handleSubmit}
              initialData={crawlData || undefined}
            />

            {crawlData && !isPlaying && (
              <div className="mt-6 flex justify-center">
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
            crawlData={crawlData}
            isPlaying={isPlaying}
            onComplete={handleComplete}
          />
        )}

        {/* Controls overlay when crawl is playing */}
        {isPlaying && (
          <div className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2">
            <button
              onClick={handleComplete}
              className="inline-flex items-center gap-2 rounded-md border border-crawl-yellow/50 bg-black/80 px-6 py-2.5 font-medium text-crawl-yellow backdrop-blur-sm transition-colors hover:border-crawl-yellow hover:bg-black/90"
              aria-label="Stop crawl animation"
            >
              <Square className="size-4 fill-current" />
              Stop
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
