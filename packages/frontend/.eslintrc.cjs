const OFF = 0;

module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node"
  ],
  plugins: ["unused-imports"],
  rules: {
    "unicorn/text-encoding-identifier-case": OFF,
    "@typescript-eslint/no-redeclare": OFF
  }
};
