const file = require.resolve("@downtown65-app/config-eslint/package.cjs");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [file],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true
  }
};