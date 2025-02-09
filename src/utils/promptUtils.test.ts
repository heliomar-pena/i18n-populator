import { describe, expect, it, jest } from "@jest/globals";
import { confirmUserAction } from "./promptUtils";

// Adapt to inquirer
describe.skip("promptUtils", () => {
  describe("confirmUserAction", () => {
    it("returns true when user confirms action", () => {
      const message = "Are you sure you want to proceed?";
      const expected = true;

      const result = confirmUserAction(message);

      expect(prompt).toHaveBeenCalledWith(message, {
        echo: expect.any(String),
        eot: expect.any(Boolean),
        sigint: expect.any(Boolean),
        defaultResponse: "no",
        autocomplete: expect.any(Object),
      });
      expect(result).toEqual(expected);
    });

    it("returns false when user cancels action", () => {
      const message = "Are you sure you want to proceed?";
      const expected = false;

      (prompt as jest.Mock).mockImplementationOnce(() => "no");

      const result = confirmUserAction(message);

      expect(prompt).toHaveBeenCalledWith(message, {
        echo: expect.any(String),
        eot: expect.any(Boolean),
        sigint: expect.any(Boolean),
        defaultResponse: "no",
        autocomplete: expect.any(Object),
      });
      expect(result).toEqual(expected);
    });

    it("returns false if user inserts an invalid option", () => {
      const message = "Are you sure you want to proceed?";
      const expected = false;

      (prompt as jest.Mock).mockImplementationOnce(() => "invalid option");

      const result = confirmUserAction(message);

      expect(prompt).toHaveBeenCalledWith(message, {
        echo: expect.any(String),
        eot: expect.any(Boolean),
        sigint: expect.any(Boolean),
        defaultResponse: "no",
        autocomplete: expect.any(Object),
      });
      expect(result).toEqual(expected);
    });
  });
});
