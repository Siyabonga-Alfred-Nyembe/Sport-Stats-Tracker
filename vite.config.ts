import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "lcov"],
        exclude: ["node_modules/", "dist/","src/__test__/**"],
        all: false,
        skipFull: false,
      },
  },
});
