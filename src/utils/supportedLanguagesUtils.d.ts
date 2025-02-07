import { Engines, Language } from "../types/settings.d";

export interface LanguageObject {
  name: string;
}

export type AllLanguagesCodes = {
  [key: string]: LanguageObject & {
    [key in Engines]?: string;
  };
};

export type AllLanguagesGroupedByEngine = {
  [key in Engines]?: LanguageObject;
};

export type ValidateLanguageIsSupportedByEngine = (
  requestedLanguage: string,
  engine: Engines
) => Boolean;

export type ValidateLanguageRequested = (requestedLanguage: string) => Boolean;

export type GetLanguageCodeByEngine = (
  requestedLanguage: string,
  engine: Engines
) => string;

export type GetLanguagesCodesWithNames = (languages: AllLanguagesCodes) => string[];
