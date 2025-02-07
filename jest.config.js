/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  testMatch: ["**/*.test.{ts,js}"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "cli\\.ts$",
    ".*config\\.ts$",
    ".*/coverage/.*",
    ".*/node_modules/.*",
  ],
  collectCoverageFrom: ["**/*.ts"],
  coverageProvider: "v8",
  setupFiles: ["./jest.setup.ts"],
};
