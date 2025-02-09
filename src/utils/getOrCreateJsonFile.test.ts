import { parsePath } from "./getConfigPath";
import fs from "fs";
import { getOrCreateJsonFile } from "./getOrCreateJsonFile";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

describe("getOrCreateJsonFile", () => {
  let basePath, fileName, fileContent;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    basePath = "test-configs/translations";
    fileName = "en.json";
    fileContent = { test: "test" };
  });

  describe("When requested file doesn't exists in the provided route", () => {
    it("should create a new file and return the file and the parsedPath", async () => {
      (fs.existsSync as jest.Mock).mockImplementation(() => false);

      const { file, parsedPath } = await getOrCreateJsonFile(
        basePath,
        fileName,
      );
      expect(file).toEqual({});
      expect(parsedPath).toEqual(parsePath(`${basePath}/${fileName}`));
      expect(fs.mkdirSync).toHaveBeenCalledWith(basePath, { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        parsedPath,
        JSON.stringify(file, null, 2),
      );
    });
  });
  // TODO: Mock import function
  describe.skip("When requested file exists in the provided route", () => {
    it("should return the file and the parsedPath if file exists", async () => {
      // importJSONFile.mockImplementation(() => fileContent);
      (fs.existsSync as jest.Mock).mockImplementation(() => true);

      const { file, parsedPath } = await getOrCreateJsonFile(
        basePath,
        fileName,
      );
      expect(file).toEqual(fileContent);
      expect(parsedPath).toEqual(parsePath(`${basePath}/${fileName}`));
      expect(fs.mkdirSync).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
      expect(fs.existsSync).toHaveBeenCalledWith(parsedPath);
    });
  });
});
