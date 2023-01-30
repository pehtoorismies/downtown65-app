module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:unicorn/recommended",
    "prettier"
  ],
  plugins: ["import", "unicorn", "unused-imports", "prettier"],
  ignorePatterns: ["**/*/*.gen.ts"],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn", // or "error"
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "import/no-unresolved": "off",
    "import/named": "off",
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true
        },
        "newlines-between": "never"
      }
    ],
    "no-console": ["error", { allow: ["error"] }],
    "prettier/prettier": ["error"],
    "sort-imports": ["error", { "ignoreDeclarationSort": true }],
    "unicorn/prevent-abbreviations": [
      "error",
      {
        replacements: {
          db: {
            database: false
          },
          res: false,
          params: false,
          env: false,
          args: false,
          props: false
        }
      }
    ],
    "unused-imports/no-unused-imports": "error"
  }
};
