"use client";

import { useRef, useEffect, useState, useCallback } from "react";

export interface SliderProps {
  value: number; // 0-1
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
  ariaLabel?: string;
}

/**
 * Slider implementation with intuitive drag behavior
 * - Click/tap on track: immediate seek
 * - Drag thumb: smooth dragging, seek on release
 * - Works seamlessly on mouse and touch
 */
export function Slider({
  value,
  onChange,
  onCommit,
  min = 0,
  max = 1,
  step = 0.001,
  disabled = false,
  className = "",
  trackClassName = "",
  rangeClassName = "",
  thumbClassName = "",
  ariaLabel = "Slider",
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const dragStartRef = useRef<{ x: number; value: number } | null>(null);

  // Clamp value to valid range
  const clampedValue = Math.max(min, Math.min(max, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  // Calculate value from client X position
  const getValueFromX = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return clampedValue;

      const rect = trackRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const rawValue = min + (percentage / 100) * (max - min);
      
      // Apply step
      if (step > 0) {
        return Math.round(rawValue / step) * step;
      }
      return rawValue;
    },
    [min, max, step, clampedValue]
  );

  // Handle pointer down (mouse or touch)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;

      e.preventDefault();
      setIsDragging(true);
      setIsActive(true);

      const clientX = e.clientX;
      const newValue = getValueFromX(clientX);
      
      // Store drag start info
      dragStartRef.current = { x: clientX, value: newValue };
      
      // If clicking on track (not thumb), commit immediately
      const isClickingTrack = e.target === trackRef.current || 
                              (trackRef.current?.contains(e.target as Node) && 
                               e.target !== thumbRef.current);
      
      if (isClickingTrack) {
        onChange(newValue);
        if (onCommit) {
          onCommit(newValue);
        }
        // Don't start drag for track clicks
        setIsDragging(false);
        setIsActive(false);
        return;
      }
    },
    [disabled, getValueFromX, onChange, onCommit]
  );

  // Handle pointer move during drag
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!trackRef.current || !dragStartRef.current) return;

      e.preventDefault();
      const newValue = getValueFromX(e.clientX);
      onChange(newValue);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!dragStartRef.current) return;

      e.preventDefault();
      const finalValue = getValueFromX(e.clientX);
      
      // Commit the final value
      onChange(finalValue);
      if (onCommit) {
        onCommit(finalValue);
      }

      setIsDragging(false);
      setIsActive(false);
      dragStartRef.current = null;
    };

    // Use capture phase to ensure we catch events even if pointer leaves element
    document.addEventListener("pointermove", handlePointerMove, { capture: true });
    document.addEventListener("pointerup", handlePointerUp, { capture: true });
    document.addEventListener("pointercancel", handlePointerUp, { capture: true });

    return () => {
      document.removeEventListener("pointermove", handlePointerMove, { capture: true });
      document.removeEventListener("pointerup", handlePointerUp, { capture: true });
      document.removeEventListener("pointercancel", handlePointerUp, { capture: true });
    };
  }, [isDragging, getValueFromX, onChange, onCommit]);

  // Handle track click
  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || isDragging) return;
      
      // Only handle if clicking directly on track, not thumb
      if (e.target === trackRef.current || 
          (trackRef.current?.contains(e.target as Node) && e.target !== thumbRef.current)) {
        const newValue = getValueFromX(e.clientX);
        onChange(newValue);
        if (onCommit) {
          onCommit(newValue);
        }
      }
    },
    [disabled, isDragging, getValueFromX, onChange, onCommit]
  );

  return (
    <div
      ref={trackRef}
      className={`relative flex h-5 w-full touch-none select-none items-center cursor-pointer ${trackClassName} ${className}`}
      onClick={handleTrackClick}
      onPointerDown={handlePointerDown}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clampedValue}
      aria-disabled={disabled}
      style={{ touchAction: "none" }}
    >
      {/* Track */}
      <div
        className={`relative h-2 w-full grow cursor-pointer ${trackClassName}`}
        style={{
          clipPath: "polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))",
          backgroundColor: "rgba(255, 232, 31, 0.1)",
        }}
      >
        {/* Range (filled portion) */}
        <div
          className={`absolute h-full bg-crawl-yellow ${rangeClassName}`}
          style={{
            width: `${percentage}%`,
            clipPath: "polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))",
          }}
        />
      </div>

      {/* Thumb */}
      <div
        ref={thumbRef}
        className={`absolute block h-5 w-5 border-2 border-crawl-yellow bg-crawl-yellow shadow-md transition-all cursor-pointer touch-manipulation ${
          isActive ? "scale-110" : "hover:scale-110"
        } focus:outline-none focus:ring-2 focus:ring-crawl-yellow focus:ring-offset-2 focus:ring-offset-black ${thumbClassName}`}
        style={{
          left: `calc(${percentage}% - 10px)`,
          clipPath: "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))",
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        tabIndex={disabled ? -1 : 0}
      />
    </div>
  );
}

