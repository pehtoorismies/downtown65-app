const OFF = 0;

module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node"
  ],
  plugins: ["unused-imports"],
  rules: {
    "@typescript-eslint/no-redeclare": OFF,
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
