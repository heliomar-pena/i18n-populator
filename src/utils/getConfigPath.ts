import config from "../config";
import path from "path";

const { defaultConfigPath } = config;

const configPath = defaultConfigPath;

const parsePath = (customPath: string): string => {
  console.log({ customPath });
  return path.join(process.cwd(), customPath);
};

export { configPath, parsePath };
