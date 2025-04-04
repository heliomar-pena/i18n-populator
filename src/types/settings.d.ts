export enum Engines {
  GOOGLE = "google",
  BING = "bing",
  LIBRE_TRANSLATE = "libreTranslate",
  OPENAI = "openAI",
}

export type Files = string[];

export type LibreTranslateEngine = {
  name: Engines.LIBRE_TRANSLATE;
  mirrors?: string[];
};

export type MicrosoftEngine = {
  name: Engines.BING;
  key?: string;
};

export type OpenAiEngine = {
  name: Engines.OPENAI;
  key?: string;
  url?: string;
  max_tokens?: string;
  model?: string;
};

export type TranslationEngine =
  | { name: Engines.GOOGLE }
  | MicrosoftEngine
  | LibreTranslateEngine
  | OpenAiEngine;

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
