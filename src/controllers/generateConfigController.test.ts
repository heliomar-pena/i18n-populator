import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import {
  _promptBasePath,
  _promptLanguages,
  _promptTranslationEngines,
} from "./generateConfigController";

// rewrite tests
describe.skip("_promptTranslationEngines", () => {
  it("skip", () => {
    expect(true).toEqual(true);
  });
});
