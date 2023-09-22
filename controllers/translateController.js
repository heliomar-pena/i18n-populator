const { translate } = require('../services/translateService');
const { getOrCreateJsonFile } = require('../utils/getOrCreateJsonFile');
const fs = require('fs');
const { parsePath } = require('../utils/getConfigPath');
const { validateSettingsFile } = require('../utils/validateSettingsFile');
const { dset: setDeepValue } = require('dset');
const { hasProperty } = require('../utils/objectUtils');
const { autoComplete } = require('../utils/promptUtils');
const prompt = require('prompt-sync')();

const translateController = async (text, sourceLanguage, nameOfTranslation, options) => {
  const settingsFilePath = parsePath(options.settingsFile);
  const isValidSettingsFile = validateSettingsFile(settingsFilePath);

  if (!isValidSettingsFile) throw new Error('Invalid settings file');
  if (!text) throw new Error('No text to translate provided');
  if (!sourceLanguage) throw new Error('No source language provided');
  if (!nameOfTranslation) throw new Error('No name of translation provided');
  
  const { languages, basePath } = require(settingsFilePath); 
  
  for await (const language of languages) {
    const { text: result } = await translate(text, sourceLanguage, language.name);

    language.files.forEach(fileName => {
      const { file: languageJson, parsedPath } = getOrCreateJsonFile(basePath, fileName);
      const hasPropertyInFile = hasProperty(languageJson, nameOfTranslation); 
      let shouldOverwrite = false;

      if (hasPropertyInFile) {
        let userRequestOverwrite = prompt(`The property ${nameOfTranslation} already exists in ${fileName}. Do you want to overwrite it? (y/n): `, {
          autocomplete: autoComplete(['y', 'n', 'yes', 'no'])
        });

        shouldOverwrite = ['y', 'yes'].includes(userRequestOverwrite.toLowerCase());
      }

      if (!existProperty || shouldOverwrite) {
        setDeepValue(languageJson, nameOfTranslation, result);
        fs.writeFileSync(parsedPath, JSON.stringify(languageJson, null, 2));
      }
    });
  }
};

module.exports = {
    translateController
};
