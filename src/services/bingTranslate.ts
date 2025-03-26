import { translate as bingTranslate } from "bing-translate-api";
import { TranslateOptions, TranslateResult, TranslateText } from "./translate";

const translate = async (
  text: TranslateText,
  { from, to }: TranslateOptions,
): Promise<TranslateResult> => {
  try {
    const { translation } = await bingTranslate(text, from, to);

    return { text: translation };
  } catch (error) {
    return { text: `Translation failed: Unknown error ${error}` };
  }
};

export { translate };
