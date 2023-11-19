const {
  translate: googleTranslate,
} = require("@vitalets/google-translate-api");
const { translate: bingTranslate } = require("../services/bingTranslate");
const { translate: libreTranslate } = require("../services/libreTranslate");

const translateEngines = {
  google: googleTranslate,
  bing: bingTranslate,
  libreTranslate,
};

const validEngines = Object.keys(translateEngines);

/**
 * Checks if the given translation engine is valid.
 * @param {string} engine - The translation engine to check.
 * @returns {boolean} - True if the given translation engine is valid, false otherwise.
 */
const isEngineValid = (engine) => validEngines.includes(engine);

module.exports = {
    translateEngines,
    validEngines,
    isEngineValid,
}
