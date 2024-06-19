import fs from "fs";
import { parsePath } from "../utils/getConfigPath.js";
import { validateSettingsFile } from "../utils/validateSettingsFile.js";
import { dset as setDeepValue } from "dset";
import { validateAndPromptUserJSONFiles } from "../utils/validateAndPromptUserJSONFiles.js";
import {
  setTranslateWithFallbackEngines,
  isEngineValid,
} from "../services/translateService.js";
import { validateLanguageRequested } from "../utils/supportedLanguagesUtils.js";
import { validEngines } from "../utils/translationEnginesUtils.js";
import { importJSONFile } from "../utils/importJSONFile.js";

const translateController = async (
  text,
  sourceLanguage,
  nameOfTranslation,
  options,
) => {
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
      setDeepValue(file, nameOfTranslation, result);

      fs.writeFileSync(parsedPath, JSON.stringify(file, null, 2));
    });
  }
};

export { translateController };
