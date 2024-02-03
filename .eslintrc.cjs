/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:unicorn/recommended",
    "prettier"
  ],
  plugins: ["import", "unicorn", "@typescript-eslint", "unused-imports", "prettier"],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
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
    "prettier/prettier": ["error"],
    "sort-imports": ["error", { ignoreDeclarationSort: true }]
  },
  env: {
    node: true
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: true,
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
};
