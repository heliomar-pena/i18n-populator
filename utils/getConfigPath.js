const path = require('path');
const configPath = path.join(process.cwd(), 'i18n-auto-translate.config.json');

const config = require(configPath);

const parsePath = (customPath) => {
    return path.join(process.cwd(), customPath)
}

module.exports = { configPath, config, parsePath };