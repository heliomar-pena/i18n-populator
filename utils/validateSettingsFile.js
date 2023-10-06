const fs = require('fs');
const { validEngines, isEngineValid } = require('../services/translateService');

const validateSettingsFile = (settingsFilePath) => { 
    const existsFile = fs.existsSync(settingsFilePath);
    if (!settingsFilePath || !existsFile) throw new Error(`No settings file found on file path ${settingsFilePath}`);

    const { languages, basePath, translationEngines: settingsTranslationEngines } = require(settingsFilePath); 
    
    if (!languages?.length || !basePath?.length) throw new Error('No languages or basePath found, please check your settings file');

    const isValidLanguagesConfig = languages.every((language, index) => {
        if (!language.name) {
            throw new Error(`No name found for language on index ${index}`)
        }
        if (!language?.files?.length) throw new Error(`No files found for language ${language.name} on index ${index}`)

        return language.files.every(file => {
            return file?.length;
        });
    });

    if (!isValidLanguagesConfig) throw new Error('There is an invalid language config on your settings file, please check it');

    if (settingsTranslationEngines?.length) {
        const isValidSettingsTranslationEngines = settingsTranslationEngines?.every(isEngineValid);

        if (!isValidSettingsTranslationEngines) throw new Error(`There is an invalid translation engine on your settings file, here are the valid ones: ${validEngines.join(', ')}`);
    }

    return true;
}

module.exports = { validateSettingsFile }
