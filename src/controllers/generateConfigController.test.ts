import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import {
  _promptBasePath,
  _promptLanguages,
  _promptTranslationEngines,
  generateConfigController,
} from "./generateConfigController";
import fs from "fs";
import { confirmUserAction } from "../utils/promptUtils";

jest.mock("../utils/promptUtils", () => ({
  confirmUserAction: jest.fn(async (message) => true),
  promptUserInput: jest.fn(() => ""),
  promptUserOptions: jest.fn(() => ""),
}));

const mockProcessExit = jest
  .spyOn(process, "exit")
  .mockImplementation((code) => {
    throw new Error(`Process.exit(${code})`);
  });

const mockedConfirmUserAction = jest.mocked(confirmUserAction);
const mockedFsExistsSync = jest.mocked(fs.existsSync);

describe("generateConfigController", () => {
  describe("When configuration file already exists", () => {
    beforeEach(() => {
      mockedFsExistsSync.mockImplementation(() => true);
    });

    it("Should confirm if user wants to replace it", async () => {
      mockedConfirmUserAction.mockImplementation(async () => false);

      await expect(generateConfigController).rejects.toThrow();

      expect(mockProcessExit).toHaveBeenCalledWith(0);
      expect(mockedConfirmUserAction).toHaveBeenCalledWith(
        "The configuration file already exists. Do you want to overwrite it?:",
      );
    });
  });
});
