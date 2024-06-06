const {
  supportedLanguages,
  getLanguagesCodesWithNames,
  validateLanguageIsSupportedByEngine,
  validateLanguageRequested,
  getLanguageCodeByEngine,
} = require("./supportedLanguagesUtils");

describe("getLanguagesCodesWithNames", () => {
  it("should return an array of formatted language strings", () => {
    const supportedLanguages = {
      en: { name: "English" },
      es: { name: "Spanish" },
      fr: { name: "French" },
    };

    const result = getLanguagesCodesWithNames(supportedLanguages);

    expect(result).toEqual(["en -> English", "es -> Spanish", "fr -> French"]);
  });

  it("should return an empty array if supportedLanguages is empty", () => {
    const supportedLanguages = {};

    const result = getLanguagesCodesWithNames(supportedLanguages);

    expect(result).toEqual([]);
  });

  it("should handle null or undefined values in supportedLanguages", () => {
    const supportedLanguages = {
      en: { name: "English" },
      es: null,
      fr: undefined,
      el: { name: undefined },
    };

    const result = getLanguagesCodesWithNames(supportedLanguages);

    expect(result).toEqual([
      "en -> English",
      "es -> Unknown",
      "fr -> Unknown",
      "el -> Unknown",
    ]);
  });
});

describe("validateLanguageIsSupportedByEngine", () => {
  it("should return true if the requested language is supported by the engine", () => {
    const requestedLanguage = "en";
    const engine = "google";

    const result = validateLanguageIsSupportedByEngine(
      requestedLanguage,
      engine,
    );

    expect(result).toBe(true);
  });

  it("should throw an error if the requested language is not supported by the engine", () => {
    const requestedLanguage = "ab";
    const engine = "google";

    expect(() => {
      validateLanguageIsSupportedByEngine(requestedLanguage, engine);
    }).toThrowError(
      `Language ${requestedLanguage} is not supported by google.`,
    );
  });
});

describe("getLanguageCodeByEngine", () => {
  it("should return the language code for the requested language and engine", () => {
    const requestedLanguage = "no";
    const engine = "bing";

    const result = getLanguageCodeByEngine(requestedLanguage, engine);

    expect(result).toBe(supportedLanguages[requestedLanguage][engine]);
  });

  it("should throw an error if the requested language is not supported by the engine", () => {
    const requestedLanguage = "ab";
    const engine = "google";

    expect(() => {
      getLanguageCodeByEngine(requestedLanguage, engine);
    }).toThrowError(
      `Language ${requestedLanguage} is not supported by google.`,
    );
  });
});

describe("validateLanguageRequested", () => {
  it("should return true if the requested language is supported", () => {
    const requestedLanguage = "en";

    const result = validateLanguageRequested(requestedLanguage);

    expect(result).toBe(true);
  });

  it("should throw an error if no language is provided", () => {
    const requestedLanguage = "";
    const error = new Error("No language provided");

    expect(() => {
      validateLanguageRequested(requestedLanguage);
    }).toThrowError(
      `${
        error.message
      }.\n\nPlease use one of these:\n\n${getLanguagesCodesWithNames(
        supportedLanguages,
      ).join("\n")}`,
    );
  });

  it("should throw an error if the requested language is not supported", () => {
    const requestedLanguage = "invalid-language";
    const error = new Error(`Language ${requestedLanguage} is not supported`);

    expect(() => {
      validateLanguageRequested(requestedLanguage);
    }).toThrowError(
      `${
        error.message
      }.\n\nPlease use one of these:\n\n${getLanguagesCodesWithNames(
        supportedLanguages,
      ).join("\n")}`,
    );
  });
});
