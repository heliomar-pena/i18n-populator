/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "cli.js",
    "*config.js",
    "**/coverage/**",
    "**/node_modules/**",
  ],
  collectCoverageFrom: [
    "**/*.js",
  ],
  coverageProvider: "v8",
  setupFiles: ["./jest.setup.mjs"],
  transform: {},
};

export default config;
