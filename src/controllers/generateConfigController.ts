import fs from "fs";
import { validEngines } from "../utils/translationEnginesUtils";
import {
  confirmUserAction,
  promptUserInput,
  promptUserOptions,
} from "../utils/promptUtils";
import { parsePath } from "../utils/getConfigPath";
import { listFilesOnDirectory } from "../utils/listFiles";
import { supportedLanguagesCodes } from "../utils/supportedLanguagesUtils";

import {
  PromptBasePath,
  PromptLanguages,
  PromptTranslationEngines,
} from "./generateConfigControllers.d";
import {
  Files,
  Languages,
  Settings,
  TranslationEngines,
} from "../types/settings.d";
import config from "../config";

const _promptTranslationEngines: PromptTranslationEngines = async () => {
  const translationEnginesToUse: Partial<TranslationEngines> = [];

  console.clear();
  console.log(
    "Will ask you for the translation engines you want to use. You will be able to change them later in the configuration file.",
  );

  for await (const translationEngine of validEngines) {
    const shouldUseEngine = await confirmUserAction(
      `Do you want to use ${translationEngine} as translation engine?`,
    );

    if (shouldUseEngine) {
      translationEnginesToUse.push({ name: translationEngine });
    }
  }

  return translationEnginesToUse;
};

const _promptBasePath: PromptBasePath = async () => {
  let confirmedAction = false;
  let pathFiles: Files = [];
  let basePath = "";

  do {
    let hasError = false;
    basePath = await promptUserInput(
      'Base path for the translations files: e.g. "src/localizations": ',
    );

    if (!basePath) {
      console.log("The base path is required.\n");
      continue;
    }

    const filesInPath = await listFilesOnDirectory(parsePath(basePath)).catch(
      async (err) => {
        console.error(err.message);
        console.log("\n-------------\n");
        console.log(
          "Please check that the path provided is correct and that you have the necessary permissions and try again.\n\n",
        );
        await promptUserInput("Press enter to continue...\n\n");
        console.clear();
        hasError = true;
        return [];
      },
    );

    if (hasError) continue;

    if (!filesInPath.length) {
      console.log("The path provided does not contain any files.\n\n");

      const continueWithEmptyPath = await confirmUserAction(
        "Are you sure you want to use this path?",
      );
      console.clear();

      if (!continueWithEmptyPath) continue;
    }

    pathFiles = filesInPath || [];
    console.clear();
    confirmedAction = await confirmUserAction(
      `Please confirm that the path that you want to use is: ${parsePath(
        basePath,
      )} and ${
        filesInPath.length > 0
          ? `contains the following files:\n- ${pathFiles.join("\n- ")}`
          : "doesn't contains files"
      } (y/n): `,
    );
  } while (!confirmedAction);

  await promptUserInput("\nPress enter to continue...");
  console.clear();

  return { basePath, pathFiles };
};

const _promptLanguages: PromptLanguages = async (filesNames) => {
  const languages: Languages = [];

  console.clear();
  console.log(
    "We'll iterate over the files in the base path and you will be able to select the language name for each file.\n",
  );
  console.log(
    `The language should be indicated in ISO 639-1 format. For example: 'English' -> 'en'. You can consult the file ${config.links.allLanguagesRemoteFile} to get all the codes or check here: ${config.links.Iso639Info}\n`,
  );
  console.log("Leave it empty if you don't want to include that file.\n");
  console.log(
    "Remember that you can change this later in the configuration file.\n\n",
  );

  await promptUserInput("Press enter to continue...\n");

  for (const fileName of filesNames) {
    if (fileName.includes(".json")) {
      let languageName;
      let isSupportedLanguage;

      do {
        languageName = await promptUserOptions(
          `\nPlease type the language name for the file ${fileName}: `,
          supportedLanguagesCodes,
        );

        isSupportedLanguage = supportedLanguagesCodes.includes(languageName);

        if (languageName === "") break;

        if (!isSupportedLanguage) {
          console.log(
            `The language ${languageName} is not supported. Please use one of these: ${supportedLanguagesCodes.join(
              ", ",
            )}. Detailed information on ${config.links.allLanguagesRemoteFile}\n\n`,
          );
          await promptUserInput("Press enter to continue...\n");
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
  await promptUserInput("Press enter to continue...\n");

  return languages;
};

const generateConfigController = async () => {
  const configPath = parsePath("/i18n-populator.config.json");
  const configExists = fs.existsSync(configPath);

  if (configExists) {
    const shouldOverwrite = await confirmUserAction(
      `The configuration file already exists. Do you want to overwrite it?:`,
    );

    if (!shouldOverwrite) {
      console.log("The wizard has been canceled.");
      process.exit(0);
    }
  }

  const config: Settings = {
    basePath: "",
    translationEngines: [],
    languages: [],
  };

  const { basePath: userSelectedBasePath, pathFiles: filesNames } =
    await _promptBasePath();
  config.basePath = userSelectedBasePath;
  config.languages = await _promptLanguages(filesNames);
  config.translationEngines = await _promptTranslationEngines();

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};

export { generateConfigController };
