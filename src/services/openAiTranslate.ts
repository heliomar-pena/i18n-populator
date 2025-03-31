export const translate = async (
  text: string,
  { from, to }: { from: string; to: string },
  config: { OPENAI_API_KEY: string; OPENAI_API_URL: string } = {
    OPENAI_API_KEY: "",
    OPENAI_API_URL: "https://api.openai.com/v1/chat/completions",
  },
) => {
  const { OPENAI_API_KEY, OPENAI_API_URL } = config;

  const prompt = `Translate the following text from ${from} to ${to}: "${text}"`;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 1000,
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
