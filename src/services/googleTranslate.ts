import { Translate } from "@google-cloud/translate/build/src/v2";
import { TranslateFn } from "./translate";
import { GoogleEngine } from "../types/settings";
import { translate as googleTranslate } from "@vitalets/google-translate-api";

export const translate: TranslateFn<GoogleEngine> = async (
  text: string,
  { from, to, config = {} },
) => {
  const { key } = config;

  if (!key) {
    return googleTranslate(text, { from, to });
  }

  const translator = new Translate({ key });
  const [translatedText] = await translator.translate(text, { from, to });

  if (!translatedText) {
    throw new Error("Translation failed: No translation result");
  }

  return { text: translatedText };
};

export default translate;
