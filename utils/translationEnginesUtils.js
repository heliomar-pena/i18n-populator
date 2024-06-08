import { translate as googleTranslate } from '@vitalets/google-translate-api';
import { translate as bingTranslate } from '../services/bingTranslate.js';
import { translate as libreTranslate } from '../services/libreTranslate.js';

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

export {
  translateEngines,
  validEngines,
  isEngineValid,
};
