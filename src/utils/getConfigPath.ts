import config from "../config.js";
import path from "path";

const { defaultConfigPath } = config;

const configPath = defaultConfigPath;

const parsePath = (customPath: string): string => {
  return path.join(process.cwd(), customPath);
};

export { configPath, parsePath };
