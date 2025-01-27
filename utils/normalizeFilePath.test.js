import { normalizeFilePath } from "./normalizeFilePath.js";

describe("Normalize file path tests", () => {
  let originalPlatform;

  beforeAll(() => {
    originalPlatform = process.platform;
  });

  afterAll(() => {
    Object.defineProperty(process, "platform", {
      value: originalPlatform,
    });
  });

  it("should normalize file path for Windows", () => {
    Object.defineProperty(process, "platform", {
      value: "win32",
    });

    const filePath =
      "file:///C:/Users/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs/test-config.json";
    const expectedPath =
      "C:/Users/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs";
    expect(normalizeFilePath(filePath)).toBe(expectedPath);
  });

  it("should normalize file path for Unix", () => {
    Object.defineProperty(process, "platform", {
      value: "linux",
    });

    const filePath =
      "file://home/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs/test-config.json";
    const expectedPath =
      "home/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs";
    expect(normalizeFilePath(filePath)).toBe(expectedPath);
  });

  it("should throw an error if no string is provided", () => {
    expect(() => normalizeFilePath("")).toThrow("No string provided");
  });

  it("should handle undefined input gracefully", () => {
    expect(() => normalizeFilePath(undefined)).toThrow("No string provided");
  });
});
