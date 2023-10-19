const { translate: bingTranslate } = require('bing-translate-api');

const translate = async (text, { from, to }) => {
    const { translation } = await bingTranslate(text, from, to);
    
    return { text: translation };
}

module.exports = { translate };
