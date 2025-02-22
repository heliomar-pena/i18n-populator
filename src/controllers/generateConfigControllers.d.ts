import { Files, Languages, TranslationEngines } from "../types/settings.d";

export type PromptBasePath = () => Promise<{
  basePath: string;
  pathFiles: Files;
}>;

export type PromptLanguages = (fileNames: string[]) => Promise<Languages>;

export type PromptTranslationEngines = () => Promise<
  Partial<TranslationEngines>
>;

export type GenerateConfigController = () => Promise<void>;
