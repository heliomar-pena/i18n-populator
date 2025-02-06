import { readFile } from "fs/promises";
import path from "path";
import { normalizeFilePath } from "./normalizeFilePath.js";

/**
 * Imports a JSON file from the specified path and returns the parsed JSON data.
 *
 * @param {string} path - The path to the JSON file.
 * @param {string} url - The URL to the JSON file.
 * @returns {Promise<Object>} - A promise that resolves to the parsed JSON data.
 */
async function importJSONFile(filePath, url) {
  if (!filePath) throw new Error("No file path provided");

  let finalPath = "";

  if (typeof url === "string" && url.length > 0)
    finalPath = normalizeFilePath(url);

  finalPath = path.join(finalPath, filePath);

  try {
    const data = await readFile(finalPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError)
      throw new SyntaxError("File is not a valid JSON.");
    throw new Error(`File not found: ${finalPath}`);
  }
}

export { importJSONFile };
