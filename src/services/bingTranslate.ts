import { translate as bingTranslate } from "bing-translate-api";
import { TranslateOptions, TranslateText } from "./translate";

const translate = async (
  text: TranslateText,
  { from, to }: TranslateOptions
) => {
  const { translation } = await bingTranslate(text, from, to);

  return { text: translation };
};

export { translate };
