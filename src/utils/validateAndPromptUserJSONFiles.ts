import { getOrCreateJsonFile } from "./getOrCreateJsonFile";
import { confirmUserAction } from "./promptUtils";
import { hasProperty } from "./objectUtils";
import { ValidateAndPromptUserJSONFilesFn } from "./validateAndPromptUserJSONFiles.d";

const validateAndPromptUserJSONFiles: ValidateAndPromptUserJSONFilesFn = async (
  basePath,
  fileNames,
  nameOfTranslation
) => {
  const jsonFiles = await Promise.all(
    fileNames.map(async (fileName) => {
      const fileData = await getOrCreateJsonFile(basePath, fileName);

      return {
        ...fileData,
        fileName,
      };
    })
  );

  const filesToEdit = [];

  for await (const { file, parsedPath, fileName } of jsonFiles) {
    let shouldOverwrite = true;
    const hasPropertyInFile = hasProperty(file, nameOfTranslation);

    if (hasPropertyInFile)
      shouldOverwrite = await confirmUserAction(
        `The property ${nameOfTranslation} already exists in ${fileName}. Do you want to overwrite it? `
      );
    if (!hasPropertyInFile || shouldOverwrite)
      filesToEdit.push({ file, parsedPath });
  }

  return filesToEdit;
};

export { validateAndPromptUserJSONFiles };
