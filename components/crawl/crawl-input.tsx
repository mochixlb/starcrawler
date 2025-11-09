"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FORM_CONSTANTS } from "@/lib/constants";
import type { CrawlInputProps } from "@/components/shared/types";

export function CrawlInput({ onSubmit, initialValue = "" }: CrawlInputProps) {
  const [message, setMessage] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  // Calculate character count
  const characterCount = message.length;
  const isOverLimit = characterCount > FORM_CONSTANTS.MAX_MESSAGE_LENGTH;
  const isUnderLimit = characterCount < FORM_CONSTANTS.MIN_MESSAGE_LENGTH;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedMessage = message.trim();

    // Validation
    if (!trimmedMessage) {
      setError("Please enter a message");
      return;
    }

    if (trimmedMessage.length < FORM_CONSTANTS.MIN_MESSAGE_LENGTH) {
      setError(
        `Message must be at least ${FORM_CONSTANTS.MIN_MESSAGE_LENGTH} characters`
      );
      return;
    }

    if (trimmedMessage.length > FORM_CONSTANTS.MAX_MESSAGE_LENGTH) {
      setError(
        `Message must be no more than ${FORM_CONSTANTS.MAX_MESSAGE_LENGTH} characters`
      );
      return;
    }

    // Submit valid message
    onSubmit(trimmedMessage);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="crawl-message"
          className="text-sm font-medium text-starwars-yellow"
        >
          Enter your message
        </label>
        <Textarea
          id="crawl-message"
          value={message}
          onChange={handleChange}
          placeholder="A long time ago in a galaxy far, far away..."
          className="min-h-[200px] border-starwars-yellow/30 bg-black text-white placeholder:text-gray-600 focus:border-starwars-yellow focus:ring-starwars-yellow"
          aria-describedby="message-help message-error"
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p
              id="message-help"
              className={`text-xs ${
                isOverLimit
                  ? "text-red-500"
                  : isUnderLimit
                    ? "text-yellow-500"
                    : "text-gray-400"
              }`}
            >
              {characterCount} / {FORM_CONSTANTS.MAX_MESSAGE_LENGTH} characters
            </p>
            {error && (
              <p
                id="message-error"
                className="text-xs text-red-500"
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
        className="w-full bg-starwars-yellow font-bold text-black hover:bg-starwars-yellow/90"
        disabled={isOverLimit || !message.trim()}
      >
        Create Crawl
      </Button>
    </form>
  );
}
