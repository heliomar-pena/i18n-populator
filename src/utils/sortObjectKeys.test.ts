// sortObjectKeys.test.ts
import { sortObjectKeys } from "./sortObjectKeys";
import { SortOrder } from "../types/settings";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

describe("sortObjectKeys", () => {
  it("Ordena un objeto de una sola profundidad", () => {
    const input = { b: 1, a: 2, c: 3 };
    const expectedAsc = { a: 2, b: 1, c: 3 };
    const expectedDesc = { c: 3, b: 1, a: 2 };

    expect(sortObjectKeys(input, SortOrder.ASC)).toEqual(expectedAsc);
    expect(sortObjectKeys(input, SortOrder.DESC)).toEqual(expectedDesc);
  });

  it("Ordena un objeto de 3 niveles de profundidad", () => {
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

  it("Ordena un objeto que contiene claves numéricas y cadenas", () => {
    const input = {
      "10": "clave numérica",
      "2": "otra clave numérica",
      a: "cadena",
      "1": "uno",
    };
    // Las claves se tratan como strings, y localeCompare hace una comparación lexicográfica.
    const expectedAsc = {
      "1": "uno",
      "10": "clave numérica",
      "2": "otra clave numérica",
      a: "cadena",
    };
    const expectedDesc = {
      a: "cadena",
      "2": "otra clave numérica",
      "10": "clave numérica",
      "1": "uno",
    };

    expect(sortObjectKeys(input, SortOrder.ASC)).toEqual(expectedAsc);
    expect(sortObjectKeys(input, SortOrder.DESC)).toEqual(expectedDesc);
  });

  it("Ordena un objeto que contiene arrays", () => {
    const input = {
      b: [{ d: 4, c: 3 }, { f: 6, e: 5 }],
      a: [{ h: 8, g: 7 }],
    };
    const expectedAsc = {
      a: [{ g: 7, h: 8 }],
      b: [{ c: 3, d: 4 }, { e: 5, f: 6 }],
    };
    const expectedDesc = {
      b: [{ d: 4, c: 3 }, { f: 6, e: 5 }],
      a: [{ h: 8, g: 7 }],
    };

    expect(sortObjectKeys(input, SortOrder.ASC)).toEqual(expectedAsc);
    expect(sortObjectKeys(input, SortOrder.DESC)).toEqual(expectedDesc);
  });
});
