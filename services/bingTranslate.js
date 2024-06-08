import { translate as bingTranslate } from 'bing-translate-api';

const translate = async (text, { from, to }) => {
  const { translation } = await bingTranslate(text, from, to);

  return { text: translation };
};

export { translate };
