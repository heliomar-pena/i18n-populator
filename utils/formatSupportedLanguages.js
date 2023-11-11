const getSupportedLanguagesWithNames = (supportedLanguages) => {
    return Object.entries(supportedLanguages).map(([language, data]) => {
        return `${language} -> ${data.name}`
    })
}

module.exports = {
    getSupportedLanguagesWithNames
}
