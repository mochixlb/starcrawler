"use client";

import { useState, useEffect, useMemo } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormInput } from "@/components/ui/form-input";
import { FORM_CONSTANTS, URL_CONSTANTS } from "@/lib/constants";
import { validateCrawlData } from "@/lib/validation";
import { encodeCrawlData, isUrlLengthSafe, getBaseUrl } from "@/lib/utils";
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
  const [crawlText, setCrawlText] = useState(
    initialData?.crawlText || DEFAULT_CRAWL_TEXT
  );
  const [error, setError] = useState<string | null>(null);
  const [urlWarning, setUrlWarning] = useState<string | null>(null);

  // Calculate character counts for all fields
  const crawlTextLength = crawlText.length;
  const openingTextLength = openingText.length;
  const logoTextLength = logoText.length;
  const episodeNumberLength = episodeNumber.length;
  const episodeSubtitleLength = episodeSubtitle.length;

  // Check if fields exceed limits
  const isCrawlOverLimit = crawlTextLength > FORM_CONSTANTS.MAX_MESSAGE_LENGTH;
  const isCrawlUnderLimit = crawlTextLength < FORM_CONSTANTS.MIN_MESSAGE_LENGTH;
  const isOpeningTextOverLimit =
    openingTextLength > FORM_CONSTANTS.MAX_OPENING_TEXT_LENGTH;
  const isLogoTextOverLimit =
    logoTextLength > FORM_CONSTANTS.MAX_LOGO_TEXT_LENGTH;
  const isEpisodeNumberOverLimit =
    episodeNumberLength > FORM_CONSTANTS.MAX_EPISODE_NUMBER_LENGTH;
  const isEpisodeSubtitleOverLimit =
    episodeSubtitleLength > FORM_CONSTANTS.MAX_EPISODE_SUBTITLE_LENGTH;

  // Check if any field is over limit
  const hasFieldOverLimit =
    isCrawlOverLimit ||
    isOpeningTextOverLimit ||
    isLogoTextOverLimit ||
    isEpisodeNumberOverLimit ||
    isEpisodeSubtitleOverLimit;

  // Prepare crawl data for URL length check (only when form is valid)
  const crawlDataForUrlCheck = useMemo(() => {
    if (hasFieldOverLimit || isCrawlUnderLimit || !crawlText.trim()) {
      return null;
    }
    return { openingText, logoText, episodeNumber, episodeSubtitle, crawlText };
  }, [
    openingText,
    logoText,
    episodeNumber,
    episodeSubtitle,
    crawlText,
    hasFieldOverLimit,
    isCrawlUnderLimit,
  ]);

  // Check URL length with debouncing (only when form is valid)
  useEffect(() => {
    if (!crawlDataForUrlCheck) {
      setUrlWarning(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      const validation = validateCrawlData(crawlDataForUrlCheck);
      if (!validation.success) {
        setUrlWarning(null);
        return;
      }

      try {
        const encoded = encodeCrawlData(validation.data);
        const baseUrl = getBaseUrl();
        const fullUrl = `${baseUrl}?crawl=${encoded}`;
        const urlLength = fullUrl.length;

        if (urlLength > URL_CONSTANTS.MAX_URL_LENGTH) {
          const overage = urlLength - URL_CONSTANTS.MAX_URL_LENGTH;
          setUrlWarning(
            `URL would be ${overage} characters too long. Reduce content to enable sharing.`
          );
        } else if (urlLength > URL_CONSTANTS.MAX_URL_LENGTH * 0.9) {
          const remaining = URL_CONSTANTS.MAX_URL_LENGTH - urlLength;
          setUrlWarning(
            `URL is getting long (${remaining} characters remaining). Consider reducing content.`
          );
        } else {
          setUrlWarning(null);
        }
      } catch {
        setUrlWarning(null);
      }
    }, 500); // Debounce: check after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [crawlDataForUrlCheck]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate and transform data using Zod schema
    const validation = validateCrawlData({
      openingText,
      logoText,
      episodeNumber,
      episodeSubtitle,
      crawlText,
    });

    if (!validation.success) {
      setError(validation.error);
      return;
    }

    // Check URL length before encoding
    try {
      const encoded = encodeCrawlData(validation.data);
      const baseUrl = getBaseUrl();

      if (!isUrlLengthSafe(baseUrl, encoded)) {
        const fullUrl = `${baseUrl}?crawl=${encoded}`;
        const overage = fullUrl.length - URL_CONSTANTS.MAX_URL_LENGTH;
        setError(
          `The crawl content is too long to share via URL (${overage} characters over limit). Please reduce the text length.`
        );
        setUrlWarning(null); // Clear warning, show error instead
        return;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to prepare crawl data"
      );
      return;
    }

    // Submit validated and transformed data
    onSubmit(validation.data);
  };

  // Handle input changes - clear errors when user types
  const handleCrawlTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCrawlText(e.target.value);
    if (error) setError(null);
  };

  const handleFieldChange = (setter: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (error) setError(null);
    };
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      {/* Form-level error message */}
      {error && (
        <div
          className="rounded-md border-2 border-red-500/40 bg-red-500/10 px-4 py-3 backdrop-blur-sm"
          role="alert"
          aria-live="polite"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          }}
        >
          <p className="font-opening-text text-sm font-medium text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* URL length warning (non-blocking) */}
      {urlWarning && !error && (
        <div
          className="rounded-md border-2 border-crawl-yellow/40 bg-crawl-yellow/10 px-4 py-3 backdrop-blur-sm"
          role="alert"
          aria-live="polite"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          }}
        >
          <p className="font-opening-text text-sm font-medium text-crawl-yellow">
            ⚠️ {urlWarning}
          </p>
        </div>
      )}

      {/* Opening Text Input */}
      <div className="space-y-1.5">
        <FormInput
          id="opening-text"
          label="Opening Text"
          labelColor="cyan"
          type="text"
          value={openingText}
          onChange={handleFieldChange(setOpeningText)}
          placeholder={DEFAULT_OPENING_TEXT}
          maxLength={FORM_CONSTANTS.MAX_OPENING_TEXT_LENGTH}
          error={isOpeningTextOverLimit}
          errorMessage={
            isOpeningTextOverLimit
              ? `Opening text exceeds ${FORM_CONSTANTS.MAX_OPENING_TEXT_LENGTH} characters`
              : undefined
          }
        />
      </div>

      {/* Logo Text Input */}
      <div className="space-y-1.5">
        <FormInput
          id="logo-text"
          label="Logo Text"
          type="text"
          value={logoText}
          onChange={handleFieldChange(setLogoText)}
          placeholder={DEFAULT_LOGO_TEXT}
          maxLength={FORM_CONSTANTS.MAX_LOGO_TEXT_LENGTH}
          error={isLogoTextOverLimit}
          errorMessage={
            isLogoTextOverLimit
              ? `Logo text exceeds ${FORM_CONSTANTS.MAX_LOGO_TEXT_LENGTH} characters`
              : undefined
          }
        />
      </div>

      {/* Episode Number and Subtitle */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <FormInput
            id="episode-number"
            label="Episode Number"
            type="text"
            value={episodeNumber}
            onChange={handleFieldChange(setEpisodeNumber)}
            placeholder={DEFAULT_EPISODE_NUMBER}
            maxLength={FORM_CONSTANTS.MAX_EPISODE_NUMBER_LENGTH}
            error={isEpisodeNumberOverLimit}
            errorMessage={
              isEpisodeNumberOverLimit
                ? `Episode number exceeds ${FORM_CONSTANTS.MAX_EPISODE_NUMBER_LENGTH} characters`
                : undefined
            }
          />
        </div>
        <div className="space-y-1.5">
          <FormInput
            id="episode-subtitle"
            label="Episode Subtitle"
            type="text"
            value={episodeSubtitle}
            onChange={handleFieldChange(setEpisodeSubtitle)}
            placeholder={DEFAULT_EPISODE_SUBTITLE}
            maxLength={FORM_CONSTANTS.MAX_EPISODE_SUBTITLE_LENGTH}
            error={isEpisodeSubtitleOverLimit}
            errorMessage={
              isEpisodeSubtitleOverLimit
                ? `Episode subtitle exceeds ${FORM_CONSTANTS.MAX_EPISODE_SUBTITLE_LENGTH} characters`
                : undefined
            }
          />
        </div>
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
          className={`min-h-[180px] sm:min-h-[200px] transition-colors ${
            isCrawlOverLimit || isCrawlUnderLimit
              ? "border-red-500/50 focus-visible:border-red-500 focus-visible:ring-red-500/50"
              : ""
          }`}
          aria-describedby="crawl-help"
          aria-invalid={isCrawlOverLimit || isCrawlUnderLimit}
          aria-errormessage={
            isCrawlOverLimit || isCrawlUnderLimit ? "crawl-help" : undefined
          }
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p
              id="crawl-help"
              className={`font-opening-text text-[10px] sm:text-xs transition-colors ${
                isCrawlOverLimit
                  ? "text-red-400"
                  : isCrawlUnderLimit
                  ? "text-crawl-yellow/80"
                  : "text-gray-300"
              }`}
            >
              {crawlTextLength} / {FORM_CONSTANTS.MAX_MESSAGE_LENGTH} characters
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="mt-6 w-full border-2 border-crawl-yellow bg-crawl-yellow py-3 font-crawl text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-crawl-yellow/90 disabled:border-crawl-yellow/30 disabled:bg-crawl-yellow/20 disabled:text-crawl-yellow/50 sm:py-3.5 sm:text-base"
        style={{
          letterSpacing: "0.1em",
          clipPath:
            "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
        }}
        disabled={hasFieldOverLimit || isCrawlUnderLimit || !crawlText.trim()}
      >
        <Play className="mr-2 size-4 fill-current" />
        Play Crawl
      </Button>
    </form>
  );
}
