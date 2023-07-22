#!/usr/bin/env node

const { Command, Argument } = require('commander');
const program = new Command();
const supportedLanguages = require('./SUPPORTED-LANGUAGE.json');
const { translate } = require('./utils/translate');
const { configPath, parsePath } = require('./utils/getConfigPath');
const fs = require('fs');

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

      let count = 0;

      while (count < languages.length) {
        const language = languages[count];
        const { text: result } = await translate(text, { from: sourceLanguage, to: language.name });

        language.files.forEach(fileName => {
          const parsedPath = parsePath(`${basePath}/${fileName}`);
          const languageJson = require(parsedPath);
          languageJson[nameOfTranslation] = result;

          fs.writeFileSync(parsedPath, JSON.stringify(languageJson, null, 2));
        });
        count++;
      }
    } catch (error) {
      console.error('No config file found', error);
    }
  });

program.parse();