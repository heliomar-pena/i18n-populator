#!/usr/bin/env node

const { Command, Argument } = require('commander');
const program = new Command();
const { configPath } = require('./utils/getConfigPath');
const { translateController } = require('./controllers/translateController');

program
  .name('i18n-translate-generator')
  .description('CLI to translate JavaScript strings')
  .version('1.0.0');

program.command('translate')
  .description('Translate a text and put the result on the files in the output directory')
  .argument('<text>', 'Text to translate')
  .argument('<source-language>', 'Source language of the string')
  .argument('<name-of-translation>', 'Name of your translation')
  .option('-e, --engine <string>', "Engine to use for the translation. In case you don't define it will be use by default all the translation engines that are free and doesn't requires API Key.")
  .option('-s, --settings-file <string>', 'Path to the settings file', configPath)
  .action(translateController);

program.parse();
