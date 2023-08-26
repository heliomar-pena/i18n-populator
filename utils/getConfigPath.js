const { defaultConfigPath } = require('../config');

const path = require('path');
const configPath = defaultConfigPath; 

const parsePath = (customPath) => {
    return path.join(process.cwd(), customPath)
};

const configPathParsed = parsePath(configPath);
const config = require(configPathParsed);

module.exports = { configPath, config, parsePath };
