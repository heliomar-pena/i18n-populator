export enum Engines {
  GOOGLE = "google",
  BING = "bing",
  LIBRE_TRANSLATE = "libreTranslate",
}

export type TranslationEngines = [
  { name: Engines.GOOGLE },
  { name: Engines.BING },
  { name: Engines.LIBRE_TRANSLATE, mirrors?: string[] },
];

export type TranslationEngine = TranslationEngines[number];

export type Language = {
  name: "en";
  files: string[];
};

export type Path = string;

export type Languages = Language[];

export type Settings = {
  basePath: Path;
  translationEngines: Partial<TranslationEngines>;
  languages: Languages;
};
