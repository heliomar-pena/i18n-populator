import { SetTranslateWithFallbackEngines } from "../services/translateService.d";
import { Engines, TranslationEngines } from "../types/settings.d";

/**
 * By default use Engines that doesn't require an API key
 */
const DEFAULT_ENGINES = [
  { name: Engines.GOOGLE },
  { name: Engines.BING },
  { name: Engines.LIBRE_TRANSLATE },
];

/**
 * Returns an array of translation engines to use based on the provided settings and CLI arguments. If no one is provided then the default engines are returned.
 * @param {Object} options - The options object.
 * @param {TranslationEngines} options.settingsTranslationEngines - The array of translation engines specified in the settings file.
 * @param {Engines} options.cliArgEngine - The translation engine specified as a CLI argument.
 * @returns The array of translation engines to use.
 */
const getTranslationEnginesToUse = ({
  settingsTranslationEngines,
  cliArgEngine,
}: SetTranslateWithFallbackEngines): Partial<TranslationEngines> => {
  const translationEnginesToUse: Partial<TranslationEngines> = [];

  if (cliArgEngine) {
    translationEnginesToUse.push({ name: cliArgEngine });
  }

  if (settingsTranslationEngines) {
    const settingsTranslationEnginesFiltered =
      settingsTranslationEngines.filter(
        (engine) => engine?.name !== cliArgEngine,
      );

    translationEnginesToUse.push(...settingsTranslationEnginesFiltered);
  }

  if (translationEnginesToUse.length === 0) {
    translationEnginesToUse.push(...DEFAULT_ENGINES);
  }

  return translationEnginesToUse;
};

export { getTranslationEnginesToUse, DEFAULT_ENGINES };
