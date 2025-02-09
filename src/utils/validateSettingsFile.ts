import fs from "fs";
import { validEngines, isEngineValid } from "../services/translateService";
import { importJsonFile } from "./getOrCreateJsonFile";
import { Settings } from "../types/settings.d";

/**
 * Checks if setting file is valid.
 *
 * @param {string} settingsFilePath
 * @throws {Error} if there are languages without name
 * @throws {Error} if there are languages without files
 * @throws {Error} if there are engines not valid on the settings
 * @returns {Boolean}
 */
const validateSettingsFile = async (
  settingsFilePath: string,
): Promise<Boolean> => {
  const existsFile = fs.existsSync(settingsFilePath);
  if (!settingsFilePath || !existsFile)
    throw new Error(`No settings file found on file path ${settingsFilePath}`);

  const {
    languages,
    basePath,
    translationEngines: settingsTranslationEngines,
  } = await importJsonFile<Settings>(settingsFilePath);

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

export default validateSettingsFile;
