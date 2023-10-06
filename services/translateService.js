const { translate: googleTranslate } = require("@vitalets/google-translate-api");
const { translate: bingTranslate } = require("./bingTranslate");
const { getTranslationEnginesToUse } = require("../utils/getTranslationEnginePreferences");

const translateEngines = {
  google: googleTranslate,
  bing: bingTranslate,
};

const validEngines = Object.keys(translateEngines);

/**
 * Checks if the given translation engine is valid.
 * @param {string} engine - The translation engine to check.
 * @returns {boolean} - True if the given translation engine is valid, false otherwise.
 */
const isEngineValid = (engine) => validEngines.includes(engine);

/**
 * Translates the given text from one language to another using the specified translation engine.
 * @param {string} text - The text to be translated.
 * @param {string} from - The language code of the text to be translated.
 * @param {string} to - The language code to translate the text to.
 * @param {string} engine - The translation engine to use. Defaults to 'google'.
 * @returns {Promise<{text: string}>} - A Promise that resolves to an object containing the translated text.
 * @throws {Error} - If an invalid translation engine is specified.
 */
const translate = async (text, from, to, engine = "google") => {
  if (!translateEngines[engine])
    throw new Error(`Invalid engine. Try with one of these: ${validEngines.join(', ')}`);

  if (from === to) return { text };

  return await translateEngines[engine](text, { from, to });
};

/**
 * Sets the translation engine(s) to use and a function to translate with fallback engines.
 * @param {string[]} settingsTranslationEngines - An array of translation engines to use, in order of preference.
 * @param {string} cliArgEngine - The translation engine specified in the CLI arguments.
 * @returns {{engines: string[], translateWithFallbackEngines: function}} - An object containing the translation engines to use and a function to translate with fallback engines.
 */
const setTranslateWithFallbackEngines = ({
  settingsTranslationEngines,
  cliArgEngine,
}) => {
  const engines = getTranslationEnginesToUse({
    settingsTranslationEngines,
    cliArgEngine,
  });
  const enginesFailed = [];

  /**
   * Translates the given text from one language to another using the specified translation engines in order of preference.
   * @param {string} text - The text to be translated.
   * @param {string} from - The language code of the text to be translated.
   * @param {string} to - The language code to translate the text to.
   * @param {string[]} engines - An array of translation engines to use, in order of preference.
   * @returns {Promise<{text: string}>} - A Promise that resolves to an object containing the translated text.
   * @throws {Error} - If there is not translation result.
   */
  const translateWithFallbackEngines = async (text, from, to) => {
    let result;

    // Avoid trying to use engines that have failed in the past to save time and network requests
    const enginesFiltered = engines.filter(
      (engine) => !enginesFailed.includes(engine)
    );

    for await (const engine of enginesFiltered) {
      await translate(text, from, to, engine)
        .then(({ text }) => {
          result = text;
        })
        .catch(() => {
          console.log(
            `Error translating with ${engine} engine. Trying next engine...`
          );
          enginesFailed.push(engine);
        });

      if (result) break;
    }

    if (!result) {
      const enginesUsed = engines.join(", ");

      throw new Error(
        `Error translating ${text} from ${from} to ${to} using ${enginesUsed}. Please check your internet connection and try again.`
      );
    }

    return { text: result };
  };

  return { engines, translate: translateWithFallbackEngines };
};

module.exports = { translate, validEngines, setTranslateWithFallbackEngines, isEngineValid };
