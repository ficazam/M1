// eslint.config.mjs
import next from "eslint-config-next";

export default [
  ...next,
  {
    files: ["**/*.spec.ts", "**/*.spec.tsx"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2022,
    },
    env: { node: true, es2022: true },
    rules: {
      // keep test ergonomics friendly
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
];;
