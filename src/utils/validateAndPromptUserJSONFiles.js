import { getOrCreateJsonFile } from "./getOrCreateJsonFile.js";
import { confirmUserAction } from "./promptUtils.js";
import { hasProperty } from "./objectUtils.js";

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

export { validateAndPromptUserJSONFiles };
