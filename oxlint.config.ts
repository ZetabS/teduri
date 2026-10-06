import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["eslint", "typescript", "unicorn", "oxc", "import", "node"],
  categories: {
    correctness: "error",
    suspicious: "error",
    perf: "warn",
  },
  rules: {
    "import/first": "error",
    "import/consistent-type-specifier-style": ["error", "prefer-top-level-if-only-type-imports"],
  },
  env: {
    builtin: true,
  },
});
