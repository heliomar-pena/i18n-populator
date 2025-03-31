export const translateWithDeepL = async (
  text: string,
  { from, to }: { from: string; to: string },
  config = {
    DEEPL_API_KEY: "",
    DEEPL_API_URL: "https://api-free.deepl.com/v2/translate",
  },
) => {
  const { DEEPL_API_KEY, DEEPL_API_URL } = config;

  const response = await fetch(DEEPL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
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

export default translateWithDeepL;
