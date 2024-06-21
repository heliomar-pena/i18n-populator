#!/usr/bin/env node
import { Command } from "commander";
const program = new Command();
import { configPath } from "./utils/getConfigPath.js";
import translateController from "./controllers/translateController.js";
import languagesController from "./controllers/languagesController.js";
import { generateConfigController } from "./controllers/generateConfigController.js";
import { importJSONFile } from "./utils/importJSONFile.js";

const { version } = await importJSONFile("./package.json", import.meta.url);

program
  .name("i18n-populator")
  .description("CLI to translate JavaScript strings")
  .version(version);

program
  .command("translate")
  .description(
    "Translate a text and put the result on the files in the output directory",
  )
  .argument("<text>", "Text to translate")
  .argument("<source-language>", "Source language of the string")
  .argument("<name-of-translation>", "Name of your translation")
  .option(
    "-e, --engine <string>",
    "Engine to use for the translation. In case you don't define it will be use by default all the translation engines that are free and doesn't requires API Key.",
  )
  .option(
    "-s, --settings-file <string>",
    "Path to the settings file",
    configPath,
  )
  .action(translateController);

program
  .command("languages")
  .description("Show the languages supported in ISO-639-1 standard")
  .option(
    "-be, --by-engine <string>",
    "Filter the language supported list by engine",
  )
  .action(languagesController);

program
  .command("init")
  .description("Start the configuration wizard to create the settings file")
  .action(generateConfigController);

program.parse();
