import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { confirmUserAction } from "./promptUtils";
import { confirm } from "@inquirer/prompts";

const mockedConfirm = jest.mocked(confirm);

describe.only("promptUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("confirmUserAction", () => {
    let message: string, expected: boolean;
    beforeEach(() => {
      message = "Are you sure you want to proceed?";
    });

    describe("When user confirms action", () => {
      beforeEach(() => {
        expected = true;
        mockedConfirm.mockResolvedValueOnce(expected);
      });

      it("then returns ture", async () => {
        const result = await confirmUserAction(message);

        expect(mockedConfirm).toHaveBeenCalledWith({ message, default: false });
        expect(result).toEqual(expected);
      });
    });

    describe("When user rejects action", () => {
      beforeEach(() => {
        expected = false;
        mockedConfirm.mockResolvedValueOnce(expected);
      });

      it("then returns false", async () => {
        const result = await confirmUserAction(message);

        expect(mockedConfirm).toHaveBeenCalledWith({ message, default: false });
        expect(result).toEqual(expected);
      });
    });
  });
});
