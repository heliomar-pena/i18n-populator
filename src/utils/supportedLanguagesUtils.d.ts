import { Engines, Language } from "../types/settings.d";

export type LanguageObject = {
  name: string;
};

export type EnginesObject = {
  [key in Engines]?: string;
};

export type AllLanguagesCodes = {
  [key: string]: LanguageObject & EnginesObject;
};

export type AllLanguagesGroupedByEngine = {
  [key in Engines]?: {
    [key: string]: LanguageObject;
  };
};

export type ValidateLanguageIsSupportedByEngine = (
  requestedLanguage: string,
  engine: Engines,
) => true | never;

export type ValidateLanguageRequested = (requestedLanguage: string) => Boolean;

export type GetLanguageCodeByEngine = (
  requestedLanguage: string,
  engine: Engines,
) => string;

export type GetLanguagesCodesWithNames = (
  languages?: AllLanguagesCodes,
) => string[];
