import { MET } from "bing-translate-api";
import { TranslateFn, TranslateResult, TranslateText } from "./translate";
import { MicrosoftEngine } from "../types/settings";

const translate: TranslateFn<MicrosoftEngine> = async (
  text: TranslateText,
  { from, to, config }
): Promise<TranslateResult> => {
  const { key } = config;
  const headers = key ? { authenticationHeaders: { "Ocp-Apim-Subscription-Key": key } } : {};
  const result = await MET.translate(text, from, to, headers);

  if (!result) throw new Error('Error translating text with Bing.');

  const { translations } = result[0];

  return { text: translations[0].text };
};

export { translate };
