export enum Engines {
  GOOGLE = "google",
  BING = "bing",
  LIBRE_TRANSLATE = "libreTranslate",
  DEEPL = "deepl",
}

export type Files = string[];

export type LibreTranslateEngine = {
  name: Engines.LIBRE_TRANSLATE;
  mirrors?: string[];
};

export type DeepLEngine = {
  name: Engines.DEEPL;
  key?: string;
  url?: string;
  max_tokens?: string;
  model?: string;
};

export type TranslationEngine =
  | { name: Engines.GOOGLE }
  | { name: Engines.BING }
  | LibreTranslateEngine
  | DeepLEngine;

export type TranslationEngines = TranslationEngine[];

export type Language = {
  name: string;
  files: Files;
};

export type Path = string;

export type Languages = Language[];

export type Settings = {
  basePath: Path;
  translationEngines: Partial<TranslationEngines>;
  languages: Languages;
};
