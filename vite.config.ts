import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    silent: true,
    logHeapUsage: false,
    coverage: {
      provider: "istanbul",             // uses Istanbul for coverage
      reporter: ["text", "html"],       // text table + HTML report
      // include: [
      //   "src/pages/**/*.tsx",
      //   "src/components/**/*.tsx",
      //   "src/services/**/*.ts",
      // ],
      // include: ["src/**/*.{ts,tsx}"],
      exclude: ["node_modules/", "dist/","src/__test__/**", "src/main.tsx"],

    },
  },
});
