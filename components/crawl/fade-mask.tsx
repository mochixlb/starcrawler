import { CRAWL_CONSTANTS } from "@/lib/constants";

interface FadeMaskProps {
  position: "top" | "bottom";
}

export function FadeMask({ position }: FadeMaskProps) {
  const isTop = position === "top";
  const gradient = isTop
    ? "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)"
    : "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)";

  return (
    <div
      className={`pointer-events-none absolute left-0 right-0 z-10 ${
        isTop ? "top-0" : "bottom-0"
      }`}
      style={{
        height: CRAWL_CONSTANTS.FADE_MASK_HEIGHT,
        background: gradient,
      }}
    />
  );
}

