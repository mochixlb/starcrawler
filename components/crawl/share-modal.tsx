"use client";

import { useState, useEffect, useRef } from "react";
import { X, Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard, encodeCrawlData } from "@/lib/utils";
import { UI_CONSTANTS } from "@/lib/constants";
import type { CrawlData } from "@/lib/types";

interface ShareModalProps {
  crawlData: CrawlData;
  isOpen: boolean;
  onClose: () => void;
}

interface ShareOption {
  name: string;
  icon: React.ReactNode;
  url: (shareUrl: string) => string;
}

const SHARE_OPTIONS: ShareOption[] = [
  {
    name: "Twitter",
    icon: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    url: (shareUrl) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
  },
  {
    name: "Facebook",
    icon: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    url: (shareUrl) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
  },
  {
    name: "WhatsApp",
    icon: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
    url: (shareUrl) => `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
  },
  {
    name: "Email",
    icon: (
      <svg
        className="size-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    url: (shareUrl) =>
      `mailto:?subject=${encodeURIComponent(
        "Check out this Star Crawl"
      )}&body=${encodeURIComponent(shareUrl)}`,
  },
];

export function ShareModal({ crawlData, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [canUseWebShare, setCanUseWebShare] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCanUseWebShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && urlInputRef.current) {
      setTimeout(() => {
        urlInputRef.current?.select();
      }, 100);
    }
  }, [isOpen]);

  const shareUrl = (() => {
    const encoded = encodeCrawlData(crawlData);
    return `${window.location.origin}${window.location.pathname}?crawl=${encoded}`;
  })();

  const handleWebShare = async () => {
    if (!canUseWebShare) return;

    const shareData = {
      title: "Star Crawl",
      text: "Check out this Star Crawl",
      url: shareUrl,
    };

    // Check if data can be shared before attempting
    if (navigator.canShare && !navigator.canShare(shareData)) {
      return;
    }

    try {
      await navigator.share(shareData);
      onClose();
    } catch (error) {
      // User cancelled or error occurred - only log non-user cancellations
      if ((error as Error).name !== "AbortError") {
        console.error("Error sharing:", error);
      }
    }
  };

  const handleSocialShare = (option: ShareOption) => {
    const url = option.url(shareUrl);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), UI_CONSTANTS.COPY_FEEDBACK_DURATION);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg border-2 border-crawl-yellow/40 bg-black/95 p-8 shadow-xl backdrop-blur-md"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b border-crawl-yellow/20 pb-4">
          <h2
            id="share-modal-title"
            className="font-crawl text-2xl font-bold uppercase tracking-wider text-crawl-yellow"
            style={{ letterSpacing: "0.1em" }}
          >
            Share
          </h2>
          <Button
            onClick={onClose}
            className="h-8 w-8 border-0 bg-transparent p-0 text-crawl-yellow/80 hover:bg-crawl-yellow/10 hover:text-crawl-yellow focus-visible:ring-2 focus-visible:ring-crawl-yellow transition-colors"
            aria-label="Close share modal"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Web Share API (mobile) */}
        {canUseWebShare && (
          <div className="mb-8">
            <Button
              onClick={handleWebShare}
              className="w-full border-2 border-crawl-yellow/40 bg-transparent py-3 font-crawl uppercase tracking-wider text-crawl-yellow transition-all hover:border-crawl-yellow hover:bg-crawl-yellow/10 focus-visible:ring-2 focus-visible:ring-crawl-yellow"
              style={{ letterSpacing: "0.1em" }}
            >
              <Share2 className="mr-2 size-5" />
              Share via...
            </Button>
          </div>
        )}

        {/* Social Share Options */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-3">
            {SHARE_OPTIONS.map((option) => (
              <button
                key={option.name}
                onClick={() => handleSocialShare(option)}
                className="group flex flex-col items-center gap-2 border-2 border-crawl-yellow/20 bg-transparent p-4 text-crawl-yellow/80 transition-all hover:border-crawl-yellow/60 hover:bg-crawl-yellow/5 hover:text-crawl-yellow cursor-pointer focus:outline-none focus:ring-2 focus:ring-crawl-yellow focus:ring-offset-2 focus:ring-offset-black"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                }}
                aria-label={`Share on ${option.name}`}
                title={option.name}
              >
                <div>{option.icon}</div>
                <span
                  className="text-xs font-crawl font-bold uppercase tracking-wider"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* URL Copy Section */}
        <div>
          <label
            className="mb-2 block font-crawl text-sm font-bold uppercase tracking-wider text-crawl-yellow/80"
            style={{ letterSpacing: "0.1em" }}
          >
            Link
          </label>
          <div className="flex gap-2">
            <input
              ref={urlInputRef}
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 border-2 border-crawl-yellow/20 bg-black/50 px-4 py-2.5 font-opening-text text-sm text-crawl-yellow/90 focus:border-crawl-yellow/50 focus:outline-none focus:ring-2 focus:ring-crawl-yellow/50 focus:ring-offset-2 focus:ring-offset-black transition-colors"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
              aria-label="Share URL"
            />
            <Button
              onClick={handleCopyUrl}
              className={`w-28 border-2 px-4 py-2.5 font-crawl text-sm font-bold uppercase tracking-wider transition-colors focus-visible:ring-2 focus-visible:ring-crawl-yellow ${
                copied
                  ? "border-crawl-yellow bg-crawl-yellow text-black hover:bg-crawl-yellow/90"
                  : "border-crawl-yellow/40 bg-crawl-yellow/10 text-crawl-yellow hover:bg-crawl-yellow/20 hover:border-crawl-yellow/60"
              }`}
              style={{
                letterSpacing: "0.1em",
                clipPath:
                  "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
              aria-label={copied ? "URL copied!" : "Copy URL"}
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 size-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 size-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
