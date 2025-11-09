import * as React from "react";
import { render, type RenderOptions } from "@testing-library/react";

/**
 * Custom render function that wraps components with any providers
 * This can be extended to include theme providers, context providers, etc.
 */
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    ...options,
  });
}

// Re-export everything from @testing-library/react
export * from "@testing-library/react";

// Override render method
export { customRender as render };

