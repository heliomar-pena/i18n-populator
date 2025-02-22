export type TranslateOptions = {
  from: string;
  to: string;
};

export type TranslateText = string;

export type TranslateResult = { text: string };

export type TranslateFn<TranslationEngine> = (
  text: TranslateText,
  {}: TranslateOptions & { config: Omit<TranslationEngine, "name"> },
) => Promise<TranslateResult>;
