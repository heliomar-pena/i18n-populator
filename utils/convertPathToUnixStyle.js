import pathModule from "path";

/**
 * Converts a file path to Unix style if the operating system is Windows.
 *
 * @param {string} filePathString - The string representing the file path to be converted.
 * @returns {string} The converted file path in Unix style.
 *
 * @example
 * // On Windows:
 * convertPathToUnixStyle('C:\\Users\\pepe\\Documents\\jobus\\blazer\\misc\\i18n-populator\\test-configs\\test-config.json')
 * // Returns 'C:/Users/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs/test-config.json'
 *
 * @example
 * // On Unix:
 * convertPathToUnixStyle('/home/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs/test-config.json')
 * // Returns '/home/pepe/Documents/jobus/blazer/misc/i18n-populator/test-configs/test-config.json'
 */
function convertPathToUnixStyle(filePathString) {
  if (!filePathString) throw new Error("No string provided");

  const normalizedPath =
    process.platform === "win32"
      ? pathModule.posix.join(...filePathString.split('\\'))
      : filePathString;

  return normalizedPath;
}

export { convertPathToUnixStyle };
