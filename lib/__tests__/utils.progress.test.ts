import { describe, it, expect } from "vitest";
import { computeSeekProgress } from "@/lib/utils";

describe("computeSeekProgress", () => {
  it("returns current progress when total duration is zero", () => {
    expect(computeSeekProgress(0.4, 0, 0, 5)).toBeCloseTo(0.4, 6);
    expect(computeSeekProgress(0.0, 0, 0, 5)).toBeCloseTo(0.0, 6);
    expect(computeSeekProgress(1.0, 0, 0, -5)).toBeCloseTo(1.0, 6);
  });

  it("seeks forward by delta seconds, clamped to 1", () => {
    // total = 20s, forward 5s -> delta = 0.25
    expect(computeSeekProgress(0.1, 0, 20, 5)).toBeCloseTo(0.35, 6);
    // clamp at 1
    expect(computeSeekProgress(0.9, 10, 10, 5)).toBeCloseTo(1.0, 6);
  });

  it("seeks backward by delta seconds, clamped to 0", () => {
    // total = 20s, backward 5s -> delta = 0.25
    expect(computeSeekProgress(0.8, 10, 10, -5)).toBeCloseTo(0.55, 6);
    // clamp at 0
    expect(computeSeekProgress(0.1, 10, 10, -5)).toBeCloseTo(0.0, 6);
  });
});


