import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { generateConfigController } from "./generateConfigController";
import fs from "fs";
import {
  confirmUserAction,
  promptUserInput,
  promptUserOptions,
} from "../utils/promptUtils";
import { listFilesOnDirectory } from "../utils/listFiles";

jest.mock("../utils/promptUtils", () => ({
  confirmUserAction: jest.fn(async (message) => true),
  promptUserInput: jest.fn(() => ""),
  promptUserOptions: jest.fn(() => ""),
}));

jest.mock("../utils/listFiles", () => ({
  listFilesOnDirectory: jest.fn(async () => ["es.json", "en.json"]),
}));

const mockProcessExit = jest
  .spyOn(process, "exit")
  .mockImplementation((code) => {
    throw new Error(`Process.exit(${code})`);
  });

const mockedConfirmUserAction = jest.mocked(confirmUserAction);
const mockedFsExistsSync = jest.mocked(fs.existsSync);
const mockedFsWriteFileSync = jest.mocked(fs.writeFileSync);
const mockedPromptUserInput = jest.mocked(promptUserInput);
const mockedListFilesOnDirectory = jest.mocked(listFilesOnDirectory);
const mockedPromptUserOptions = jest.mocked(promptUserOptions);

class StopProcessError extends Error {
  constructor() {
    super();
    this.message = "Error on purpose to stop program execution";
  }
}

