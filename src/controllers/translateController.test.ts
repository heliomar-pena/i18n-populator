import { validEngines } from "../services/translateService";
import fs from "fs";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import {
  getLanguagesCodesWithNames,
  supportedLanguages,
} from "../utils/supportedLanguagesUtils";
import translateController from "./translateController";
import { TranslateController } from "./translateController.d";
import { Engines } from "../types/settings.d";
import { parsePath } from "../utils/getConfigPath";
import { importJsonFile } from "../utils/importJsonFile";

const configFile = {
  basePath: "example",
  translationEngines: [
    { name: "google" },
    { name: "bing" },
    { name: "libreTranslate" },
  ],
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
};

jest.mock("../utils/importJsonFile", () => ({
  importJsonFile: jest.fn(() => {}),
}));

jest.mock("../utils/getOrCreateJsonFile", () => ({
  getOrCreateJsonFile: jest.fn((basePath, fileName) => {
    return {
      file: {},
      parsedPath: parsePath(`${basePath}/${fileName}`),
    };
  }),
}));

const mockedImport = jest.mocked(importJsonFile);
const mockedExistsSync = jest.mocked(fs.existsSync);

describe("TranslateController", () => {
  let text, from, name, engine, settingsFile;

  beforeEach(() => {
    text = "Hello World";
    from = "en";
    name = "helloWorld";
    engine = Engines.GOOGLE;
    settingsFile = "/__fake_only_tests_i18n-populator.config.json";

    mockedExistsSync.mockImplementation(() => true);

    mockedImport.mockImplementation(
      async <ReturnType>(fileName: string): Promise<ReturnType> => {
        return (
          fileName.endsWith(settingsFile) ? configFile : {}
        ) as ReturnType;
      },
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe("When text, language and name are provided", () => {
    describe("and language is invalid", () => {
      it("should throw an error", () => {
        from = "wrongLanguage";

        expect(
          translateController({
            name,
            from,
            text,
            settingsFile,
          }),
        ).rejects.toThrow(
          `Language ${from} is not supported.\n\nPlease use one of these:\n\n${getLanguagesCodesWithNames(supportedLanguages).join("\n")}`,
        );
      });
    });

    it("should add the new translations into the languages' json files", async () => {
      await translateController({
        from,
        name,
        text,
        engine,
        settingsFile,
      });

      expect(fs.writeFileSync).toBeCalledTimes(2);
    });

    describe("and engine is provided", () => {
      describe("and engine is invalid", () => {
        it("should throw an error", () => {
          expect(
            translateController({
              from,
              name,
              text,
              engine: "badEngine" as Engines,
              settingsFile,
            } as TranslateController),
          ).rejects.toThrow(
            `You've provided an invalid engine as arg on your CLI Command. Try with one of these: ${validEngines.join(", ")}`,
          );
        });
      });
    });
  });

  describe("When text, language or name are not provided", () => {
    it("should throw an error", () => {
      expect(
        translateController({
          from,
          name,
          settingsFile,
        } as TranslateController),
      ).rejects.toThrow("No text to translate provided");

      expect(
        translateController({
          text,
          name,
          settingsFile,
        } as TranslateController),
      ).rejects.toThrow("No language provided");

      expect(
        translateController({
          text,
          from,
          settingsFile,
        } as TranslateController),
      ).rejects.toThrow("No name of translation provided");
    });
  });
});
