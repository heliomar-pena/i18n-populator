import { parsePath } from "./getConfigPath.js";
import fs from "fs";

import { jest } from "@jest/globals";

jest.unstable_mockModule("./utils/importJSONFile.js", () => ({
  importJSONFile: jest.fn(() => ({
    languages: [
      {
        name: "en",
        files: ["en.json"],
      },
      {
        name: "es",
        files: ["es.json"],
      },
    ],
    basePath: "test",
    translationEngines: ["google", "bing", "libreTranslate"],
  })),
}));

const { importJSONFile } = await import("./importJSONFile.js");
const { getOrCreateJsonFile } = await import("./getOrCreateJsonFile.js");

describe("getOrCreateJsonFile", () => {
  let basePath, fileName, fileContent;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    basePath = "test-configs/translations";
    fileName = "en.json";
    fileContent = { test: "test" };
  });

  it("should create a new file and return the file and the parsedPath if file doesn't exists", async () => {
    fs.existsSync.mockImplementation(() => false);

    const { file, parsedPath } = await getOrCreateJsonFile(basePath, fileName);
    expect(file).toEqual({});
    expect(parsedPath).toEqual(parsePath(`${basePath}/${fileName}`));
    expect(fs.mkdirSync).toHaveBeenCalledWith(basePath, { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      parsedPath,
      JSON.stringify(file, null, 2),
    );
  });

  it("should return the file and the parsedPath if file exists", async () => {
    importJSONFile.mockImplementation(() => fileContent);
    fs.existsSync.mockImplementation(() => true);

    const { file, parsedPath } = await getOrCreateJsonFile(basePath, fileName);
    expect(file).toEqual(fileContent);
    expect(parsedPath).toEqual(parsePath(`${basePath}/${fileName}`));
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalledWith(parsedPath);
  });
});
