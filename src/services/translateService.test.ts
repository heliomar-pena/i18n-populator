import { translate as googleTranslate } from "@vitalets/google-translate-api";
import { translate as libreTranslate } from "./libreTranslate";
import { MET } from "bing-translate-api";
import { translate, validEngines } from "./translateService";

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Engines } from "../types/settings.d";

describe("translate", () => {
  let text: string, from: string, to: string;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    text = "Hello world!";
    from = "en";
    to = "es";
  });

  it("should translate text from English to Spanish using Google Translate", async () => {
    const result = await translate(text, from, to);

    expect(googleTranslate).toHaveBeenCalledTimes(1);
    expect(result.text).toBe(`Hello world! translated from ${from} to ${to}`);
  });

  it("should translate text from English to Spanish using Bing Translate", async () => {
    const engine = { name: Engines.BING };
    const result = await translate(text, from, to, engine);

    expect(MET.translate).toHaveBeenCalledTimes(1);
    expect(result.text).toBe(
      `Hello world! translated from ${from} to ${to} using ${engine.name}`,
    );
  });

  it("should translate text from English to Spanish using LibreTranslate", async () => {
    const engine = { name: Engines.LIBRE_TRANSLATE };
    const result = await translate(text, from, to, engine);

    expect(libreTranslate).toHaveBeenCalledTimes(1);
    expect(result.text).toBe(
      `Hello world! translated from ${from} to ${to} using ${engine.name}`,
    );
  });

  it("should return the same text if from and to languages are the same", async () => {
    to = "en";

    const result = await translate(text, from, to);
    expect(googleTranslate).toHaveBeenCalledTimes(0);
    expect(result.text).toBe(text);
  });

  it("should throw an error if an invalid engine is provided", async () => {
    const engine = { name: "invalid" as Engines };
    await expect(translate(text, from, to, engine)).rejects.toThrow(
      `Invalid engine. Try with one of these: ${validEngines.join(", ")}`,
    );
  });
});
