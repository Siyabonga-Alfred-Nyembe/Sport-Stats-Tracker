import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",             // uses Istanbul for coverage
      reporter: ["text", "html"],       // text table + HTML report
      include: [
        "src/pages/**/*.tsx",
        "src/components/**/*.tsx",
        "src/services/**/*.ts",
        "src/**/*.ts",                   // include other TS files like types, services, utils
      ],
      exclude: ["node_modules/", "dist/"],  // exclude external folders
    },
  },
});
