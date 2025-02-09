#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import fs from "fs";
import { readFile } from "fs/promises";
import { translate as translate$4 } from "@vitalets/google-translate-api";
import { translate as translate$3 } from "bing-translate-api";
import fetch from "node-fetch";
import { dset } from "dset";
import promptFactory, { AutocompleteBehavior } from "prompt-sync-plus";

const config = {
  defaultConfigPath: "i18n-populator.config.json",
};

const { defaultConfigPath } = config;

const configPath = defaultConfigPath;

const parsePath = (customPath) => {
  return path.join(process.cwd(), customPath);
};

/**
 * Normalizes a file path based on the operating system.
 *
 * @param {string} pathString - The string representing the file path to be normalized.
 * @returns {string} A normalized file path.
 *
 * @throws {Error} Throws an error if no string is provided.
 *
 * @example
 * // On Windows:
 * normalizeFilePath('file:///C:/Users/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs/test-config.json')
 * // Returns 'C:/Users/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs'
 *
 * @example
 * // On Unix:
 * normalizeFilePath('file://home/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs/test-config.json')
 * // Returns 'home/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs'
 */
function normalizeFilePath(pathString) {
  if (typeof pathString !== "string" || pathString.length === 0)
    throw new Error("No string provided");

  const path = pathString.split("/").slice(0, -1).join("/");

  return process.platform === "win32"
    ? path.replace(/^file:\/\/\/?/, "")
    : path.replace("file://", "");
}

/**
 * Imports a JSON file from the specified path and returns the parsed JSON data.
 *
 * @param {string} path - The path to the JSON file.
 * @param {string} url - The URL to the JSON file.
 * @returns {Promise<Object>} - A promise that resolves to the parsed JSON data.
 */
async function importJSONFile(filePath, url) {
  if (!filePath) throw new Error("No file path provided");

  let finalPath = "";

  if (typeof url === "string" && url.length > 0)
    finalPath = normalizeFilePath(url);

  finalPath = path.join(finalPath, filePath);

  try {
    const data = await readFile(finalPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError)
      throw new SyntaxError("File is not a valid JSON.");
    throw new Error(`File not found: ${finalPath}`);
  }
}

const translate$2 = async (text, { from, to }) => {
  const { translation } = await translate$3(text, from, to);

  return { text: translation };
};

const mirrors = [
  "https://translate.terraprint.co/translate",
  "https://trans.zillyhuhn.com/translate",
];

const libreTranslate = async (text, { from, to }) => {
  for await (const url of mirrors) {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          q: text,
          source: from,
          target: to,
          format: "text",
        }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());

      return { text: res.translatedText };
    } catch (err) {
      console.log(
        `Mirror failed: ${url} with the next error:\n\n> ${err.message}\n\nTrying with the next one...\n`,
      );
    }
  }

  throw new Error("All libreTranslate mirrors failed. Please try again later.");
};

const translate$1 = async (text, { from, to }) => {
  const result = await libreTranslate(text, { from, to });

  return result;
};

const translateEngines = {
  google: translate$4,
  bing: translate$2,
  libreTranslate: translate$1,
};

const validEngines = Object.keys(translateEngines);

/**
 * Checks if the given translation engine is valid.
 * @param {string} engine - The translation engine to check.
 * @returns {boolean} - True if the given translation engine is valid, false otherwise.
 */
const isEngineValid = (engine) => validEngines.includes(engine);

const allLanguagesCodes = await importJSONFile(
  "../ALL-LANGUAGES-CODES.json",
  import.meta.url,
);

/**
 * Object containing supported languages and their corresponding language codes.
 * @type {Object}
 */
const supportedLanguages = Object.keys(allLanguagesCodes).reduce(
  (acc, language) => {
    const isLanguageSupportedByAlmostOneEngine = Object.keys(
      allLanguagesCodes[language],
    ).some((value) => validEngines.includes(value));

    if (isLanguageSupportedByAlmostOneEngine)
      acc[language] = allLanguagesCodes[language];

    return acc;
  },
  {},
);

/**
 * An array containing all the supported languages without extra data as language name or supported engines. Only the language code.
 * e.g. ['en', 'es', 'pt', ...]
 */
const supportedLanguagesCodes = Object.keys(supportedLanguages);

/**
 * Groups the supported languages by engine.
 *
 * @type {Object.<string, string[]>}
 */
