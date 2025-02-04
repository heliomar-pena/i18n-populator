import fs from "fs/promises";
import { configPath } from "./getConfigPath.js";

const getConfig = async () => {
  try {
    const data = await fs.readFile(configPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
};

export { getConfig };
