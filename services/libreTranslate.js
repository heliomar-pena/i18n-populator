import fetch from "node-fetch";

const mirrors = [
  "https://translate.terraprint.co/translate",
  "https://trans.zillyhuhn.com/translate",
];

const libreTranslate = async (text, { from, to }) => {
  for await (const url of mirrors) {
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

const translate = async (text, { from, to }) => {
  const result = await libreTranslate(text, { from, to });

  return result;
};

export { translate };