const supportedLanguagesGroupedByEngine = Object.keys(
  supportedLanguages,
).reduce((acc, language) => {
  Object.keys(supportedLanguages[language]).forEach((engine) => {
    const languageObject = supportedLanguages[language];

    if (!acc[engine]) acc[engine] = {};
    acc[engine] = {
      ...acc[engine],
      [language]: { ...languageObject[engine], name: languageObject.name },
    };
  });

  return acc;
}, {});

/**
 * The supported languages by Google.
 * @type {Object}
 */
supportedLanguagesGroupedByEngine.google;

/**
 * The supported languages by Bing.
 * @type {Array<string>}
 */
supportedLanguagesGroupedByEngine.bing;

/**
 * The supported languages by LibreTranslate.
 * @type {Array<string>}
 */
supportedLanguagesGroupedByEngine.libreTranslate;

/**
 * Validates if a language is supported by a specific engine.
 *
 * @param {string} requestedLanguage - The language to be validated.
 * @param {string} engine - The engine to check if the language is supported.
 * @throws {Error} If the language is not supported by the engine.
 * @returns {boolean} Returns true if the language is supported by the engine.
 */
const validateLanguageIsSupportedByEngine = (requestedLanguage, engine) => {
  const isLanguageSupportedByEngine =
    supportedLanguagesGroupedByEngine[engine][requestedLanguage] !== undefined;

  if (!isLanguageSupportedByEngine)
    throw new Error(
      `Language ${requestedLanguage} is not supported by ${engine}.`,
    );

  return true;
};

/**
 * Retrieves the language code for a given language and engine.
 *
 * @param {string} requestedLanguage - The requested language.
 * @param {string} engine - The engine.
 * @returns {string} The language code.
 */
const getLanguageCodeByEngine = (requestedLanguage, engine) => {
  validateLanguageIsSupportedByEngine(requestedLanguage, engine);

  return allLanguagesCodes[requestedLanguage][engine];
};

/**
 * Returns an array of language codes with their corresponding names.
 * @param {Object} languages - An object containing language codes and their data.
 * @returns {Array} - An array of strings in the format "languageCode -> languageName".
 */
const getLanguagesCodesWithNames = (languages) => {
  return Object.entries(languages).map(([language, data]) => {
    return `${language} -> ${data?.name || "Unknown"}`;
  });
};

/**
 * Validates the requested language.
 *
 * @param {string} requestedLanguage - The language to be validated.
 * @returns {boolean} - Returns true if the language is valid.
 * @throws {Error} - Throws an error if the language is not provided, not supported, or not supported by any engine.
 */
const validateLanguageRequested = (requestedLanguage) => {
  try {
    if (!requestedLanguage) throw new Error("No language provided");

    const isLanguageSupported =
      supportedLanguages[requestedLanguage] !== undefined;

    if (!isLanguageSupported)
      throw new Error(`Language ${requestedLanguage} is not supported`);

    return true;
  } catch (error) {
    throw new Error(
      `${error.message}.\n\nPlease use one of these:\n\n${getLanguagesCodesWithNames(supportedLanguages).join("\n")}`,
    );
  }
};

/**
 * By default use Engines that doesn't require an API key
 */
const DEFAULT_ENGINES = ["google", "bing", "libreTranslate"];

/**
 * Returns an array of translation engines to use based on the provided settings and CLI arguments. If no one is provided then the default engines are returned.
 * @param {Object} options - The options object.
 * @param {Array} options.settingsTranslationEngines - The array of translation engines specified in the settings file.
 * @param {string} options.cliArgEngine - The translation engine specified as a CLI argument.
 * @returns {Array} - The array of translation engines to use.
 */
const getTranslationEnginesToUse = ({
  settingsTranslationEngines,
  cliArgEngine,
}) => {
  const translationEnginesToUse = [];

  if (cliArgEngine) {
    translationEnginesToUse.push(cliArgEngine);
  }

  if (settingsTranslationEngines) {
    const settingsTranslationEnginesFiltered =
      settingsTranslationEngines.filter((engine) => engine !== cliArgEngine);

    translationEnginesToUse.push(...settingsTranslationEnginesFiltered);
  }

  if (translationEnginesToUse.length === 0) {
    translationEnginesToUse.push(...DEFAULT_ENGINES);
  }

  return translationEnginesToUse;
};

