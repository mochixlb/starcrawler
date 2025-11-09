"use client";

import { useState } from "react";
import { Starfield } from "@/components/crawl/starfield";
import { CrawlInput } from "@/components/crawl/crawl-input";
import { CrawlDisplay } from "@/components/crawl/crawl-display";

export default function Home() {
  const [crawlMessage, setCrawlMessage] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle form submission
  const handleSubmit = (message: string) => {
    setCrawlMessage(message);
    setIsPlaying(true);
  };

  // Handle animation completion
  const handleComplete = () => {
    setIsPlaying(false);
  };

  // Reset to input form
  const handleReset = () => {
    setCrawlMessage("");
    setIsPlaying(false);
  };

  return (
    <main className="relative min-h-screen bg-starwars-black">
      {/* Starfield background */}
      <Starfield />

      {/* Main content */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center p-8">
        {!crawlMessage || !isPlaying ? (
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center">
              <h1 className="mb-4 font-starwars text-5xl font-bold text-starwars-yellow md:text-6xl">
                STAR CRAWLER
              </h1>
              <p className="text-lg text-gray-400">
                Create your own Star Wars opening crawl
              </p>
            </div>

            <CrawlInput onSubmit={handleSubmit} />

            {crawlMessage && !isPlaying && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="rounded-md bg-starwars-yellow px-6 py-2 font-bold text-black hover:bg-starwars-yellow/90"
                >
                  Play Crawl
                </button>
                <button
                  onClick={handleReset}
                  className="ml-4 rounded-md border border-starwars-yellow/50 px-6 py-2 font-medium text-starwars-yellow hover:border-starwars-yellow"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        ) : (
          <CrawlDisplay
            message={crawlMessage}
            isPlaying={isPlaying}
            onComplete={handleComplete}
          />
        )}

        {/* Controls overlay when crawl is playing */}
        {isPlaying && (
          <div className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2">
            <button
              onClick={handleComplete}
              className="rounded-md border border-starwars-yellow/50 bg-black/80 px-6 py-2 font-medium text-starwars-yellow backdrop-blur-sm hover:border-starwars-yellow"
              aria-label="Stop crawl animation"
            >
              Stop
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
