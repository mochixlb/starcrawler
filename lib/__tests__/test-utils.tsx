import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { vi } from "vitest";

/**
 * Custom render function that wraps components with providers
 * Use this instead of the default render from @testing-library/react
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    ...options,
  });
}

/**
 * Creates mock crawl data for testing
 */
export function createMockCrawlData() {
  return {
    openingText: "A long time ago in a galaxy far, far away....",
    logoText: "STAR CRAWLER",
    episodeNumber: "I",
    episodeSubtitle: "The Quest Begins",
    crawlText: "This is a test crawl text that meets the minimum length requirement for validation.",
  };
}

/**
 * Mocks Next.js router
 */
export function mockNextRouter() {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  };

  vi.mock("next/navigation", () => ({
    useRouter: () => mockRouter,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/",
  }));

  return mockRouter;
}

/**
 * Waits for async operations to complete
 */
export async function waitForAsync() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

// Re-export everything from @testing-library/react
export * from "@testing-library/react";

// Override render method
export { customRender as render };