/**
 * Translates the given text from one language to another using the specified translation engine.
 * @param {string} text - The text to be translated.
 * @param {string} from - The language code of the text to be translated.
 * @param {string} to - The language code to translate the text to.
 * @param {string} engine - The translation engine to use. Defaults to 'google'.
 * @returns {Promise<{text: string}>} - A Promise that resolves to an object containing the translated text.
 * @throws {Error} - If an invalid translation engine is specified.
 */
const translate = async (text, from, to, engine = "google") => {
  if (!isEngineValid(engine))
    throw new Error(
      `Invalid engine. Try with one of these: ${validEngines.join(", ")}`,
    );

  if (from === to) return { text };

  return await translateEngines[engine](text, { from, to });
};

/**
 * Sets the translation engine(s) to use and a function to translate with fallback engines.
 * @param {string[]} settingsTranslationEngines - An array of translation engines to use, in order of preference.
 * @param {string} cliArgEngine - The translation engine specified in the CLI arguments.
 * @returns {{engines: string[], translateWithFallbackEngines: function}} - An object containing the translation engines to use and a function to translate with fallback engines.
 */
const setTranslateWithFallbackEngines = ({
  settingsTranslationEngines,
  cliArgEngine,
}) => {
  const engines = getTranslationEnginesToUse({
    settingsTranslationEngines,
    cliArgEngine,
  });
  const enginesFailed = [];

  /**
   * Translates the given text from one language to another using the specified translation engines in order of preference.
   * @param {string} text - The text to be translated.
   * @param {string} from - The language code of the text to be translated.
   * @param {string} to - The language code to translate the text to.
   * @param {string[]} engines - An array of translation engines to use, in order of preference.
   * @returns {Promise<{text: string}>} - A Promise that resolves to an object containing the translated text.
   * @throws {Error} - If there is not translation result.
   */
  const translateWithFallbackEngines = async (text, from, to) => {
    let result;

    // Avoid trying to use engines that have failed in the past to save time and network requests
    const enginesFiltered = engines.filter(
      (engine) => !enginesFailed.includes(engine),
    );

    for await (const engine of enginesFiltered) {
      try {
        // Validate that the language is supported by the engine to avoid unnecessary network requests
        const fromLanguageCode = getLanguageCodeByEngine(from, engine);
        const toLanguageCode = getLanguageCodeByEngine(to, engine);

        await translate(text, fromLanguageCode, toLanguageCode, engine)
          .then(({ text }) => {
            result = text;
            console.log(
              `Translated successfully with ${engine} engine. Result: ${text}`,
            );
          })
          .catch(() => {
            enginesFailed.push(engine);
            throw new Error(
              `Error translating with ${engine} engine. Trying next engine...`,
            );
          });

        if (result) break;
      } catch (error) {
        console.log(error.message);
      }
    }

    if (!result) {
      const enginesUsed = engines.join(", ");

      throw new Error(
        `Error translating ${text} from ${from} to ${to} using ${enginesUsed}.\n\nPlease check that requested languages is supported using the command "languages" or check your internet connection and try again.\n\nFor more info check CLI help or open an issue at https://github.com/victor-heliomar/i18n-populator/issues/new`,
      );
    }

    return { text: result };
  };

  return { engines, translate: translateWithFallbackEngines };
};

const validateSettingsFile = async (settingsFilePath) => {
  const existsFile = fs.existsSync(settingsFilePath);
  if (!settingsFilePath || !existsFile)
    throw new Error(`No settings file found on file path ${settingsFilePath}`);

  const {
    languages,
    basePath,
    translationEngines: settingsTranslationEngines,
  } = await importJSONFile(settingsFilePath, "");

  if (!languages?.length || !basePath?.length)
    throw new Error(
      "No languages or basePath found, please check your settings file",
    );

  const isValidLanguagesConfig = languages.every((language, index) => {
    if (!language.name) {
      throw new Error(`No name found for language on index ${index}`);
    }
    if (!language?.files?.length)
      throw new Error(
        `No files found for language ${language.name} on index ${index}`,
      );

    return language.files.every((file) => {
      return file?.length;
    });
  });

  if (!isValidLanguagesConfig)
    throw new Error(
      "There is an invalid language config on your settings file, please check it",
    );

  if (settingsTranslationEngines?.length) {
    const isValidSettingsTranslationEngines =
      settingsTranslationEngines?.every(isEngineValid);

    if (!isValidSettingsTranslationEngines)
      throw new Error(
        `There is an invalid translation engine on your settings file, here are the valid ones: ${validEngines.join(", ")}`,
      );
  }

  return true;
};

