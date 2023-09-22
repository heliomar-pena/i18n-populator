const hasProperty = (obj, path) => {
  // Regex explained: https://regexr.com/58j0k
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

  const objHasProperty = pathArray.reduce((prevObj, key) => prevObj && prevObj[key], obj) !== undefined;

  return objHasProperty;
}

module.exports = { hasProperty };
