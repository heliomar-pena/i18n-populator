const {
  supportedLanguages: allSupportedLanguages,
  getLanguagesCodesWithNames,
  supportedLanguagesGroupedByEngine,
} = require("../utils/supportedLanguagesUtils");
const {
  isEngineValid,
  validEngines,
} = require("../utils/translationEnginesUtils");

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

module.exports = { languagesController };
