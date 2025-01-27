import os from "os";
import { jest } from "@jest/globals";
import { convertPathToUnixStyle } from "./convertPathToUnixStyle.js";

describe("Convert path to unix style tests", () => {
  const osMock = jest.spyOn(os, "platform");
  let originalPlatform;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  beforeAll(() => {
    originalPlatform = process.platform;
  });

  afterAll(() => {
    // Restore original platform
    Object.defineProperty(process, "platform", {
      value: originalPlatform,
    });
  });

  it("Should return the same path on Unix-like systems", () => {
    // Simulate Unix environment
    Object.defineProperty(process, "platform", {
      value: "linux",
    });
    osMock.mockImplementation(() => "linux");

    const filePath = "/home/user/Documents/file.txt";
    expect(convertPathToUnixStyle(filePath)).toBe(filePath);
  });

  it("Should convert Windows paths to Unix style on Windows", () => {
    // Simulate Windows environment
    Object.defineProperty(process, "platform", {
      value: "win32",
    });
    osMock.mockImplementation(() => "win32");

    const windowsPath = "C:\\Users\\user\\Documents\\file.txt";
    const expectedUnixPath = "C:/Users/user/Documents/file.txt";
    expect(convertPathToUnixStyle(windowsPath)).toBe(expectedUnixPath);
  });

  it("Should throw an error if no string is provided", () => {
    expect(() => convertPathToUnixStyle("")).toThrow("No string provided");
  });

  it("Should handle undefined input", () => {
    expect(() => convertPathToUnixStyle(undefined)).toThrow(
      "No string provided",
    );
  });
});
