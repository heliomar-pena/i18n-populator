import fs from "fs";
import { parsePath } from "./getConfigPath";

const importJsonFile = <ReturnType>(
  parsedFilePath: string,
): Promise<ReturnType> => {
  return new Promise((resolve, reject) => {
    fs.readFile(parsedFilePath, "utf8", (err, data) => {
      try {
        if (err) throw err;

        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
};

const getOrCreateJsonFile = async <JsonType>(basePath, fileName) => {
  const parsedPath = parsePath(`${basePath}/${fileName}`);

  if (fs.existsSync(parsedPath)) {
    try {
      const file = await importJsonFile<JsonType>(parsedPath);

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

export { getOrCreateJsonFile, importJsonFile };
