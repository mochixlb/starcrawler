"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "relative z-10 w-full border-t border-crawl-yellow/10 bg-black/40 backdrop-blur-sm",
        className
      )}
    >
      <div className="container mx-auto px-4 py-6 sm:px-6">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-center"
          aria-label="Legal links"
        >
          <Link
            href="/privacy"
            className="cursor-pointer text-xs text-gray-300 transition-colors hover:text-crawl-yellow/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crawl-yellow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-sm"
            style={{ letterSpacing: "0.05em", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" }}
          >
            Privacy Policy
          </Link>
          <span className="hidden text-gray-500 sm:inline" aria-hidden="true">
            •
          </span>
          <Link
            href="/terms"
            className="cursor-pointer text-xs text-gray-300 transition-colors hover:text-crawl-yellow/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crawl-yellow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-sm"
            style={{ letterSpacing: "0.05em", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" }}
          >
            Terms of Service
          </Link>
          <span className="hidden text-gray-500 sm:inline" aria-hidden="true">
            •
          </span>
          <Link
            href="/disclaimer"
            className="cursor-pointer text-xs text-gray-300 transition-colors hover:text-crawl-yellow/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crawl-yellow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-sm"
            style={{ letterSpacing: "0.05em", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" }}
          >
            Disclaimer
          </Link>
          <span className="hidden text-gray-500 sm:inline" aria-hidden="true">
            •
          </span>
          <a
            href="https://github.com/mochixlb/starcrawler"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex basis-full items-center justify-center gap-1.5 cursor-pointer text-xs text-gray-300 transition-colors hover:text-crawl-yellow/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crawl-yellow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:basis-auto sm:text-sm"
            style={{ letterSpacing: "0.05em", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" }}
            aria-label="View Star Crawler on GitHub"
          >
            <Github className="size-3.5" aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </nav>
        <p
          className="mt-4 text-center text-[10px] text-gray-400 sm:text-xs"
          style={{ letterSpacing: "0.05em", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" }}
        >
          © {new Date().getFullYear()} Star Crawler. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

