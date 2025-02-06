import {
  getTranslationEnginesToUse,
  DEFAULT_ENGINES,
} from "../utils/getTranslationEnginePreferences.js";

describe("getTranslationEnginesToUse", () => {
  it("should return an array with the cliArgEngine if it is provided", () => {
    const cliArgEngine = "google";
    const result = getTranslationEnginesToUse({ cliArgEngine });
    expect(result).toEqual([{ name: "google" }]);
  });

  it("should return an array with the settingsTranslationEngines and the cliArgEngine if both are provided. cliArgEngine have more priority", () => {
    const settingsTranslationEngines = [{ name: "google" }, { name: "bing" }];
    const cliArgEngine = "yandex";

    const result = getTranslationEnginesToUse({
      settingsTranslationEngines,
      cliArgEngine,
    });
    expect(result).toEqual([
      { name: "yandex" },
      { name: "google" },
      { name: "bing" },
    ]);
  });

  it("should return an array with the settingsTranslationEngines if cliArgEngine is not provided", () => {
    const settingsTranslationEngines = [{ name: "google" }, { name: "bing" }];
    const cliArgEngine = null;
    const result = getTranslationEnginesToUse({
      settingsTranslationEngines,
      cliArgEngine,
    });
    expect(result).toEqual([{ name: "google" }, { name: "bing" }]);
  });

  it("should return an array with the DEFAULT_ENGINES if neither cliArgEngine nor settingsTranslationEngines are provided", () => {
    const settingsTranslationEngines = null;
    const cliArgEngine = null;
    const result = getTranslationEnginesToUse({
      settingsTranslationEngines,
      cliArgEngine,
    });
    expect(result).toEqual(DEFAULT_ENGINES);
  });
});
