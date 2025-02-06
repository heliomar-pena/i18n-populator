import { translate as googleTranslate } from "@vitalets/google-translate-api";
import { translate as bingTranslate } from "../services/bingTranslate";
import { translate as libreTranslate } from "../services/libreTranslate";
import { Engines } from "./translationEnginesUtils.d";

const translateEngines = {
  [Engines.GOOGLE]: googleTranslate,
  [Engines.BING]: bingTranslate,
  [Engines.LIBRE_TRANSLATE]: libreTranslate,
};

const validEngines = Object.values(Engines);

/**
 * Checks if the given translation engine is valid.
 * @param {string} engine - The translation engine to check.
 * @returns {boolean} - True if the given translation engine is valid, false otherwise.
 */
const isEngineValid = (engine) => validEngines.includes(engine);

export { translateEngines, validEngines, isEngineValid };
