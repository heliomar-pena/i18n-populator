import { MET } from "bing-translate-api";
import { TranslateFn, TranslateResult, TranslateText } from "./translate";
import { MicrosoftEngine } from "../types/settings";

const translate: TranslateFn<MicrosoftEngine> = async (
  text: TranslateText,
  { from, to, config }
): Promise<TranslateResult> => {
  const { key } = config;
  const result = await MET.translate(text, from, to, { ...(key ? ({ authenticationHeaders: { "Ocp-Apim-Subscription-Key": key } }) : {}) }) as MET.MetTranslationResult[];
  const { translations } = result[0];

  return { text: translations[0].text };
};

export { translate };
