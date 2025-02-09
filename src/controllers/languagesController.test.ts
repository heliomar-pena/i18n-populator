import { describe, expect, it, beforeEach } from "@jest/globals";
import { Engines } from "../types/settings.d";
import languagesController from "./languagesController";
import { validEngines } from "../utils/translationEnginesUtils";
import {
  supportedLanguages,
  supportedLanguagesGroupedByEngine,
} from "../utils/supportedLanguagesUtils";

describe("LanguagesController", () => {
  let byEngine;

  beforeEach(() => {
    byEngine = Engines.GOOGLE;
  });

  describe("When engine is provided", () => {
    describe("And is invalid", () => {
      beforeEach(() => {
        byEngine = "wrongEngine" as Engines;
      });

      it("should throw an error", () => {
        expect(languagesController.bind(null, { byEngine })).toThrow(
          new Error(
            `You've provided an invalid engine as arg on your CLI Command. Try with one of these: ${validEngines.join(", ")}`,
          ),
        );
      });
    });

    describe("And is valid", () => {
      Object.values(Engines).forEach((value) => {
        describe(`And is ${value}`, () => {
          it("should return the languages for that engine", () => {
            const { totalLanguages, languages } = languagesController({
              byEngine: value,
            });

            expect(totalLanguages).toEqual(
              Object.keys(supportedLanguagesGroupedByEngine[value]).length,
            );
            expect(languages).toEqual(supportedLanguagesGroupedByEngine[value]);
          });
        });
      });
    });
  });

  describe("When engine is not provided", () => {
    it("should return all languages", () => {
      const { totalLanguages, languages } = languagesController({});

      expect(totalLanguages).toEqual(Object.keys(supportedLanguages).length);
      expect(languages).toEqual(supportedLanguages);
    });
  });
});
