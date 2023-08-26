const { configPath, config, parsePath } = require('./getConfigPath');
const path = require('path');
const { defaultConfigPath } = require('../config');

describe("getConfigPath", () => {
    it("should return the configPath", () => {
        expect(configPath).toEqual(defaultConfigPath);
    })

    it("should return the default config json", () => {
        expect(config).toEqual(require(parsePath(defaultConfigPath)));
    })

    it("parsePath function should return the path parsed so nodejs can understand easily where is the file", () => {
        expect(parsePath(configPath)).toEqual(path.join(process.cwd(), configPath));
    })
})
