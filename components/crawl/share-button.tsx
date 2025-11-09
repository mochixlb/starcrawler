"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard, encodeCrawlData } from "@/lib/utils";
import type { CrawlData } from "@/lib/types";

interface ShareButtonProps {
  crawlData: CrawlData;
}

export function ShareButton({ crawlData }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const encoded = encodeCrawlData(crawlData);
    const shareUrl = `${window.location.origin}${window.location.pathname}?crawl=${encoded}`;

    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="h-auto inline-flex items-center gap-2 rounded-md border border-crawl-yellow/50 bg-black/80 px-5 py-2.5 text-sm font-medium text-crawl-yellow backdrop-blur-sm transition-colors hover:border-crawl-yellow hover:bg-black/90"
      aria-label={copied ? "Link copied!" : "Copy share link"}
    >
      {copied ? (
        <>
          <Check className="size-4" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="size-4" />
          Share
        </>
      )}
    </Button>
  );
}

