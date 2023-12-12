const allLanguagesCodes = require('../ALL-LANGUAGES-CODES.json');
const { validEngines } = require('./translationEnginesUtils');

/**
 * Object containing supported languages and their corresponding language codes.
 * @type {Object}
 */
const supportedLanguages = Object.keys(allLanguagesCodes).reduce((acc, language) => {
    const isLanguageSupportedByAlmostOneEngine = Object.keys(allLanguagesCodes[language]).some(value => validEngines.includes(value));

    if (isLanguageSupportedByAlmostOneEngine) acc[language] = allLanguagesCodes[language];

    return acc;
}, {});

/**
 * An array containing all the supported languages without extra data as language name or supported engines. Only the language code.
 * b.e ['en', 'es', 'pt', ...]
 */
const supportedLanguagesCodes = Object.keys(supportedLanguages);

/**
 * Groups the supported languages by engine.
 *
 * @type {Object.<string, string[]>}
 */
const supportedLanguagesGroupedByEngine = Object.keys(supportedLanguages).reduce((acc, language) => {
    Object.keys(supportedLanguages[language]).forEach(engine => {
        const languageObject = supportedLanguages[language];

        if (!acc[engine]) acc[engine] = {};
        acc[engine] = { ...acc[engine], [language]: { ...languageObject[engine], name: languageObject.name } };
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
const supportedLanguagesByLibreTranslate = supportedLanguagesGroupedByEngine.libreTranslate;

/**
 * Validates if a language is supported by a specific engine.
 *
 * @param {string} requestedLanguage - The language to be validated.
 * @param {string} engine - The engine to check if the language is supported.
 * @throws {Error} If the language is not supported by the engine.
 * @returns {boolean} Returns true if the language is supported by the engine.
 */
const validateLanguageIsSupportedByEngine = (requestedLanguage, engine) => {
    const isLanguageSupportedByEngine = supportedLanguagesGroupedByEngine[engine][requestedLanguage] !== undefined;

    if (!isLanguageSupportedByEngine) throw new Error(`Language ${requestedLanguage} is not supported by ${engine}.`);

    return true;
}

/**
 * Retrieves the language code for a given language and engine.
 *
 * @param {string} requestedLanguage - The requested language.
 * @param {string} engine - The engine.
 * @returns {string} The language code.
 */
const getLanguageCodeByEngine = (requestedLanguage, engine) => {
    validateLanguageIsSupportedByEngine(requestedLanguage, engine);

    return allLanguagesCodes[requestedLanguage][engine];
}

/**
 * Returns an array of language codes with their corresponding names.
 * @param {Object} languages - An object containing language codes and their data.
 * @returns {Array} - An array of strings in the format "languageCode -> languageName".
 */
const getLanguagesCodesWithNames = (languages) => {
    return Object.entries(languages).map(([language, data]) => {
        return `${language} -> ${data?.name || "Unknown"}`
    })
}

/**
 * Validates the requested language.
 * 
 * @param {string} requestedLanguage - The language to be validated.
 * @returns {boolean} - Returns true if the language is valid.
 * @throws {Error} - Throws an error if the language is not provided, not supported, or not supported by any engine.
 */
const validateLanguageRequested = (requestedLanguage) => {
    try {
        if (!requestedLanguage) throw new Error('No language provided');
        
        const isLanguageSupported = supportedLanguages[requestedLanguage] !== undefined;
        
        if (!isLanguageSupported) throw new Error(`Language ${requestedLanguage} is not supported`);

        return true;
    } catch (error) {
        throw new Error(`${error.message}.\n\nPlease use one of these:\n\n${getLanguagesCodesWithNames(supportedLanguages).join('\n')}`)
    }
}

module.exports = {
    getLanguagesCodesWithNames,
    getLanguageCodeByEngine,
    validateLanguageIsSupportedByEngine,
    validateLanguageRequested,
    supportedLanguages,
    supportedLanguagesByBing,
    supportedLanguagesByGoogle,
    supportedLanguagesByLibreTranslate,
    supportedLanguagesGroupedByEngine,
    supportedLanguagesCodes    
}
