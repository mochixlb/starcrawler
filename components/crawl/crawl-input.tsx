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
const DEFAULT_EPISODE_NUMBER = "I";
const DEFAULT_EPISODE_SUBTITLE = "The Quest Begins";
const DEFAULT_CRAWL_TEXT = `It is a period of exploration. Adventurous travelers, journeying from distant worlds, have discovered new realms beyond the known galaxy.

During their travels, these wanderers uncovered ancient secrets and forgotten knowledge, hidden within the depths of uncharted space.

Pursued by the mysteries of the cosmos, a lone explorer ventures forth, guardian of discoveries that may unlock new understanding and reveal the wonders of the universe...`;

export function CrawlInput({ onSubmit, initialData }: CrawlInputProps) {
  const [openingText, setOpeningText] = useState(
    initialData?.openingText || DEFAULT_OPENING_TEXT
  );
  const [logoText, setLogoText] = useState(
    initialData?.logoText || DEFAULT_LOGO_TEXT
  );
  const [episodeNumber, setEpisodeNumber] = useState(
    initialData?.episodeNumber || DEFAULT_EPISODE_NUMBER
  );
  const [episodeSubtitle, setEpisodeSubtitle] = useState(
    initialData?.episodeSubtitle || DEFAULT_EPISODE_SUBTITLE
  );
  const [crawlText, setCrawlText] = useState(initialData?.crawlText || DEFAULT_CRAWL_TEXT);
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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
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
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          id="episode-number"
          label="Episode Number"
          type="text"
          value={episodeNumber}
          onChange={(e) => setEpisodeNumber(e.target.value)}
          placeholder={DEFAULT_EPISODE_NUMBER}
        />
        <FormInput
          id="episode-subtitle"
          label="Episode Subtitle"
          type="text"
          value={episodeSubtitle}
          onChange={(e) => setEpisodeSubtitle(e.target.value)}
          placeholder={DEFAULT_EPISODE_SUBTITLE}
        />
      </div>

      {/* Crawl Text Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="crawl-text"
          className="block font-crawl text-xs font-bold uppercase tracking-wider text-crawl-yellow sm:text-sm"
          style={{ letterSpacing: "0.1em" }}
        >
          Crawl Text
        </label>
        <Textarea
          id="crawl-text"
          value={crawlText}
          onChange={handleCrawlTextChange}
          placeholder={DEFAULT_CRAWL_TEXT}
          className="min-h-[180px] sm:min-h-[200px]"
          aria-describedby="crawl-help crawl-error"
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p
              id="crawl-help"
              className={`font-opening-text text-[10px] sm:text-xs ${
                isCrawlOverLimit
                  ? "text-red-500"
                  : isCrawlUnderLimit
                    ? "text-crawl-yellow/70"
                    : "text-gray-400"
              }`}
            >
              {crawlTextLength} / {FORM_CONSTANTS.MAX_MESSAGE_LENGTH} characters
            </p>
            {error && (
              <p
                id="crawl-error"
                className="font-opening-text text-[10px] text-red-500 sm:text-xs"
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
        className="mt-6 w-full border-2 border-crawl-yellow bg-crawl-yellow py-3 font-crawl text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-crawl-yellow/90 disabled:border-crawl-yellow/30 disabled:bg-crawl-yellow/20 disabled:text-crawl-yellow/50 sm:py-3.5 sm:text-base"
        style={{
          letterSpacing: "0.1em",
          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
        }}
        disabled={isCrawlOverLimit || !crawlText.trim()}
      >
        <Play className="mr-2 size-4 fill-current" />
        Play Crawl
      </Button>
    </form>
  );
}
