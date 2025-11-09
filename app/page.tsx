"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RotateCcw, Square } from "lucide-react";
import { Starfield } from "@/components/crawl/starfield";
import { CrawlInput } from "@/components/crawl/crawl-input";
import { CrawlDisplay } from "@/components/crawl/crawl-display";
import { ShareButton } from "@/components/crawl/share-button";
import { Button } from "@/components/ui/button";
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
  const [isPlaying, setIsPlaying] = useState(!!initialCrawlData);
  const [lastEncodedUrl, setLastEncodedUrl] = useState<string | null>(initialEncoded);

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
    // Update URL with encoded crawl data
    const encoded = encodeCrawlData(data);
    setLastEncodedUrl(encoded);
    router.replace(`/?crawl=${encoded}`, { scroll: false });
  };

  // Handle animation completion
  const handleComplete = () => {
    setIsPlaying(false);
  };

  // Reset to input form
  const handleReset = () => {
    setCrawlData(null);
    setIsPlaying(false);
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
            crawlData={crawlData}
            isPlaying={isPlaying}
            onComplete={handleComplete}
          />
        )}

        {/* Controls overlay when crawl is playing */}
        {isPlaying && crawlData && (
          <div className="fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
            <ShareButton crawlData={crawlData} />
            <Button
              onClick={handleComplete}
              className="h-auto inline-flex items-center gap-2 rounded-md border border-crawl-yellow/50 bg-black/80 px-5 py-2.5 text-sm font-medium text-crawl-yellow backdrop-blur-sm transition-colors hover:border-crawl-yellow hover:bg-black/90"
              aria-label="Stop crawl animation"
            >
              <Square className="size-4 fill-current" />
              Stop
            </Button>
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
