const { translate } = require('../services/translateService');
const { getOrCreateJsonFile } = require('../utils/getOrCreateJsonFile');
const fs = require('fs');
const { parsePath } = require('../utils/getConfigPath');
const { validateSettingsFile } = require('../utils/validateSettingsFile');
const { dset: setDeepValue } = require('dset');
const { validateAndPromptUserJSONFiles } = require('../utils/validateAndPromptUserJSONFiles');

const translateController = async (text, sourceLanguage, nameOfTranslation, options) => {
  const settingsFilePath = parsePath(options.settingsFile);
  const isValidSettingsFile = validateSettingsFile(settingsFilePath);

  if (!isValidSettingsFile) throw new Error('Invalid settings file');
  if (!text) throw new Error('No text to translate provided');
  if (!sourceLanguage) throw new Error('No source language provided');
  if (!nameOfTranslation) throw new Error('No name of translation provided');
  
  const { languages, basePath } = require(settingsFilePath); 
  
  for await (const language of languages) {
    const filesToEdit = validateAndPromptUserJSONFiles(basePath, language.files, nameOfTranslation);

    if (filesToEdit.length === 0) continue;

    const { text: result } = await translate(text, sourceLanguage, language.name);

    filesToEdit.forEach(({ file, parsedPath }) => {
      setDeepValue(file, nameOfTranslation, result);

      fs.writeFileSync(parsedPath, JSON.stringify(file, null, 2));
    });
  }
};

module.exports = {
    translateController
};
