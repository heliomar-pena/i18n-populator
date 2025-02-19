import fetch from "node-fetch";
import { TranslateOptions, TranslateResult, TranslateText } from "./translate";
import { TranslationEngines } from "../types/settings";

const defaultMirrors = [
  "https://translate.terraprint.co/translate",
  "https://trans.zillyhuhn.com/translate",
];

const libreTranslate = async (
  text: TranslateText,
  { from, to, config = {} }: TranslateOptions & { config: Omit<TranslationEngines[2], 'name'> },
): Promise<TranslateResult> => {
  const { mirrors = [] } = config;
  const allMirrors = mirrors.concat(defaultMirrors);

  for await (const url of allMirrors) {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          q: text,
          source: from,
          target: to,
          format: "text",
        }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());

      return { text: res.translatedText };
    } catch (err) {
      console.log(
        `Mirror failed: ${url} with the next error:\n\n> ${err.message}\n\nTrying with the next one...\n`,
      );
    }
  }

  throw new Error("All libreTranslate mirrors failed. Please try again later.");
};

const translate = async (text, { from, to, config }) => {
  const result = await libreTranslate(text, { from, to, config });

  return result;
};

export { translate };