const getOrCreateJsonFile = async (basePath, fileName) => {
  const parsedPath = parsePath(`${basePath}/${fileName}`);

  if (fs.existsSync(parsedPath)) {
    try {
      const file = await importJSONFile(parsedPath);
      return { file, parsedPath };
    } catch (error) {
      console.error(`Error reading file ${parsedPath}.`);

      if (error instanceof SyntaxError) {
        console.error("Syntax error in JSON file. It is probably malformed.");
        console.error(
          "It exists and is on your i18n-populator.config.js file but it is not a valid JSON file.",
        );
      }

      process.exit(1);
    }
  }

  const file = {};

  const directory = basePath;
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(parsedPath, JSON.stringify(file, null, 2));

  return { file, parsedPath };
};

/**
 * This file is created in order to be able to easily mock prompt-sync-plus in tests
 * @module promptUser
 **/

const prompt = promptFactory({
  sigint: true,
});

/**
 * Utility functions for prompting the user for input and confirmation
 * @module promptUtils
 */

/**
 * Get an array of commands to autocomplete the user prompt input
 * @param {string[]} commands - Array of commands to auto complete
 * @returns {function(string): string[]} a function that receives a string and returns an array of commands that start with that string
 */
const autoComplete = (commands = []) => {
  return (str) => commands.filter((command) => command.indexOf(str) === 0);
};

/**
 * Prompts the user for confirmation of an action
 * @param {string} message - The message to display to the user
 * @returns {boolean} true if the user confirms the action, false otherwise
 */
const confirmUserAction = (message) => {
  const userAnswer = prompt(message, "no", {
    autocomplete: autoComplete(["y", "n", "yes", "no"]),
  });

  const userConfirmed = ["y", "yes"].includes(userAnswer?.toLowerCase());

  return userConfirmed;
};

const promptUserInput = (message, autocomplete = []) => {
  return prompt(message, {
    autocomplete: {
      searchFn: autoComplete(autocomplete),
      behavior: AutocompleteBehavior.HYBRID,
      suggestColCount: 3,
      fill: true,
      sticky: true,
    },
  });
};

/**
 * Checks if an object has a property with the given path.
 * @param {Object} obj - The object to check.
 * @param {string | Array<string>} path - The path to the property to check. Can be a string with dot notation or an array of keys.
 * @returns {boolean} - True if the object has the property, false otherwise.
 */
const hasProperty = (obj, path) => {
  /**
   * This regexp is used to split the path string into an array of keys using "[", "]" and "." as separators.
   * In https://regexr.com/58j0k you can get a playground to test and analyze it.
   * @type {RegExp}
   * @example
   * // returns ["test", "test2", "test3"]
   * "test[test2].test3".match(/([^[.\]])+/g)
   */
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);

  const objHasProperty =
    pathArray?.reduce((prevObj, key) => prevObj && prevObj[key], obj) !==
    undefined;

  return objHasProperty;
};

const validateAndPromptUserJSONFiles = async (
  basePath,
  fileNames,
  nameOfTranslation,
) => {
  const jsonFiles = await Promise.all(
    fileNames.map(async (fileName) => {
      const fileData = await getOrCreateJsonFile(basePath, fileName);

      return {
        ...fileData,
        fileName,
      };
    }),
  );

  const filesToEdit = [];

  jsonFiles.forEach(({ file, parsedPath, fileName }) => {
    let shouldOverwrite = true;
    const hasPropertyInFile = hasProperty(file, nameOfTranslation);

    if (hasPropertyInFile)
      shouldOverwrite = confirmUserAction(
        `The property ${nameOfTranslation} already exists in ${fileName}. Do you want to overwrite it? (y/n): `,
      );
    if (!hasPropertyInFile || shouldOverwrite)
      filesToEdit.push({ file, parsedPath });
  });

  return filesToEdit;
};

/**
 * Translates a text to multiple languages and saves the translations in the JSON files
 *
 * @param {Object} options
 * @param {string} options.text
 * @param {string} options.from
 * @param {string} options.name
 * @param {string} [options.settingsFile]
 * @param {string} [options.engine]
 * @returns {Promise<void>}
 * @throws {Error}
 */
