#!/usr/bin/env node

const { Command, Argument } = require('commander');
const program = new Command();
const supportedLanguages = require('./SUPPORTED-LANGUAGE.json');
const { configPath } = require('./utils/getConfigPath');
const { translateController } = require('./controllers/translateController');

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
  .action(translateController);

program.parse();
