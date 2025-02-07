import { Path } from "../types/settings"

export type ValidateAndPromptUserJSONFiles = {
    basePath: Path,
    fileNames: string[],
    nameOfTranslation: string
}

export type ValidateAndPromptUserJSONFilesReturn = { file: object, parsedPath: string };

export type ValidateAndPromptUserJSONFilesFn = (basePath: Path, fileNames: string[], nameOfTranslation: string) => Promise<ValidateAndPromptUserJSONFilesReturn[]>
