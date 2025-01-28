import { normalizeFilePath } from "./normalizeFilePath.js";

describe("Normalize file path tests", () => {
  let originalPlatform;

  beforeAll(() => {
    originalPlatform = process.platform;
  });

  afterEach(() => {
    // Restore original platform
    Object.defineProperty(process, "platform", {
      value: originalPlatform,
    });
  });
  describe("Given a Windows Environment", () => {
    beforeEach(() => {
      // Simulate Windows environment
      Object.defineProperty(process, "platform", {
        value: "win32",
      });
    });

    describe("When file path is provided", () => {
      it("should normalize file path", () => {
        const filePath =
          "file:///C:/Users/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs/test-config.json";
        const expectedPath =
          "C:/Users/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs";
        expect(normalizeFilePath(filePath)).toBe(expectedPath);
      });
    });
  });

  describe("Given a Unix-like system", () => {
    beforeEach(() => {
      // Simulate Unix environment
      Object.defineProperty(process, "platform", {
        value: "linux",
      });
    });

    describe("When File Path is provided", () => {
      it("should normalize file path", () => {
        const filePath =
          "file://home/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs/test-config.json";
        const expectedPath =
          "home/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs";
        expect(normalizeFilePath(filePath)).toBe(expectedPath);
      });
    });
  });

  describe("Given any system", () => {
    describe("When File Path is not valid", () => {
      it("should throw an error if no string is provided", () => {
        expect(() => normalizeFilePath("")).toThrow("No string provided");
      });

      it("should handle undefined input gracefully", () => {
        expect(() => normalizeFilePath(undefined)).toThrow(
          "No string provided",
        );
      });
    });
  });
});
