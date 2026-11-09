import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";

export default [
  { ignores: [".next/**", "node_modules/**"] },
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } } },
    ...nextPlugin.flatConfig.coreWebVitals,
    rules: { ...nextPlugin.flatConfig.coreWebVitals.rules, "@next/next/no-img-element": "off" },
  },
];
