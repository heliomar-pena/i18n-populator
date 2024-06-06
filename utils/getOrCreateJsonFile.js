const fs = require("fs");
const { parsePath } = require("./getConfigPath");

const getOrCreateJsonFile = (basePath, fileName) => {
  const parsedPath = parsePath(`${basePath}/${fileName}`);

  if (fs.existsSync(parsedPath)) {
    const file = require(parsedPath);
    return { file, parsedPath };
  }

  const file = {};

  const directory = basePath;
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(parsedPath, JSON.stringify(file, null, 2));

  return { file, parsedPath };
};

module.exports = { getOrCreateJsonFile };
