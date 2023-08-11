const OFF = 0;

module.exports = {
  root: true,
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "plugin:cypress/recommended"
  ],
  plugins: ["cypress", "unicorn"],
  rules: {
    "@typescript-eslint/no-redeclare": OFF,
    "cypress/no-assigning-return-values": "error",
    "cypress/no-unnecessary-waiting": "error",
    "cypress/assertion-before-screenshot": "warn",
    "cypress/no-force": "warn",
    "cypress/no-async-tests": "error",
    "cypress/no-pause": "error",
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
