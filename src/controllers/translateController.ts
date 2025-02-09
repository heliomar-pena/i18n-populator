import fs from "fs";
import { parsePath } from "../utils/getConfigPath";
import validateSettingsFile from "../utils/validateSettingsFile";
import { dset as setDeepValue } from "dset";
import { validateAndPromptUserJSONFiles } from "../utils/validateAndPromptUserJSONFiles";
import {
  setTranslateWithFallbackEngines,
  isEngineValid,
} from "../services/translateService";
import { validateLanguageRequested } from "../utils/supportedLanguagesUtils";
import { validEngines } from "../utils/translationEnginesUtils";
import { TranslateController } from "./translateController.d";
import { Settings } from "../types/settings";
import { importJsonFile } from "../utils/getOrCreateJsonFile";

/**
 * Translates a text to multiple languages and saves the translations in the JSON files
 *
 * @param {TranslateController} options
 * @returns {Promise<void>}
 * @throws {Error} if not text for translate is provided
 * @throws {Error} if not name for translate is provided
 * @throws {Error} if Engine provided via CLI is invalid
 */
const translateController = async ({
  text,
  from: sourceLanguage,
  name: nameOfTranslation,
  ...options
}: TranslateController): Promise<void> => {
  const settingsFilePath = parsePath(options.settingsFile);
  await validateSettingsFile(settingsFilePath);
  validateLanguageRequested(sourceLanguage);

  if (typeof text !== "string" || !text?.length)
    throw new Error("No text to translate provided");
  if (!nameOfTranslation) throw new Error("No name of translation provided");

  const {
    languages,
    basePath,
    translationEngines: settingsTranslationEngines,
  } = await importJsonFile<Settings>(settingsFilePath);

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
      setDeepValue(file, nameOfTranslation, result);

      fs.writeFileSync(parsedPath, JSON.stringify(file, null, 2) + "\n");
    });
  }
};

export default translateController;
