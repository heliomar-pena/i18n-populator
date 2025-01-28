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
      osMock.mockImplementation(() => "win32");
    });

    describe("When String is provided", () => {

      it("Should convert Windows paths to Unix style on Windows", () => {
        const windowsPath = "C:\\Users\\user\\Documents\\file.txt";
        const expectedUnixPath = "C:/Users/user/Documents/file.txt";
        expect(convertPathToUnixStyle(windowsPath)).toBe(expectedUnixPath);
      });

      it("Should handle paths with multiple backslashes", () => {
        const windowsPath = "C:\\\\Users\\\\user\\\\Documents\\\\file.txt";
        const expectedUnixPath = "C:/Users/user/Documents/file.txt";
        expect(convertPathToUnixStyle(windowsPath)).toBe(expectedUnixPath);
      });
    })

  })

  describe("Given a Unix-like system", () => {
    beforeEach(() => {
      // Simulate Unix environment
      Object.defineProperty(process, "platform", {
        value: "linux",
      });
      osMock.mockImplementation(() => "linux");
    });

    describe("When File Path is provided", () => {
      it("Should return the same path on Unix-like systems", () => {
        const filePath = "/home/user/Documents/file.txt";
        expect(convertPathToUnixStyle(filePath)).toBe(filePath);
      });
    })
  })

  describe("Given any system", () => {

    describe("When File Path is not valid", () => {

      it('Should throw "No string provided" Error', () => {
        expect(() => convertPathToUnixStyle("")).toThrow(
          "No string provided"
        );

        expect(() => convertPathToUnixStyle(undefined)).toThrow(
          "No string provided"
        );

      });
    });
  });
});
