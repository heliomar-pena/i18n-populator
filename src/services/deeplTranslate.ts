import { OpenAiEngine } from "../types/settings";
import { TranslateFn } from "./translate";

export const translate: TranslateFn<OpenAiEngine> = async (
  text: string,
  { from, to, config = {} },
) => {
  const { key, url = "https://api-free.deepl.com/v2/translate" } = config;

  if (!key) {
    throw new Error("Api key is required to perform translation using deepl");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `DeepL-Auth-Key ${key}`,
    },
    body: new URLSearchParams({
      text,
      source_lang: from.toUpperCase(),
      target_lang: to.toUpperCase(),
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`DeepL API error: ${response.statusText}`);
  }

  const data = await response.json();
  const translatedText = data.translations?.[0]?.text?.trim();

  if (!translatedText) {
    throw new Error("Translation failed: No translation result");
  }

  return { text: translatedText };
};

export default translate;
