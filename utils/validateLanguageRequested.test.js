const supportedLanguages = require('../SUPPORTED-LANGUAGES.json');
const { getSupportedLanguagesWithNames } = require("./formatSupportedLanguages");
const {
  validateLanguageRequested,
} = require("./validateLanguageRequested");

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
    }).toThrowError(`${error.message}.\n\nPlease use one of these:\n\n${getSupportedLanguagesWithNames(supportedLanguages).join('\n')}`);
  });

  it("should throw an error if the requested language is not supported", () => {
    const requestedLanguage = "invalid-language";
    const error = new Error(`Language ${requestedLanguage} is not supported`);

    expect(() => {
      validateLanguageRequested(requestedLanguage);
    }).toThrowError(`${error.message}.\n\nPlease use one of these:\n\n${getSupportedLanguagesWithNames(supportedLanguages).join('\n')}`);
  });

  it("should throw an error if the requested language is not supported by any engine", () => {
    const requestedLanguage = "ab";
    const error = new Error(`Language ${requestedLanguage} is not supported by any engine`);

    expect(() => {
      validateLanguageRequested(requestedLanguage);
    }).toThrowError(`${error.message}.\n\nPlease use one of these:\n\n${getSupportedLanguagesWithNames(supportedLanguages).join('\n')}`);
  });
});