const translateController = async ({
  text,
  from: sourceLanguage,
  name: nameOfTranslation,
  ...options
}) => {
  const settingsFilePath = parsePath(options.settingsFile);
  await validateSettingsFile(settingsFilePath);
  validateLanguageRequested(sourceLanguage, options.engine);

  if (typeof text !== "string" || !text?.length)
    throw new Error("No text to translate provided");
  if (!nameOfTranslation) throw new Error("No name of translation provided");

  const {
    languages,
    basePath,
    translationEngines: settingsTranslationEngines,
  } = await importJSONFile(settingsFilePath);

  if (options.engine && !isEngineValid(options.engine))
    throw new Error(
      `You've provided an invalid engine as arg on your CLI Command. Try with one of these: ${validEngines.join(", ")}`,
    );

  const { translate } = setTranslateWithFallbackEngines({
    settingsTranslationEngines,
    cliArgEngine: options.engine,
  });

  for await (const language of languages) {
    const filesToEdit = await validateAndPromptUserJSONFiles(
      basePath,
      language.files,
      nameOfTranslation,
    );

    if (filesToEdit.length === 0) continue;

    const { text: result } = await translate(
      text,
      sourceLanguage,
      language.name,
    );

    filesToEdit.forEach(({ file, parsedPath }) => {
      dset(file, nameOfTranslation, result);

      fs.writeFileSync(parsedPath, JSON.stringify(file, null, 2) + "\n");
    });
  }
};

const languagesController = ({ byEngine: engine }) => {
  if (engine && !isEngineValid(engine))
    throw new Error(
      `You've provided an invalid engine as arg on your CLI Command. Try with one of these: ${validEngines.join(", ")}`,
    );

  const supportedLanguages$1 = engine
    ? supportedLanguagesGroupedByEngine[engine]
    : supportedLanguages;

  const formattedSupportedLanguages =
    getLanguagesCodesWithNames(supportedLanguages$1);

  console.log(
    `${formattedSupportedLanguages.length} Languages supported:\n\n${formattedSupportedLanguages.join("\n")}`,
  );
};

/**
 * Retrieves a list of files in the specified directory.
 * @param {string} directory - The directory path.
 * @returns {Promise<string[]>} - A promise that resolves to an array of file names in the directory.
 */
const listFilesOnDirectory = (directory) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
};

const _promptTranslationEngines = () => {
  const translationEnginesToUse = [];

  console.clear();
  console.log(
    "Will ask you for the translation engines you want to use. You will be able to change them later in the configuration file.",
  );

  for (const translationEngine of validEngines) {
    const shouldUseEngine = confirmUserAction(
      `Do you want to use ${translationEngine} as translation engine? (y/n): `,
    );

    if (shouldUseEngine) {
      translationEnginesToUse.push(translationEngine);
    }
  }

  return translationEnginesToUse;
};

const _promptBasePath = async () => {
  let confirmedAction = false;
  let pathFiles = [];
  let basePath = "";

  do {
    let hasError = false;
    basePath = promptUserInput(
      'Base path for the translations files: e.g. "src/localizations": ',
    );

    if (!basePath) {
      console.log("The base path is required.\n");
      continue;
    }

    const filesInPath = await listFilesOnDirectory(parsePath(basePath)).catch(
      (err) => {
        console.error(err.message);
        console.log("\n-------------\n");
        console.log(
          "Please check that the path provided is correct and that you have the necessary permissions and try again.\n\n",
        );
        promptUserInput("Press enter to continue...\n\n");
        console.clear();
        hasError = true;
      },
    );

    if (hasError) continue;

    if (!filesInPath.length) {
      console.log("The path provided does not contain any files.\n\n");

      const continueWithEmptyPath = confirmUserAction(
        "Are you sure you want to use this path? (y/n): ",
      );
      console.clear();

      if (!continueWithEmptyPath) continue;
    }

    pathFiles = filesInPath || [];
    console.clear();
    confirmedAction = confirmUserAction(
      `Please confirm that the path that you want to use is: ${parsePath(
        basePath,
      )} and ${
        filesInPath.length > 0
          ? `contains the following files:\n- ${pathFiles.join("\n- ")}`
          : "doesn't contains files"
      } (y/n): `,
    );
  } while (!confirmedAction);

  promptUserInput("\nPress enter to continue...");
  console.clear();

  return { basePath, pathFiles };
};

