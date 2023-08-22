#!/usr/bin/env node

const { Command, Argument } = require('commander');
const program = new Command();
const supportedLanguages = require('./SUPPORTED-LANGUAGE.json');
const { translate } = require('./utils/translate');
const { configPath } = require('./utils/getConfigPath');
const { getOrCreateTranslationFile } = require('./utils/getTranslationFile');
const fs = require('fs');
const { dset: set } = require('dset');

program
  .name('i18n-translate-generator')
  .description('CLI to translate JavaScript strings')
  .version('1.0.0');

program.command('translate')
  .description('Translate a text and put the result on the files in the output directory')
  .argument('<text>', 'Text to translate')
  .addArgument(new Argument('<source-language>', 'source language of the string').choices(supportedLanguages))
  .argument('<name-of-translation>', 'Name of your translation')
  .option('-s, --settings-file <string>', 'path to the settings file', configPath)
  .action(async (text, sourceLanguage, nameOfTranslation, options) => {
    try {
      const { settingsFile } = options;

      const { languages, basePath } = require(settingsFile); 
      
      for await (const language of languages) {
        console.time(`Generate translation ${text} ${language.name}`);
        const { text: result } = await translate(text, { from: sourceLanguage, to: language.name });

        language.files.forEach(fileName => {
          let { file: languageJson, parsedPath } = getOrCreateTranslationFile(basePath, fileName);          
          set(languageJson, nameOfTranslation, result);

          fs.writeFileSync(parsedPath, JSON.stringify(languageJson, null, 2));
          console.timeEnd(`Generate translation ${text} ${language.name}`);
        });
      }
    } catch (error) {
      console.error('No config file found', error);
    }
  });

program.parse();
