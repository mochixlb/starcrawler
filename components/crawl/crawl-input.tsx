"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormInput } from "@/components/ui/form-input";
import { FORM_CONSTANTS } from "@/lib/constants";
import { validateCrawlText } from "@/lib/validation";
import type { CrawlInputProps } from "@/lib/types";

const DEFAULT_OPENING_TEXT = "A long time ago in a galaxy far, far away....";
const DEFAULT_LOGO_TEXT = "STAR CRAWLER";

export function CrawlInput({ onSubmit, initialData }: CrawlInputProps) {
  const [openingText, setOpeningText] = useState(
    initialData?.openingText || DEFAULT_OPENING_TEXT
  );
  const [logoText, setLogoText] = useState(
    initialData?.logoText || DEFAULT_LOGO_TEXT
  );
  const [episodeNumber, setEpisodeNumber] = useState(
    initialData?.episodeNumber || ""
  );
  const [episodeSubtitle, setEpisodeSubtitle] = useState(
    initialData?.episodeSubtitle || ""
  );
  const [crawlText, setCrawlText] = useState(initialData?.crawlText || "");
  const [error, setError] = useState<string | null>(null);

  // Calculate character count for crawl text
  const crawlTextLength = crawlText.length;
  const isCrawlOverLimit = crawlTextLength > FORM_CONSTANTS.MAX_MESSAGE_LENGTH;
  const isCrawlUnderLimit = crawlTextLength < FORM_CONSTANTS.MIN_MESSAGE_LENGTH;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedCrawlText = crawlText.trim();
    const validation = validateCrawlText(trimmedCrawlText);

    if (!validation.isValid) {
      setError(validation.error || "Invalid crawl text");
      return;
    }

    // Submit valid data
    onSubmit({
      openingText: openingText.trim() || DEFAULT_OPENING_TEXT,
      logoText: logoText.trim().toUpperCase() || DEFAULT_LOGO_TEXT,
      episodeNumber: episodeNumber.trim().toUpperCase(),
      episodeSubtitle: episodeSubtitle.trim().toUpperCase(),
      crawlText: trimmedCrawlText,
    });
  };

  // Handle input changes
  const handleCrawlTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCrawlText(e.target.value);
    if (error) {
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3">
      {/* Opening Text Input */}
      <FormInput
        id="opening-text"
        label="Opening Text"
        labelColor="cyan"
        type="text"
        value={openingText}
        onChange={(e) => setOpeningText(e.target.value)}
        placeholder={DEFAULT_OPENING_TEXT}
      />

      {/* Logo Text Input */}
      <FormInput
        id="logo-text"
        label="Logo Text"
        type="text"
        value={logoText}
        onChange={(e) => setLogoText(e.target.value)}
        placeholder={DEFAULT_LOGO_TEXT}
      />

      {/* Episode Number and Subtitle */}
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          id="episode-number"
          label="Episode Number"
          type="text"
          value={episodeNumber}
          onChange={(e) => setEpisodeNumber(e.target.value)}
          placeholder="IV"
        />
        <FormInput
          id="episode-subtitle"
          label="Episode Subtitle"
          type="text"
          value={episodeSubtitle}
          onChange={(e) => setEpisodeSubtitle(e.target.value)}
          placeholder="A New Hope"
        />
      </div>

      {/* Crawl Text Input */}
      <div className="space-y-1">
        <label
          htmlFor="crawl-text"
          className="text-xs font-medium text-crawl-yellow sm:text-sm"
        >
          Crawl Text
        </label>
        <Textarea
          id="crawl-text"
          value={crawlText}
          onChange={handleCrawlTextChange}
          placeholder="It is a period of civil war..."
          className="min-h-[120px] border-crawl-yellow/30 bg-black text-sm text-white placeholder:text-gray-400 focus:border-crawl-yellow focus:ring-crawl-yellow sm:min-h-[140px]"
          aria-describedby="crawl-help crawl-error"
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p
              id="crawl-help"
              className={`text-[10px] sm:text-xs ${
                isCrawlOverLimit
                  ? "text-red-500"
                  : isCrawlUnderLimit
                    ? "text-yellow-500"
                    : "text-gray-300"
              }`}
            >
              {crawlTextLength} / {FORM_CONSTANTS.MAX_MESSAGE_LENGTH} characters
            </p>
            {error && (
              <p
                id="crawl-error"
                className="text-[10px] text-red-500 sm:text-xs"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="mt-6 w-full bg-crawl-yellow py-2.5 text-sm font-bold text-black transition-colors hover:bg-crawl-yellow/90 sm:py-3 sm:text-base"
        disabled={isCrawlOverLimit || !crawlText.trim()}
      >
        <Play className="size-4 fill-current" />
        Play Crawl
      </Button>
    </form>
  );
}
