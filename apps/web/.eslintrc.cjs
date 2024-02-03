const OFF = 0;

module.exports = {
  root: true,
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "plugin:unicorn/recommended"
  ],
  plugins: ["unicorn", "unused-imports", "prettier"],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-redeclare": OFF,
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
    "require-await": ["error"],
    "sort-imports": ["error", { "ignoreDeclarationSort": true }],
    "unicorn/prefer-module": OFF,
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
    "unicorn/no-null": OFF,
    "unicorn/text-encoding-identifier-case": OFF,
    "unicorn/filename-case": [
      "error",
      {
        "case": "kebabCase",
        "ignore": [
          /_index.tsx$/
        ]
      }
    ]
  }
};
