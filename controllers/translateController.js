const { translate } = require('../services/translateService');
const fs = require('fs');
const { parsePath } = require('../utils/getConfigPath');
const { validateSettingsFile } = require('../utils/validateSettingsFile');
const { dset: setDeepValue } = require('dset');
const { validateAndPromptUserJSONFiles } = require('../utils/validateAndPromptUserJSONFiles');
const { getTranslationEnginesToUse } = require('../utils/getTranslationEnginePreferences');

const translateController = async (text, sourceLanguage, nameOfTranslation, options) => {
  const settingsFilePath = parsePath(options.settingsFile);
  const isValidSettingsFile = validateSettingsFile(settingsFilePath);
  const enginesFailed = [];

  if (!isValidSettingsFile) throw new Error('Invalid settings file');
  if (!text) throw new Error('No text to translate provided');
  if (!sourceLanguage) throw new Error('No source language provided');
  if (!nameOfTranslation) throw new Error('No name of translation provided');
  
  const { languages, basePath, translationEngines: settingsTranslationEngines } = require(settingsFilePath); 
  const translationEngines = getTranslationEnginesToUse({settingsTranslationEngines, cliArgEngine: options.engine});
  
  for await (const language of languages) {
    const filesToEdit = validateAndPromptUserJSONFiles(basePath, language.files, nameOfTranslation);

    if (filesToEdit.length === 0) continue;

    // Avoid trying to use engines that have failed in the past to save time and network requests
    const translationEnginesFiltered = translationEngines.filter((engine) => !enginesFailed.includes(engine));

    let result;
    for await (const engine of translationEnginesFiltered) {
      await translate(text, sourceLanguage, language.name, engine).then(({ text }) => {
        result = text;
      }).catch(() => {
        console.log(`Error translating with ${engine} engine. Trying next engine...`);
        enginesFailed.push(engine);
      });
    
      if (result) break;
    }

    if (!result) {
      throw new Error(`Error translating ${text} from ${sourceLanguage} to ${language.name} using ${translationEnginesFiltered.join(', ')}. Please check your internet connection and try again.`);
    }

    filesToEdit.forEach(({ file, parsedPath }) => {
      setDeepValue(file, nameOfTranslation, result);

      fs.writeFileSync(parsedPath, JSON.stringify(file, null, 2));
    });
  }
};

module.exports = {
    translateController
};
