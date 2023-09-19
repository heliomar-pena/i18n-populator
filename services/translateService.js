const { translate: googleTranslate } = require('@vitalets/google-translate-api');

const translateEngines = {
    google: googleTranslate
}

const validEngines = Object.keys(translateEngines).join(', ');

const translate = async (text, from, to, engine = 'google') => {
    if (!translateEngines[engine]) throw new Error(`Invalid engine. Try with one of these: ${validEngines}`);
    
    if (from === to) return { text };

    return await translateEngines[engine](text, { from, to });
}

module.exports = { translate, validEngines };
