const { autoComplete, confirmUserAction } = require("./promptUtils");
const prompt = require("prompt-sync")();

describe("promptUtils", () => {
  describe("autoComplete", () => {
    it("should return a function", () => {
      const result = autoComplete([]);
      expect(result).toBeInstanceOf(Function);
    });

    it("should return an array of commands that start with the string passed to the function", () => {
      const commands = ["test", "test2", "test3"];
      const result = autoComplete(commands)("te");
      expect(result).toEqual(["test", "test2", "test3"]);
    });

    it("should return an empty array if no commands start with the string passed to the function", () => {
      const commands = ["test", "test2", "test3"];
      const result = autoComplete(commands)("a");
      expect(result).toEqual([]);
    });

    it("should return an empty array if no commands are passed to the function", () => {
      const result = autoComplete([])("a");
      expect(result).toEqual([]);
    });

    it("should return all the options of the array if no string is passed to the function", () => {
      const commands = ["test", "test2", "test3"];
      const result = autoComplete(commands)("");
      expect(result).toEqual(commands);
    });

    it("should return an empty array if no arguments are passed to the function", () => {
      const result = autoComplete()();
      expect(result).toEqual([]);
    });

    it("should only return commands that start with the string passed to the function", () => {
      const commands = ["yes", "no", "maybe", "yesterday", "tomorrow", "today"];

      const result = autoComplete(commands)("yes");
      expect(result).toEqual(["yes", "yesterday"]);

      const result2 = autoComplete(commands)("to");
      expect(result2).toEqual(["tomorrow", "today"]);

      const result3 = autoComplete(commands)("t");
      expect(result3).toEqual(["tomorrow", "today"]);

      const result4 = autoComplete(commands)("n");
      expect(result4).toEqual(["no"]);

      const result5 = autoComplete(commands)("m");
      expect(result5).toEqual(["maybe"]);
    });
  });
});

describe("confirmUserAction", () => {
  it("returns true when user confirms action", () => {
    const message = "Are you sure you want to proceed?";
    const expected = true;

    const result = confirmUserAction(message);

    expect(prompt).toHaveBeenCalledWith(message, "no", {
      autocomplete: expect.any(Function),
    });
    expect(result).toEqual(expected);
  });

  it("returns false when user cancels action", () => {
    const message = "Are you sure you want to proceed?";
    const expected = false;

    prompt.mockImplementationOnce(() => "no");

    const result = confirmUserAction(message);

    expect(prompt).toHaveBeenCalledWith(message, "no", {
      autocomplete: expect.any(Function),
    });
    expect(result).toEqual(expected);
  });

  it("returns false if user inserts an invalid option", () => {
    const message = "Are you sure you want to proceed?";
    const expected = false;

    prompt.mockImplementationOnce(() => "invalid option");

    const result = confirmUserAction(message);

    expect(prompt).toHaveBeenCalledWith(message, "no", {
      autocomplete: expect.any(Function),
    });
    expect(result).toEqual(expected);
  });
});
