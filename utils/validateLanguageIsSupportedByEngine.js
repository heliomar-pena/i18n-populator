const supportedLanguages = require('../SUPPORTED-LANGUAGES.json');

const validateLanguageIsSupportedByEngine = (requestedLanguage, engine) => {
    const isLanguageSupportedByEngine = Object.keys(supportedLanguages[requestedLanguage]).includes(engine);

    if (!isLanguageSupportedByEngine) throw new Error(`Language ${requestedLanguage} is not supported by this ${engine}.`);

    return true;
}

module.exports = { validateLanguageIsSupportedByEngine }
