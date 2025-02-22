import { describe, expect, it, beforeEach } from "@jest/globals";
import {
  getTranslationEnginesToUse,
  DEFAULT_ENGINES,
} from "./getTranslationEnginePreferences";
import { Engines, TranslationEngines } from "../types/settings.d";

describe("getTranslationEnginesToUse", () => {
  let cliArgEngine: Engines,
    settingsTranslationEngines: Partial<TranslationEngines>;

  describe("When engine is defined", () => {
    describe("In CLI", () => {
      beforeEach(() => {
        cliArgEngine = Engines.GOOGLE;
      });

      it("should return an array with the cliArgEngine", () => {
        const result = getTranslationEnginesToUse({ cliArgEngine });
        expect(result).toEqual([{ name: cliArgEngine }]);
      });
    });
    describe("In Settings File", () => {
      beforeEach(() => {
        settingsTranslationEngines = [
          { name: Engines.GOOGLE },
          { name: Engines.BING },
        ];
      });

      it("should return an array with the engines defined in settings", () => {
        const result = getTranslationEnginesToUse({
          settingsTranslationEngines,
          cliArgEngine,
        });
        expect(result).toEqual(settingsTranslationEngines);
      });
    });
    describe("In CLI and Settings File", () => {
      beforeEach(() => {
        settingsTranslationEngines = [
          { name: Engines.BING },
          { name: Engines.GOOGLE },
        ];
        cliArgEngine = Engines.GOOGLE;
      });

      it("should return all provided engines, cli engine have more priority, should not be repeated", () => {
        const result = getTranslationEnginesToUse({
          settingsTranslationEngines,
          cliArgEngine,
        });

        const filteredResult = [
          { name: cliArgEngine },
          ...settingsTranslationEngines.filter(
            (engines) => engines?.name !== cliArgEngine,
          ),
        ];

        expect(result).toEqual(filteredResult);
      });
    });
  });

  describe("When engine is not defined", () => {
    it("should return an array with the DEFAULT_ENGINES if neither cliArgEngine nor settingsTranslationEngines are provided", () => {
      const result = getTranslationEnginesToUse({
        settingsTranslationEngines: undefined,
        cliArgEngine: undefined,
      });
      expect(result).toEqual(DEFAULT_ENGINES);
    });
  });
});
