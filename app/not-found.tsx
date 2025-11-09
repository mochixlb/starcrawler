import Link from "next/link";
import { Home } from "lucide-react";
import { Starfield } from "@/components/crawl/starfield";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col bg-crawl-black">
      <Starfield />

      <div className="relative z-20 flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl space-y-8 text-center">
          {/* 404 Title */}
          <div className="space-y-5">
            <h1
              className="font-logo text-7xl font-bold uppercase tracking-wider text-crawl-yellow sm:text-8xl md:text-9xl"
              style={{ letterSpacing: "0.15em" }}
            >
              404
            </h1>
            <h2
              className="font-opening-text text-2xl font-bold uppercase tracking-wider text-crawl-yellow sm:text-3xl md:text-4xl"
              style={{ letterSpacing: "0.1em" }}
            >
              PAGE NOT FOUND
            </h2>
          </div>

          {/* Message */}
          <div
            className="mx-auto max-w-lg rounded-md border-2 border-crawl-yellow/40 bg-black/80 px-6 py-5 backdrop-blur-sm shadow-lg shadow-black/50"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            }}
          >
            <p
              className="font-opening-text text-sm text-gray-300 sm:text-base leading-relaxed"
              style={{ letterSpacing: "0.05em" }}
            >
              The coordinates you&apos;ve entered don&apos;t match any known location in this system. The page may have been moved to a different sector, or perhaps it never existed at all.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 border-2 border-crawl-yellow/40 bg-black/80 px-6 py-3.5 font-crawl text-sm font-bold uppercase tracking-wider text-crawl-yellow backdrop-blur-sm transition-all duration-200 hover:border-crawl-yellow hover:bg-crawl-yellow/10 touch-manipulation cursor-pointer min-h-[44px] shadow-lg shadow-black/30"
              style={{
                letterSpacing: "0.1em",
                clipPath:
                  "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                touchAction: "manipulation",
              }}
            >
              <Home className="size-4 shrink-0" />
              <span>Return Home</span>
            </Link>
          </div>

          {/* Help Text */}
          <p
            className="font-opening-text text-xs text-gray-400 sm:text-sm"
            style={{ letterSpacing: "0.05em" }}
          >
            Navigate back to the main system to continue your journey.
          </p>
        </div>
      </div>
    </main>
  );
}

