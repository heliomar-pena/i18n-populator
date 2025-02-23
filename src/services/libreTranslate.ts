import fetch from "node-fetch";
import { TranslateFn } from "./translate.d";
import { LibreTranslateEngine } from "../types/settings.d";

const defaultMirrors: string[] = [];

const libreTranslate: TranslateFn<LibreTranslateEngine> = async (
  text,
  { from, to, config = {} },
) => {
  const { mirrors = [] } = config;
  const allMirrors = mirrors.concat(defaultMirrors);

  for await (const url of allMirrors) {
    try {
      const res = await fetch(new URL("/translate", url), {
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
      if (err instanceof Error) {
        console.log(
          `Mirror failed: ${url} with the next error:\n\n> ${err.message}\n\nTrying with the next one...\n`,
        );
      }
    }
  }

  throw new Error("All libreTranslate mirrors failed. Please try again later.");
};

const translate: TranslateFn<LibreTranslateEngine> = async (
  text,
  { from, to, config },
) => {
  const result = await libreTranslate(text, { from, to, config });

  return result;
};

export { translate };
