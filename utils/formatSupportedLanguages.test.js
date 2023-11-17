const { getSupportedLanguagesWithNames } = require("../utils/formatSupportedLanguages");

describe("getSupportedLanguagesWithNames", () => {
  it("should return an array of formatted language strings", () => {
    const supportedLanguages = {
      en: { name: "English" },
      es: { name: "Spanish" },
      fr: { name: "French" },
    };

    const result = getSupportedLanguagesWithNames(supportedLanguages);

    expect(result).toEqual(["en -> English", "es -> Spanish", "fr -> French"]);
  });

  it("should return an empty array if supportedLanguages is empty", () => {
    const supportedLanguages = {};

    const result = getSupportedLanguagesWithNames(supportedLanguages);

    expect(result).toEqual([]);
  });

  it("should handle null or undefined values in supportedLanguages", () => {
    const supportedLanguages = {
      en: { name: "English" },
      es: null,
      fr: undefined,
      el: { name: undefined }
    };

    const result = getSupportedLanguagesWithNames(supportedLanguages);

    expect(result).toEqual(["en -> English", "es -> Unknown", "fr -> Unknown", "el -> Unknown"]);
  });
});