const { validEngines } = require("../services/translateService");

/**
 * By default use Engines that doesn't require an API key
 */
const DEFAULT_ENGINES = ['google', 'bing'];

const getTranslationEnginesToUse = ({ settingsTranslationEngines, cliArgEngine }) => {
    const translationEnginesToUse = [];

    if (cliArgEngine) {
        translationEnginesToUse.push(cliArgEngine);
    }

    if (settingsTranslationEngines) {
        const settingsTranslationEnginesFiltered = settingsTranslationEngines.filter((engine) => engine !== cliArgEngine);

        translationEnginesToUse.push(...settingsTranslationEnginesFiltered);
    }
    
    if (translationEnginesToUse.length === 0) {
        translationEnginesToUse.push(...DEFAULT_ENGINES);
    }
    
    return translationEnginesToUse;
}

module.exports = { getTranslationEnginesToUse }
