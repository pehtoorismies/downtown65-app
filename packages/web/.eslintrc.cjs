const OFF = 0;

module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node"
  ],
  rules: {
    "@typescript-eslint/no-redeclare": OFF,
    "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }],
    "unicorn/prefer-module": OFF,
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
