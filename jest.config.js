module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "**/*.js",
    "!cli.js",
    "!*config.js",
    "!**/coverage/**",
    "!**/node_modules/**",
  ],
  setupFiles: ["./jest.setup.js"],
};
