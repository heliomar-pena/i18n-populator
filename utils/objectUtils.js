/**
 * Checks if an object has a property with the given path.
 * @param {Object} obj - The object to check.
 * @param {string | Array<string>} path - The path to the property to check. Can be a string with dot notation or an array of keys.
 * @returns {boolean} - True if the object has the property, false otherwise.
 */
const hasProperty = (obj, path) => {
  /**
   * This regexp is used to split the path string into an array of keys using "[", "]" and "." as separators.
   * In https://regexr.com/58j0k you can get a playground to test and analyze it.
   * @type {RegExp}
   * @example
   * // returns ["test", "test2", "test3"]
   * "test[test2].test3".match(/([^[.\]])+/g)
   */
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

  const objHasProperty = pathArray.reduce((prevObj, key) => prevObj && prevObj[key], obj) !== undefined;

  return objHasProperty;
}

module.exports = { hasProperty };
