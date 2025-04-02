import { OpenAiEngine } from "../types/settings";
import { TranslateFn } from "./translate";

export const translate: TranslateFn<OpenAiEngine> = async (
  text: string,
  { from, to, config = {} },
) => {
  const {
    key,
    url = "https://api.openai.com/v1/chat/completions",
    max_tokens = 1000,
    model = "gpt-3.5-turbo",
  } = config;

  if (!key) {
    throw new Error("Api key is required to perform translation using openai");
  }

  const prompt = `Translate the following text from ${from} to ${to}: "${text}"`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: model,
      temperature: 0,
      max_tokens: max_tokens,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
      messages: [
        {
          role: "system",
          content:
            "You are a professional translation engine. Please translate text without explanation.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const translatedText = data.choices?.[0]?.message?.content?.trim();

  if (!translatedText) {
    throw new Error("Translation failed: No translation result");
  }

  return { text: translatedText };
};

export default translate;