const _promptLanguages = (filesNames) => {
  const languages = [];

  console.clear();
  console.log(
    "We'll iterate over the files in the base path and you will be able to select the language name for each file.\n",
  );
  console.log(
    "The language should be indicated in ISO 639-1 format. For example: 'English' -> 'en'. You can consult the file https://github.com/victor-heliomar/i18n-populator/blob/master/ALL-LANGUAGES-CODES.json to get all the codes or check here: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes\n",
  );
  console.log("Leave it empty if you don't want to include that file.\n");
  console.log(
    "Remember that you can change this later in the configuration file.\n\n",
  );

  promptUserInput("Press enter to continue...\n");

  for (const fileName of filesNames) {
    if (fileName.includes(".json")) {
      let languageName;
      let isSupportedLanguage;

      do {
        languageName = promptUserInput(
          `\nPlease type the language name for the file ${fileName}: `,
          supportedLanguagesCodes,
        );

        isSupportedLanguage = supportedLanguagesCodes.includes(languageName);

        if (languageName === "") break;

        if (!isSupportedLanguage) {
          console.log(
            `The language ${languageName} is not supported. Please use one of these: ${supportedLanguagesCodes.join(
              ", ",
            )}. Detailed information on https://github.com/victor-heliomar/i18n-populator/blob/master/ALL-LANGUAGES-CODES.json\n\n`,
          );
          promptUserInput("Press enter to continue...\n");
        }
      } while (!isSupportedLanguage);

      if (languageName === "") continue;

      const languageIndex = languages.findIndex(
        (language) => language.name === languageName,
      );

      if (languageIndex !== -1) {
        languages[languageIndex].files.push(fileName);
        continue;
      }

      languages.push({
        name: languageName,
        files: [fileName],
      });
    }
  }

  console.log(
    "\n\nThe languages that you've selected are saved in the configuration file. You can change them later.\n\n",
  );
  promptUserInput("Press enter to continue...\n");

  return languages;
};

const generateConfigController = async () => {
  const configPath = parsePath("/i18n-populator.config.json");
  const configExists = fs.existsSync(configPath);

  if (configExists) {
    const shouldOverwrite = confirmUserAction(
      `The configuration file already exists. Do you want to overwrite it? (y/n): `,
    );

    if (!shouldOverwrite) {
      console.log("The wizard has been canceled.");
      process.exit(0);
    }
  }

  const config = {
    basePath: "",
    translationEngines: [],
    languages: [],
  };

  const { basePath: userSelectedBasePath, pathFiles: filesNames } =
    await _promptBasePath();
  config.basePath = userSelectedBasePath;
  config.languages = _promptLanguages(filesNames);
  config.translationEngines = _promptTranslationEngines();

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};

var version = "1.1.1";

const program = new Command();
program
  .name("i18n-populator")
  .description("CLI to translate JavaScript strings")
  .version(version);
program
  .command("translate")
  .description(
    "Translate a text and put the result on the files in the output directory",
  )
  .option(
    "-t, --text <string>",
    "The word or sentence that you want to translate.",
  )
  .option(
    "-f, --from <string>",
    "The language of the text that you wrote on the --text option.",
  )
  .option(
    "-n, --name <string>",
    "The name of the property that you want your text has on the output files.",
  )
  .option(
    "-e, --engine <string>",
    `[OPTIONAL]. The engine that you want to use to translate the text. Available options: ${validEngines.join(", ")}
If you specify a engine on the command, it will put it on the first position of the array of engines.
If for any reason the engine you selected is not available at that moment, then it will use the engines that you have defined on the configuration file in the priority order that you selected.
If you don't specify any engine, the script will try to get your preferences from your configuration file, and if you don't have any configuration file, it will use by default all the translation engine that are free and doesn't need API Key.`,
  )
  .option(
    "-s, --settings-file <string>",
    `[OPTIONAL]. Use this flag if you want to specify a different path for the configuration file that the default path.
    
    If you don't specify this flag, it'll search for a file called \`i18n-populator.config.json\` on the root of your project.`,
    configPath,
  )
  .action(translateController);
program
  .command("languages")
  .description("Show the languages supported in ISO-639-1 standard")
  .option(
    "-e, --by-engine <string>",
    "Filter the language supported list by engine",
  )
  .action(languagesController);
program
  .command("init")
  .description("Start the configuration wizard to create the settings file")
  .action(generateConfigController);
program.parse();