describe("generateConfigController", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe("When configuration file already exists", () => {
    beforeEach(() => {
      mockedFsExistsSync.mockImplementation(() => true);
    });

    describe("Should ask the user if wants to replace it", () => {
      describe("And user rejects replace it", () => {
        it("Then should stop execution", async () => {
          mockedConfirmUserAction.mockImplementation(async () => false);

          await expect(generateConfigController).rejects.toThrow();

          expect(mockProcessExit).toHaveBeenCalledWith(0);
          expect(mockedConfirmUserAction).toHaveBeenCalledWith(
            "The configuration file already exists. Do you want to overwrite it?:",
          );
        });
      });
    });
  });

  describe("When configuration file doesn't exists or user accepts replace it", () => {
    beforeEach(() => {
      mockedFsExistsSync.mockImplementation(() => false);
    });

    describe("Should ask the user for the folder where their localizations are", () => {
      describe("When folder provided by user is valid", () => {
        beforeEach(() => {
          mockedPromptUserInput.mockResolvedValueOnce("/tests/localization");
        });

        describe("And contains many files", () => {
          it("Then list the files on the folder and ask the user to confirm", async () => {
            mockedConfirmUserAction.mockImplementationOnce(() => {
              throw new StopProcessError();
            });

            await expect(generateConfigController).rejects.toThrow(
              StopProcessError,
            );

            const expectedResult = await listFilesOnDirectory("");

            expect(confirmUserAction).toBeCalledWith(
              expect.stringContaining(expectedResult.join("\n- ")),
            );
          });

          describe("And user confirms that is the folder he wants to use", () => {
            beforeEach(() => {
              mockedConfirmUserAction.mockImplementationOnce(async () => true);
            });

            describe("Should ask the user for the language of each file", () => {
              beforeEach(() => {
                mockedPromptUserInput.mockResolvedValueOnce("");
                mockedPromptUserInput.mockResolvedValueOnce("");
              });

              describe("When language is invalid", () => {
                beforeEach(() => {
                  mockedPromptUserOptions.mockResolvedValueOnce(
                    "wrongLanguage",
                  );
                });

                it("Then ask the user to use one language of the list", async () => {
                  mockedPromptUserInput.mockImplementationOnce(() => {
                    throw new StopProcessError();
                  });
                  await expect(generateConfigController).rejects.toThrow(
                    StopProcessError,
                  );

                  expect(mockedPromptUserOptions).toBeCalledWith(
                    expect.stringContaining(
                      "Please type the language name for the file",
                    ),
                    expect.arrayContaining(["es", "en"]),
                  );
                });
              });

              describe("When all languages selected are valid", () => {
                beforeEach(() => {
                  mockedPromptUserOptions.mockResolvedValueOnce("es");
                  mockedPromptUserOptions.mockResolvedValueOnce("en");
                  mockedPromptUserInput.mockResolvedValueOnce("");
                  mockedConfirmUserAction.mockResolvedValueOnce(true);
                });

                it("Then ask the users for the translation engines to use", async () => {
                  mockedConfirmUserAction.mockImplementationOnce(async () => {
                    throw new StopProcessError();
                  });
                  await expect(generateConfigController).rejects.toThrow(
                    StopProcessError,
                  );

                  expect(mockedConfirmUserAction).toBeCalledWith(
                    expect.stringContaining("Do you want to use"),
                  );
                  expect(mockedConfirmUserAction).toBeCalledWith(
                    expect.stringContaining("as translation engine?"),
                  );
                });
              });
            });
          });
        });

        describe("And don't contain files", () => {
          beforeEach(() => {
            mockedListFilesOnDirectory.mockImplementationOnce(async () => []);
          });

          it("Then ask the user if he is sure of use that folder", async () => {
            mockedConfirmUserAction.mockImplementationOnce(() => {
              throw new StopProcessError();
            });

            await expect(generateConfigController).rejects.toThrow(
              StopProcessError,
            );

            expect(confirmUserAction).toBeCalledWith(
              expect.stringContaining(
                "Are you sure you want to use this path?",
              ),
            );
          });
        });
      });

      describe("When folder provided by user is invalid or have not enought permissions", () => {
        beforeEach(() => {
          mockedPromptUserInput.mockResolvedValueOnce("/tests/localization");
          mockedPromptUserInput.mockImplementationOnce(async () => {
            throw new StopProcessError();
          });
          mockedListFilesOnDirectory.mockRejectedValueOnce(
            new Error("Folder doesn't exists"),
          );
        });

        it("Then ask the user to provide a valid folder path", async () => {
          await expect(generateConfigController).rejects.toThrow(
            StopProcessError,
          );
          expect(mockedPromptUserInput).toBeCalledWith(
            "Press enter to continue...\n\n",
          );
        });
      });

      describe("When user doesn't provide a folder", () => {
        beforeEach(() => {
          mockedPromptUserInput.mockResolvedValueOnce("");
          mockedPromptUserInput.mockImplementationOnce(() => {
            throw new StopProcessError();
          });
        });

        it("Then the script will repeat asking for the path again", async () => {
          await expect(generateConfigController).rejects.toThrow(
            StopProcessError,
          );
          expect(mockedPromptUserInput).toBeCalledWith(
            'Base path for the translations files: e.g. "src/localizations": ',
          );
          expect(mockedPromptUserInput).toBeCalledTimes(2);
        });
      });
    });

    describe("And user selects a folder that contains es.json, en.json, ja.json", () => {
      beforeEach(() => {
        mockedPromptUserInput.mockResolvedValueOnce("/tests/localization");
        mockedListFilesOnDirectory.mockImplementationOnce(async () => [
          "es.json",
          "en.json",
          "ja.json",
        ]);
        mockedConfirmUserAction.mockImplementationOnce(async () => true);
      });

      describe("And user select languages es, en and ja", () => {
        beforeEach(() => {
          mockedPromptUserInput.mockResolvedValueOnce("");
          mockedPromptUserInput.mockResolvedValueOnce("");
          mockedPromptUserOptions.mockResolvedValueOnce("es");
          mockedPromptUserOptions.mockResolvedValueOnce("en");
          mockedPromptUserOptions.mockResolvedValueOnce("ja");
          mockedPromptUserInput.mockResolvedValueOnce("");
        });

        describe("And user selects Google and Bing as Translation Engines", () => {
          beforeEach(() => {
            mockedConfirmUserAction.mockResolvedValue(true);
          });

          it("Then should create a configuration file with users' preferences", async () => {
            await generateConfigController();
            expect(mockedFsWriteFileSync).toBeCalledWith(
              expect.stringContaining("i18n-populator.config.json"),
              JSON.stringify(
                {
                  basePath: "/tests/localization",
                  translationEngines: ["google", "bing", "libreTranslate"],
                  languages: [
                    {
                      name: "es",
                      files: ["es.json"],
                    },
                    {
                      name: "en",
                      files: ["en.json"],
                    },
                    {
                      name: "ja",
                      files: ["ja.json"],
                    },
                  ],
                },
                null,
                2,
              ),
            );
          });
        });
      });
    });
  });
});
