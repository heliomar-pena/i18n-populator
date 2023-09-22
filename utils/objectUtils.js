const has = (obj, path) => {
  // Regex explained: https://regexr.com/58j0k
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

  return !!pathArray.reduce((prevObj, key) => prevObj && prevObj[key], obj)
}

module.exports = { has };
