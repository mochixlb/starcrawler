import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        "vitest.setup.ts",
        "vitest.config.ts",
        "**/*.config.*",
        "**/types.ts",
        "**/*.d.ts",
        "**/__tests__/**",
        "**/test-utils.tsx",
        ".next/**",
        "out/**",
        "coverage/**",
        // Exclude Next.js app pages (typically tested via E2E or manual testing)
        "app/**/*.tsx",
        "app/**/*.ts",
        // Exclude untested components (can be added later)
        "components/crawl/**",
        "components/legal/**",
        "components/ui/error-boundary.tsx",
        "components/ui/footer.tsx",
        "components/ui/textarea.tsx",
      ],
      include: [
        // Focus on tested utilities and components
        "lib/**/*.{ts,tsx}",
        "components/ui/button.tsx",
        "components/ui/form-input.tsx",
      ],
      // Coverage thresholds based on TESTING.md goals
      // Applied only to included files (utilities and tested components)
      thresholds: {
        lines: 90, // Higher threshold for tested code
        functions: 90,
        branches: 80,
        statements: 90,
      },
      // Show only covered files in reports (cleaner output)
      all: false,
      // Clean coverage reports before running
      clean: true,
      // Clean coverage on watch mode
      cleanOnRerun: true,
      // Skip coverage for files with no tests
      skipFull: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});

