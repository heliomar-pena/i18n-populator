import { Engines } from "../types/settings";
import { LanguageObject } from "../utils/supportedLanguagesUtils.d";

export type LanguagesController = ({ byEngine }: { byEngine?: Engines }) => {
  totalLanguages: number;
  languagesWithNames: string[];
  languages: { [key: string]: LanguageObject };
};
