import { validEngines } from "./translationEnginesUtils";
import { Engines } from "../types/settings.d";
import {
  AllLanguagesCodes,
  AllLanguagesGroupedByEngine,
  GetLanguageCodeByEngine,
  GetLanguagesCodesWithNames,
  ValidateLanguageIsSupportedByEngine,
  ValidateLanguageRequested,
} from "./supportedLanguagesUtils.d";
import allLanguagesCodes from "../ALL-LANGUAGES-CODES.json";

/**
 * Object containing supported languages and their corresponding language codes.
 */
const supportedLanguages: AllLanguagesCodes = Object.keys(
  allLanguagesCodes,
).reduce((acc, language) => {
  const isLanguageSupportedByAlmostOneEngine = Object.keys(
    allLanguagesCodes[language],
  ).some((value: Engines) => validEngines.includes(value));

  if (isLanguageSupportedByAlmostOneEngine)
    acc[language] = allLanguagesCodes[language];

  return acc;
}, {});

/**
 * An array containing all the supported languages without extra data as language name or supported engines. Only the language code.
 * e.g. ['en', 'es', 'pt', ...]
 */
const supportedLanguagesCodes: string[] = Object.keys(supportedLanguages);

const supportedLanguagesGroupedByEngine: AllLanguagesGroupedByEngine =
  Object.keys(supportedLanguages).reduce((acc, language) => {
    Object.keys(supportedLanguages[language]).forEach((engine: Engines) => {
      const languageObject = supportedLanguages[language];

      if (!acc[engine]) acc[engine] = {};
      acc[engine] = {
        ...acc[engine],
        [language]: { name: languageObject.name },
      };
    });

    return acc;
  }, {});

/**
 * The supported languages by Google.
 * @type {Object}
 */
const supportedLanguagesByGoogle = supportedLanguagesGroupedByEngine.google;

/**
 * The supported languages by Bing.
 * @type {Array<string>}
 */
const supportedLanguagesByBing = supportedLanguagesGroupedByEngine.bing;

/**
 * The supported languages by LibreTranslate.
 * @type {Array<string>}
 */
const supportedLanguagesByLibreTranslate =
  supportedLanguagesGroupedByEngine.libreTranslate;

/**
 * Validates if a language is supported by a specific engine.
 *
 * @param {string} requestedLanguage - The language to be validated.
 * @param {Engines} engine - The engine to check if the language is supported.
 * @throws {Error} If the language is not supported by the engine.
 * @returns {boolean} Returns true if the language is supported by the engine.
 */
const validateLanguageIsSupportedByEngine: ValidateLanguageIsSupportedByEngine =
  (requestedLanguage, engine) => {
    const isLanguageSupportedByEngine =
      supportedLanguagesGroupedByEngine[engine][requestedLanguage] !==
      undefined;

    if (!isLanguageSupportedByEngine)
      throw new Error(
        `Language ${requestedLanguage} is not supported by ${engine}.`,
      );

    return true;
  };

/**
 * Retrieves the language code for a given language and engine.
 *
 * @param {string} requestedLanguage - The requested language.
 * @param {Engines} engine - The engine.
 * @returns {string} The language code.
 */
const getLanguageCodeByEngine: GetLanguageCodeByEngine = (
  requestedLanguage,
  engine,
) => {
  validateLanguageIsSupportedByEngine(requestedLanguage, engine);

  return allLanguagesCodes[requestedLanguage][engine];
};

/**
 * Returns an array of language codes with their corresponding names.
 * @param {AllLanguagesCodes} languages - An object containing language codes and their data.
 * @returns {string[]} - An array of strings in the format "languageCode -> languageName".
 */
const getLanguagesCodesWithNames: GetLanguagesCodesWithNames = (languages) => {
  return Object.entries(languages).map(([language, data]) => {
    return `${language} -> ${data?.name || "Unknown"}`;
  });
};

/**
 * Validates the requested language.
 *
 * @param {string} requestedLanguage - The language to be validated.
 * @returns {boolean} - Returns true if the language is valid.
 * @throws {Error} - Throws an error if the language is not provided or not supported
 */
const validateLanguageRequested: ValidateLanguageRequested = (
  requestedLanguage,
) => {
  try {
    if (!requestedLanguage) throw new Error("No language provided");

    const isLanguageSupported =
      supportedLanguages[requestedLanguage] !== undefined;

    if (!isLanguageSupported)
      throw new Error(`Language ${requestedLanguage} is not supported`);

    return true;
  } catch (error) {
    throw new Error(
      `${error.message}.\n\nPlease use one of these:\n\n${getLanguagesCodesWithNames(supportedLanguages).join("\n")}`,
    );
  }
};

export {
  getLanguagesCodesWithNames,
  getLanguageCodeByEngine,
  validateLanguageIsSupportedByEngine,
  validateLanguageRequested,
  supportedLanguages,
  supportedLanguagesByBing,
  supportedLanguagesByGoogle,
  supportedLanguagesByLibreTranslate,
  supportedLanguagesGroupedByEngine,
  supportedLanguagesCodes,
};
