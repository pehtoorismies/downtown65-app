const OFF = 0;

module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "plugin:cypress/recommended"
  ],
  plugins: ["unused-imports", "cypress"],
  rules: {
    "unicorn/text-encoding-identifier-case": OFF,
    "@typescript-eslint/no-redeclare": OFF,
    "cypress/no-assigning-return-values": "error",
    "cypress/no-unnecessary-waiting": "error",
    "cypress/assertion-before-screenshot": "warn",
    "cypress/no-force": "warn",
    "cypress/no-async-tests": "error",
    "cypress/no-pause": "error"
  }
};
