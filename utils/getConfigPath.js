const { defaultConfigPath } = require("../config");

const path = require("path");
const configPath = defaultConfigPath;

const parsePath = (customPath) => {
  return path.join(process.cwd(), customPath);
};

module.exports = { configPath, parsePath };
