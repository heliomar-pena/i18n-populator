/**
 * Normalizes a file path based on the operating system.
 *
 * @param {string} pathString - The string representing the file path to be normalized.
 * @returns {string} A normalized file path.
 *
 * @throws {Error} Throws an error if no string is provided.
 *
 * @example
 * // On Windows:
 * normalizeFilePath('file:///C:/Users/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs/test-config.json')
 * // Returns 'C:/Users/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs'
 *
 * @example
 * // On Unix:
 * normalizeFilePath('file://home/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs/test-config.json')
 * // Returns 'home/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs'
 */
function normalizeFilePath(pathString) {
  if (!pathString) throw new Error("No string provided");

  const finalPath =
    process.platform === "win32"
      ? pathString
          .split("/")
          .slice(0, -1)
          .join("/")
          .replace(/^file:\/\/\/?/, "")
      : pathString.split("/").slice(0, -1).join("/").replace("file://", "");

  return finalPath;
}

export { normalizeFilePath };
