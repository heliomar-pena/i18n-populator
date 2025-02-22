import { Engines, TranslationEngines } from "../types/settings.d";
import { TranslateResult, TranslateText } from "./translate.d";

export type TranslateFn = (
  text: TranslateText,
  from: string,
  to: string,
) => Promise<TranslateResult>;

export type SetTranslateWithFallbackEnginesReturn = {
  engines: Partial<TranslationEngines>;
  translate: TranslateFn;
};

export type SetTranslateWithFallbackEngines = {
  settingsTranslationEngines?: Partial<TranslationEngines>;
  cliArgEngine?: Engines;
};

export type SetTranslateWithFallbackEnginesFn = (
  options: SetTranslateWithFallbackEngines,
) => SetTranslateWithFallbackEnginesReturn;
