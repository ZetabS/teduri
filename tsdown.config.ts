import { defineConfig } from "tsdown";

const deps = ["commander", "@commander-js/extra-typings", "zod", "json-diff-ts"];

export default defineConfig({
  entry: ["src/main.ts"],
  outDir: "dist",
  format: ["esm"],
  deps: {
    alwaysBundle: deps,
    onlyBundle: deps,
    onlyImport: [],
  },
});
