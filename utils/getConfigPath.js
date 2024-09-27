import config from "../config.js";
import path from "path";

const { defaultConfigPath } = config;

const configPath = defaultConfigPath;

const parsePath = (customPath) => {
  return path.join(process.cwd(), customPath);
};

export { configPath, parsePath };
