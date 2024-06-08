import { configPath, parsePath } from './getConfigPath.js';
import path from 'path';
import { defaultConfigPath } from '../config.js';

describe("getConfigPath", () => {
  it("should return the configPath", () => {
    expect(configPath).toEqual(defaultConfigPath);
  });

  it("parsePath function should return the path parsed so nodejs can understand easily where is the file", () => {
    expect(parsePath(configPath)).toEqual(path.join(process.cwd(), configPath));
  });
});
