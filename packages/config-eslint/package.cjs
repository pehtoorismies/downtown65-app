const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

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
    "@typescript-eslint/no-unused-vars": [
      "warn", // or "error"
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }
    ],
    // > begin HACK
    // following break eslint ¯\_(ツ)_/¯
    "import/namespace": "off",
    "import/default": "off",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    // > end HACK
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
    "require-await": ["error"],
    "sort-imports": ["error", { ignoreDeclarationSort: true }],
    "unicorn/no-null": "off",
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
          props: false,
          dir: false
        }
      }
    ],
    "unused-imports/no-unused-imports": "error"
  },
  env: {
    node: true
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: {
        project
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/"
  ]
};
