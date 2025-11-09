import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom environment for DOM APIs
    environment: "jsdom",
    
    // Glob patterns for test files
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", ".next", "out", "dist"],
    
    // Setup files to run before each test file
    setupFiles: ["./vitest.setup.ts"],
    
    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".next/",
        "out/",
        "dist/",
        "**/*.config.{js,ts}",
        "**/*.d.ts",
        "**/types.ts",
        "**/constants.ts",
        "**/__tests__/**",
      ],
    },
    
    // Global test timeout
    testTimeout: 10000,
    
    // Watch mode configuration
    watch: false,
    
    // TypeScript configuration
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});

