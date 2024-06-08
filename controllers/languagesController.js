import {
  supportedLanguages as allSupportedLanguages,
  getLanguagesCodesWithNames,
  supportedLanguagesGroupedByEngine,
} from '../utils/supportedLanguagesUtils.js';

import { isEngineValid, validEngines } from '../utils/translationEnginesUtils.js';

const languagesController = ({ byEngine: engine }) => {
  if (engine && !isEngineValid(engine))
    throw new Error(
      `You've provided an invalid engine as arg on your CLI Command. Try with one of these: ${validEngines.join(", ")}`,
    );

  const supportedLanguages = engine
    ? supportedLanguagesGroupedByEngine[engine]
    : allSupportedLanguages;

  const formattedSupportedLanguages =
    getLanguagesCodesWithNames(supportedLanguages);

  console.log(
    `${formattedSupportedLanguages.length} Languages supported:\n\n${formattedSupportedLanguages.join("\n")}`,
  );
};

export { languagesController };
