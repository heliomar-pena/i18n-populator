import { getOrCreateJsonFile } from './getOrCreateJsonFile';
import { confirmUserAction } from './promptUtils';
import { hasProperty } from './objectUtils';

const validateAndPromptUserJSONFiles = (
  basePath,
  fileNames,
  nameOfTranslation,
) => {
  const jsonFiles = fileNames.map((fileName) => ({
    ...getOrCreateJsonFile(basePath, fileName),
    fileName,
  }));
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

export default { validateAndPromptUserJSONFiles };
