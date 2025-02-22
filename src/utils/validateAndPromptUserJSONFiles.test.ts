import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { parsePath } from "./getConfigPath";
import fs from "fs";
import { validateAndPromptUserJSONFiles } from "./validateAndPromptUserJSONFiles";
import { importJsonFile } from "./importJsonFile";
import { confirmUserAction } from "./promptUtils";

jest.mock("./importJsonFile", () => ({
  importJsonFile: jest.fn(),
}));

jest.mock("./promptUtils", () => ({
  confirmUserAction: jest.fn(),
}));

const mockedConfirmUserAction = jest.mocked(confirmUserAction);
type FilesMock = Record<string, any>;

const mockedImportJSONFile = jest.mocked(importJsonFile<FilesMock>);

const mockImportJSONFile = (filesMock: FilesMock, basePath: string) => {
  let filesMockWithParsedPath: { [key: string]: FilesMock } = {};

  Object.entries(filesMock).forEach(([fileName, fileContent]) => {
    const parsedPath = parsePath(`${basePath}/${fileName}`);
    filesMockWithParsedPath[parsedPath] = fileContent;
  });

  mockedImportJSONFile.mockImplementation(
    async (path: string): Promise<FilesMock> => {
      return filesMockWithParsedPath[path];
    },
  );
};

describe.only("validateAndPromptUserJSONFiles", () => {
  let filesMock: FilesMock,
    filesName: string[],
    basePath: string,
    nameOfTranslation: string;
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
    mockedConfirmUserAction.mockResolvedValueOnce(false);

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
      { file: filesMock[fileName || ""], parsedPath: expectedParsedPath },
    ]);
    expect(mockedConfirmUserAction).toHaveBeenCalledTimes(1);
  });

  it("should include the json files that already have the property if the user confirm it", async () => {
    mockImportJSONFile(filesMock, basePath);
    mockedConfirmUserAction.mockResolvedValueOnce(true);

    const filesToEdit = await validateAndPromptUserJSONFiles(
      basePath,
      filesName,
      nameOfTranslation,
    );
    const expectedFiles = filesName.map((fileName) => ({
      file: filesMock[fileName],
      parsedPath: parsePath(`${basePath}/${fileName}`),
    }));

    expect(mockedConfirmUserAction).toHaveBeenCalledTimes(1);
    expect(filesToEdit).toEqual(expectedFiles);
  });

  it("should return an empty array if all the files already have the property and the user doesn't want overwrite them", async () => {
    mockImportJSONFile(filesMock, basePath);
    mockedConfirmUserAction.mockResolvedValueOnce(false);

    const filesToEdit = await validateAndPromptUserJSONFiles(
      basePath,
      [filesName[0]],
      nameOfTranslation,
    );

    expect(mockedConfirmUserAction).toHaveBeenCalledTimes(1);
    expect(filesToEdit).toEqual([]);
  });
});
