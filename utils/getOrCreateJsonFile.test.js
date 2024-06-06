const { parsePath } = require("./getConfigPath");
const { getOrCreateJsonFile } = require("./getOrCreateJsonFile");
const fs = require("fs");

describe("getOrCreateJsonFile", () => {
  let basePath, fileName, fileContent;
  beforeEach(() => {
    basePath = "test-configs/translations";
    fileName = "en.json";
    fileContent = { test: "test" };
  });

  afterEach(() => {
    fs.rmSync("test-configs", { recursive: true });
  });

  it("should create a new file and return the file and the parsedPath if file doesn't exists", () => {
    const { file, parsedPath } = getOrCreateJsonFile(basePath, fileName);
    expect(file).toEqual({});
    expect(parsedPath).toEqual(parsePath(`${basePath}/${fileName}`));
    expect(fs.existsSync(parsedPath)).toBe(true);
  });

  it("should return the file and the parsedPath if file exists", () => {
    fs.mkdirSync(basePath, { recursive: true });
    fs.writeFileSync(
      `${basePath}/${fileName}`,
      JSON.stringify(fileContent, null, 2),
    );

    const { file, parsedPath } = getOrCreateJsonFile(basePath, fileName);
    expect(file).toEqual(fileContent);
    expect(parsedPath).toEqual(parsePath(`${basePath}/${fileName}`));
  });
});
