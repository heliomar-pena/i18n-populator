export enum Engines {
  GOOGLE = "google",
  BING = "bing",
  LIBRE_TRANSLATE = "libreTranslate",
}

export enum SortOrder {
  ASC = "A-Z",
  DESC = "Z-A",
  NONE = "none",
}

export type Files = string[];

export type LibreTranslateEngine = {
  name: Engines.LIBRE_TRANSLATE;
  mirrors?: string[];
};

export type TranslationEngine =
  | { name: Engines.GOOGLE }
  | { name: Engines.BING }
  | LibreTranslateEngine;

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
  sort?: SortOrder;
};
