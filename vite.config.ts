import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html"],
      all: false,
      include: [
        "src/pages/**/*.tsx",
        "src/components/**/*.tsx",
        "src", "tests"
      ],
      exclude: ["node_modules/", "dist/"],
    },
  },
});
