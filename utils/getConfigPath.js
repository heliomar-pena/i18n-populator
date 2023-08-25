const path = require('path');
const configPath = 'i18n-auto-translate.config.json';

const parsePath = (customPath) => {
    return path.join(process.cwd(), customPath)
};

const configPathParsed = path.join(process.cwd(), configPath);
const config = require(configPathParsed);

module.exports = { configPath, config, parsePath };
