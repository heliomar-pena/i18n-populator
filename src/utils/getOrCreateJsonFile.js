import fs from "fs";
import { parsePath } from "./getConfigPath.js";
import { importJSONFile } from "./importJSONFile.js";

const getOrCreateJsonFile = async (basePath, fileName) => {
  const parsedPath = parsePath(`${basePath}/${fileName}`);

  if (fs.existsSync(parsedPath)) {
    try {
      const file = await importJSONFile(parsedPath);
      return { file, parsedPath };
    } catch (error) {
      console.error(`Error reading file ${parsedPath}.`);

      if (error instanceof SyntaxError) {
        console.error("Syntax error in JSON file. It is probably malformed.");
        console.error(
          "It exists and is on your i18n-populator.config.js file but it is not a valid JSON file.",
        );
      }

      process.exit(1);
    }
  }

  const file = {};

  const directory = basePath;
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(parsedPath, JSON.stringify(file, null, 2));

  return { file, parsedPath };
};

export { getOrCreateJsonFile };
