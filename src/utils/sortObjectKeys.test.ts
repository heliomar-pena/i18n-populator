import { describe, expect, it, jest } from "@jest/globals";
import { sortObjectKeys } from "./sortObjectKeys";
import { SortOrder } from "../types/settings";

jest.mock("../types/settings", () => ({
  SortOrder: {
    ASC: "A-Z",
    DESC: "Z-A",
    NONE: "none",
  },
}));

describe("sortObjectKeys", () => {
  it("Sorts a shallow object", () => {
    const input = { b: 1, a: 2, c: 3 };
    const expectedAsc = { a: 2, b: 1, c: 3 };
    const expectedDesc = { c: 3, b: 1, a: 2 };

    expect(sortObjectKeys(input, SortOrder.ASC)).toEqual(expectedAsc);
    expect(sortObjectKeys(input, SortOrder.DESC)).toEqual(expectedDesc);
  });

  it("Sorts a 3-level deep object", () => {
    const input = {
      b: { d: 4, c: 3 },
      a: { f: 6, e: 5 },
      c: { h: { j: 10, i: 9 }, g: 7 },
    };
    const expectedAsc = {
      a: { e: 5, f: 6 },
      b: { c: 3, d: 4 },
      c: { g: 7, h: { i: 9, j: 10 } },
    };
    const expectedDesc = {
      c: { h: { j: 10, i: 9 }, g: 7 },
      b: { d: 4, c: 3 },
      a: { f: 6, e: 5 },
    };

    expect(sortObjectKeys(input, SortOrder.ASC)).toEqual(expectedAsc);
    expect(sortObjectKeys(input, SortOrder.DESC)).toEqual(expectedDesc);
  });

  it("Sorts an object containing numeric and string keys", () => {
    const input = {
      "10": "numeric key",
      "2": "another numeric key",
      a: "string",
      "1": "one",
    };
    const expectedAsc = {
      "1": "one",
      "10": "numeric key",
      "2": "another numeric key",
      a: "string",
    };
    const expectedDesc = {
      a: "string",
      "2": "another numeric key",
      "10": "numeric key",
      "1": "one",
    };

    expect(sortObjectKeys(input, SortOrder.ASC)).toEqual(expectedAsc);
    expect(sortObjectKeys(input, SortOrder.DESC)).toEqual(expectedDesc);
  });

  it("Sorts an object containing arrays", () => {
    const input = {
      b: [
        { d: 4, c: 3 },
        { f: 6, e: 5 },
      ],
      a: [{ h: 8, g: 7 }],
    };
    const expectedAsc = {
      a: [{ g: 7, h: 8 }],
      b: [
        { c: 3, d: 4 },
        { e: 5, f: 6 },
      ],
    };
    const expectedDesc = {
      b: [
        { d: 4, c: 3 },
        { f: 6, e: 5 },
      ],
      a: [{ h: 8, g: 7 }],
    };

    expect(sortObjectKeys(input, SortOrder.ASC)).toEqual(expectedAsc);
    expect(sortObjectKeys(input, SortOrder.DESC)).toEqual(expectedDesc);
  });
});
