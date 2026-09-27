export default [
  { ignores: ["node_modules/**", "build/**", "dist/**"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "warn",
    },
  },
];
