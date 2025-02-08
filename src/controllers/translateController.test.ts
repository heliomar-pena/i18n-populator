import { translate } from "@vitalets/google-translate-api";
import { configPath, parsePath } from "../utils/getConfigPath";
import prompt from "../utils/promptUser";
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
import { getOrCreateJsonFile } from "../utils/getOrCreateJsonFile";
import {
  getLanguagesCodesWithNames,
  supportedLanguages,
} from "../utils/supportedLanguagesUtils";
import translateController from "./translateController";
import { TranslateController } from "./translateController.d";
import { Engines } from "../types/settings";

const config = {
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
};

describe("TranslateController", () => {
  let text, from, name, settingsFile;

  beforeEach(() => {
    text = "Hello World";
    from = "en";
    name = "helloWorld";
    settingsFile = "/i18n-populator.config.json";

    (fs.existsSync as jest.Mock).mockImplementation(() => true);
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
          })
        ).rejects.toThrow(
          `Language ${from} is not supported.\n\nPlease use one of these:\n\n${getLanguagesCodesWithNames(supportedLanguages).join("\n")}`
        );
      });
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
            } as TranslateController)
          ).rejects.toThrow(
            `You've provided an invalid engine as arg on your CLI Command. Try with one of these: ${validEngines.join(", ")}`
          );
        });
      });
    });
  });

  describe("When text, language or name are not provided", () => {
    it("should throw an error", () => {
      expect(
        translateController({ from, name, settingsFile } as TranslateController)
      ).rejects.toThrow("No text to translate provided");

      expect(
        translateController({ text, name, settingsFile } as TranslateController)
      ).rejects.toThrow("No language provided");

      expect(
        translateController({ text, from, settingsFile } as TranslateController)
      ).rejects.toThrow("No name of translation provided");
    });
  });
});
