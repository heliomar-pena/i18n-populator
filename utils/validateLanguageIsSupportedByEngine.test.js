const {
  validateLanguageIsSupportedByEngine,
} = require("./validateLanguageIsSupportedByEngine");

describe("validateLanguageIsSupportedByEngine", () => {
  it("should return true if the requested language is supported by the engine", () => {
    const requestedLanguage = "en";
    const engine = "google";

    const result = validateLanguageIsSupportedByEngine(
      requestedLanguage,
      engine
    );

    expect(result).toBe(true);
  });

  it("should throw an error if the requested language is not supported by the engine", () => {
    const requestedLanguage = "ab";
    const engine = "google";

    expect(() => {
      validateLanguageIsSupportedByEngine(requestedLanguage, engine);
    }).toThrowError(`Language ${requestedLanguage} is not supported by this google.`);
  });
});
