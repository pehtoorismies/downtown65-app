const file = require.resolve("@downtown65-app/config-eslint/package.cjs");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [file],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true
  },
  rules: {
    "unicorn/text-encoding-identifier-case": 0
  }
};
