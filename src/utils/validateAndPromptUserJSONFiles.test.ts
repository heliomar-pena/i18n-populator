import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { parsePath } from "./getConfigPath";
import fs from "fs";
import { validateAndPromptUserJSONFiles } from "./validateAndPromptUserJSONFiles";

const mockImportJSONFile = (filesMock, basePath) => {
  let filesMockWithParsedPath = {};
  Object.keys(filesMock).forEach((fileName) => {
    const parsedPath = parsePath(`${basePath}/${fileName}`);
    filesMockWithParsedPath[parsedPath] = filesMock[fileName];
  });
};

// TODO: Add a way to mock import
describe.skip("validateAndPromptUserJSONFiles", () => {
  let filesMock, filesName, basePath, nameOfTranslation;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    (fs.existsSync as jest.Mock).mockReturnValue(true);

    filesMock = {
      "withTest.json": {
        test: "Test translation",
      },
      "withHelloWorld.json": {
        helloWorld: "Hello World",
      },
    };
    filesName = Object.keys(filesMock);

    basePath = "test-configs/translations";

    nameOfTranslation = "test";
  });

  it("should not include the json files that already have the property if the user doesn't confirm it", async () => {
    mockImportJSONFile(filesMock, basePath);
    (prompt as jest.Mock).mockImplementationOnce(() => "no");

    const filesToEdit = await validateAndPromptUserJSONFiles(
      basePath,
      filesName,
      nameOfTranslation,
    );
    const fileName = filesName.find(
      (fileName) => filesMock[fileName][nameOfTranslation] === undefined,
    );
    const expectedParsedPath = parsePath(`${basePath}/${fileName}`);

    expect(filesToEdit).toEqual([
      { file: filesMock[fileName], parsedPath: expectedParsedPath },
    ]);
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it("should include the json files that already have the property if the user confirm it", async () => {
    mockImportJSONFile(filesMock, basePath);
    (prompt as jest.Mock).mockImplementationOnce(() => "yes");

    const filesToEdit = await validateAndPromptUserJSONFiles(
      basePath,
      filesName,
      nameOfTranslation,
    );
    const expectedFiles = filesName.map((fileName) => ({
      file: filesMock[fileName],
      parsedPath: parsePath(`${basePath}/${fileName}`),
    }));

    expect(prompt).toHaveBeenCalledTimes(1);
    expect(filesToEdit).toEqual(expectedFiles);
  });

  it("should return an empty array if all the files already have the property and the user doesn't want overwrite them", async () => {
    mockImportJSONFile(filesMock, basePath);
    (prompt as jest.Mock).mockImplementationOnce(() => "no");

    const filesToEdit = await validateAndPromptUserJSONFiles(
      basePath,
      [filesName[0]],
      nameOfTranslation,
    );

    expect(prompt).toHaveBeenCalledTimes(1);
    expect(filesToEdit).toEqual([]);
  });
});
