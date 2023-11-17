const supportedLanguages = require('../SUPPORTED-LANGUAGES.json');
const { validEngines } = require('../services/translateService');
const { getSupportedLanguagesWithNames } = require('./formatSupportedLanguages');

const validateLanguageRequested = (requestedLanguage) => {
    try {
        if (!requestedLanguage) throw new Error('No language provided');
        
        const isLanguageSupported = supportedLanguages[requestedLanguage] !== undefined;
        
        if (!isLanguageSupported) throw new Error(`Language ${requestedLanguage} is not supported`);

        const isLanguageSupportedByAlmostOneEngine = Object.keys(supportedLanguages[requestedLanguage]).some(value => validEngines.includes(value));

        if (!isLanguageSupportedByAlmostOneEngine) throw new Error(`Language ${requestedLanguage} is not supported by any engine`);

        return true;
    } catch (error) {
        throw new Error(`${error.message}.\n\nPlease use one of these:\n\n${getSupportedLanguagesWithNames(supportedLanguages).join('\n')}`)
    }
}

module.exports = { validateLanguageRequested }
