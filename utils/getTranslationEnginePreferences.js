/**
 * By default use Engines that doesn't require an API key
 */
const DEFAULT_ENGINES = ["google", "bing", "libreTranslate"];

/**
 * Returns an array of translation engines to use based on the provided settings and CLI arguments. If no one is provided then the default engines are returned.
 * @param {Object} options - The options object.
 * @param {Array} options.settingsTranslationEngines - The array of translation engines specified in the settings file.
 * @param {string} options.cliArgEngine - The translation engine specified as a CLI argument.
 * @returns {Array} - The array of translation engines to use.
 */
const getTranslationEnginesToUse = ({
  settingsTranslationEngines,
  cliArgEngine,
}) => {
  const translationEnginesToUse = [];

  if (cliArgEngine) {
    translationEnginesToUse.push(cliArgEngine);
  }

  if (settingsTranslationEngines) {
    const settingsTranslationEnginesFiltered =
      settingsTranslationEngines.filter((engine) => engine !== cliArgEngine);

    translationEnginesToUse.push(...settingsTranslationEnginesFiltered);
  }

  if (translationEnginesToUse.length === 0) {
    translationEnginesToUse.push(...DEFAULT_ENGINES);
  }

  return translationEnginesToUse;
};

export default { getTranslationEnginesToUse, DEFAULT_ENGINES };
