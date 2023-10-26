const fetch = require("node-fetch");

const mirrors = [
    "https://translate.terraprint.co/translate",
    "https://trans.zillyhuhn.com/translate",
]

const libreTranslate = async (text, {from, to}) => {
    for await (url of mirrors) {
        try {
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    q: text,
                    source: from,
                    target: to,
                    format: "text",
                }),
                headers: { "Content-Type": "application/json" }
            }).then((res) => res.json());
            
            return { text: res.translatedText }
        } catch (err) {
            console.log(`Mirror failed: ${url}. Trying with the next one...`)
        }
    }
}

const translate = async (text, { from, to }) => {
    const result = await libreTranslate(text, { from, to });

    return result;
}

module.exports = { translate };
