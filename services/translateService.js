import { getLanguageCodeByEngine } from "../utils/supportedLanguagesUtils.js";
import { getTranslationEnginesToUse } from "../utils/getTranslationEnginePreferences.js";
import {
  validEngines,
  translateEngines,
  isEngineValid,
} from "../utils/translationEnginesUtils.js";

const translate = async (text, from, to, engine = { name: "google" }) => {
  const { name: engineName, ...config } = engine;

  if (!isEngineValid(engineName))
    throw new Error(
      `Invalid engine. Try with one of these: ${validEngines.join(", ")}`,
    );

  if (from === to) return { text };

  return await translateEngines[engineName](text, { from, to }, config);
};

const setTranslateWithFallbackEngines = ({
  settingsTranslationEngines,
  cliArgEngine,
}) => {
  const engines = getTranslationEnginesToUse({
    settingsTranslationEngines,
    cliArgEngine,
  });
  const enginesFailed = [];

  const translateWithFallbackEngines = async (text, from, to) => {
    let result;

    const enginesFiltered = engines.filter(
      (engine) => !enginesFailed.includes(engine.name),
    );

    for await (const engine of enginesFiltered) {
      try {
        const fromLanguageCode = getLanguageCodeByEngine(from, engine.name);
        const toLanguageCode = getLanguageCodeByEngine(to, engine.name);

        await translate(text, fromLanguageCode, toLanguageCode, engine)
          .then(({ text }) => {
            result = text;
            console.log(
              `Translated successfully with ${engine.name} engine. Result: ${text}`,
            );
          })
          .catch(() => {
            enginesFailed.push(engine.name);
            throw new Error(
              `Error translating with ${engine.name} engine. Trying next engine...`,
            );
          });

        if (result) break;
      } catch (error) {
        console.log(error.message);
      }
    }

    if (!result) {
      const enginesUsed = engines.map((e) => e.name).join(", ");

      throw new Error(
        `Error translating ${text} from ${from} to ${to} using ${enginesUsed}.
\nPlease check that requested languages is supported using the command "languages" or check your internet connection and try again.\n\nFor more info check CLI help or open an issue at https://github.com/victor-heliomar/i18n-populator/issues/new`,
      );
    }

    return { text: result };
  };

  return { engines, translate: translateWithFallbackEngines };
};

export {
  translate,
  validEngines,
  setTranslateWithFallbackEngines,
  isEngineValid,
};
