import { translate } from "@vitalets/google-translate-api";
import { configPath, parsePath } from "../utils/getConfigPath.js";
import prompt from "../utils/promptUser.js";
import { validEngines } from "../services/translateService.js";
import fs from "fs";

import { jest } from "@jest/globals";

const config = {
  languages: [
    {
      name: "en",
      files: ["en.json"],
    },
    {
      name: "es",
      files: ["es.json"],
    },
  ],
  basePath: "test",
  translationEngines: ["google", "bing", "libreTranslate"],
};

jest.unstable_mockModule("./utils/importJSONFile.js", () => ({
  importJSONFile: jest.fn(async () => config),
}));

const { importJSONFile } = await import("../utils/importJSONFile.js");
const { getOrCreateJsonFile } = await import("../utils/getOrCreateJsonFile.js");
const { getLanguagesCodesWithNames, supportedLanguages } = await import(
  "../utils/supportedLanguagesUtils.js"
);
const translateController = (
  await import("../controllers/translateController.js")
).default;

describe("TranslateController", () => {
  let text, sourceLanguage, nameOfTranslation;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    text = "Hello World";
    sourceLanguage = "en";
    nameOfTranslation = "helloWorld";

    fs.existsSync.mockImplementation(() => true);
  });

  it("It's calling translate function for each language on config path except for the source language", async () => {
    const { languages } = config;

    await translateController({
      text,
      from: sourceLanguage,
      name: nameOfTranslation,
      settingsFile: configPath,
    });

    const isSourceLanguage = languages.some(
      (language) => language.name === sourceLanguage,
    );
    const timesToBeCalled = isSourceLanguage
      ? languages.length - 1
      : languages.length;

    expect(translate).toHaveBeenCalledTimes(timesToBeCalled);
  });

  it("It's throwing an error if no config file is found", async () => {
    fs.existsSync.mockImplementationOnce(() => false);

    await expect(
      translateController({
        text,
        from: sourceLanguage,
        name: nameOfTranslation,
        settingsFile: "non-existent-file",
      }),
    ).rejects.toThrow("No settings file found");
  });

  it("It's calling translate function for each language on config path", async () => {
    const { languages } = config;

    await translateController({
      text,
      from: "fr",
      name: nameOfTranslation,
      settingsFile: configPath,
    });

    expect(translate).toHaveBeenCalledTimes(languages.length);
  });

  it("It's throwing an error if no languages are found on config file", async () => {
    importJSONFile.mockImplementationOnce(async () => ({
      basePath: "test-configs/translations",
    }));

    await expect(
      translateController({
        text,
        from: sourceLanguage,
        name: nameOfTranslation,
        settingsFile: "test-configs/no-languages.json",
      }),
    ).rejects.toThrow(
      "No languages or basePath found, please check your settings file",
    );
  });

  it("It's throwing an error if an invalid translation engine is provided", async () => {
    const invalidTranslationEngineConfig = {
      basePath: "test-configs/translations",
      translationEngines: ["invalid-engine"],
      languages: [
        {
          name: "es",
          files: ["es.json"],
        },
      ],
    };

    importJSONFile.mockImplementationOnce(
      async () => invalidTranslationEngineConfig,
    );

    await expect(
      translateController({
        text,
        from: sourceLanguage,
        name: nameOfTranslation,
        settingsFile: "test-configs/invalid-translation-engine.json",
      }),
    ).rejects.toThrow(
      `There is an invalid translation engine on your settings file, here are the valid ones: ${validEngines.join(", ")}`,
    );
  });

  it("It's throwing an error if text is not provided", async () => {
    await expect(
      translateController({
        from: sourceLanguage,
        name: nameOfTranslation,
        settingsFile: configPath,
      }),
    ).rejects.toThrow("No text to translate provided");
  });

  it("It's throwing an error if source language is not provided", async () => {
    const error = new Error("No language provided");
    await expect(
      translateController({
        text,
        name: nameOfTranslation,
        settingsFile: configPath,
      }),
    ).rejects.toThrow(
      `${error.message}.\n\nPlease use one of these:\n\n${getLanguagesCodesWithNames(supportedLanguages).join("\n")}`,
    );
  });

  it("It's throwing an error if source language is invalid", async () => {
    const sourceLanguage = "invalid-language";
    const error = new Error(`Language ${sourceLanguage} is not supported`);
    await expect(
      translateController({
        text,
        from: sourceLanguage,
        name: nameOfTranslation,
        settingsFile: configPath,
      }),
    ).rejects.toThrow(
      `${error.message}.\n\nPlease use one of these:\n\n${getLanguagesCodesWithNames(supportedLanguages).join("\n")}`,
    );
  });

  it("It's throwing an error if name of translation is not provided", async () => {
    await expect(
      translateController({
        text,
        from: sourceLanguage,
        settingsFile: configPath,
      }),
    ).rejects.toThrow("No name of translation provided");
  });

  it("It's creating properly the files with the translation result", async () => {
    const testConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          name: "es",
          files: ["es.json"],
        },
      ],
    };

    await getOrCreateJsonFile("test-configs", "test-config.json", testConfig);

    fs.writeFileSync(
      "test-configs/test-config.json",
      JSON.stringify(testConfig, null, 2),
    );

    await translateController({
      text,
      from: sourceLanguage,
      name: nameOfTranslation,
      settingsFile: "test-configs/test-config.json",
    });

    expect(
      fs.existsSync(
        `${testConfig.basePath}/${testConfig.languages[0].files[0]}`,
      ),
    ).toBe(true);

    const { file } = await getOrCreateJsonFile(
      testConfig.basePath,
      testConfig.languages[0].files[0],
    );

    expect(file.helloWorld).toBe(
      `Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`,
    );
  });

  it("It's creating properly the files with object nesting", async () => {
    const testConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          name: "es",
          files: ["es.json"],
        },
      ],
    };

    await getOrCreateJsonFile("test-configs", "test-config.json", testConfig);

    fs.writeFileSync(
      "test-configs/test-config.json",
      JSON.stringify(testConfig, null, 2),
    );

    await translateController({
      text,
      from: sourceLanguage,
      name: "nested.helloWorld",
      settingsFile: "test-configs/test-config.json",
    });

    expect(
      fs.existsSync(
        `${testConfig.basePath}/${testConfig.languages[0].files[0]}`,
      ),
    ).toBe(true);

    const { file } = await getOrCreateJsonFile(
      testConfig.basePath,
      testConfig.languages[0].files[0],
    );

    expect(file.nested.helloWorld).toBe(
      `Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`,
    );
  });

  it("It's creating properly the files with deep object nesting", async () => {
    const testConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          name: "es",
          files: ["es.json"],
        },
      ],
    };

    await getOrCreateJsonFile("test-configs", "test-config.json", testConfig);

    fs.writeFileSync(
      "test-configs/test-config.json",
      JSON.stringify(testConfig, null, 2),
    );

    await translateController({
      text,
      from: sourceLanguage,
      name: "nested.deeply.object.to.test.helloWorld",
      settingsFile: "test-configs/test-config.json",
    });

    expect(
      fs.existsSync(
        `${testConfig.basePath}/${testConfig.languages[0].files[0]}`,
      ),
    ).toBe(true);

    const { file } = await getOrCreateJsonFile(
      testConfig.basePath,
      testConfig.languages[0].files[0],
    );

    expect(file.nested.deeply.object.to.test.helloWorld).toBe(
      `Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`,
    );
  });

  it("It's preserving old data on the files", async () => {
    const testConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          name: "es",
          files: ["es.json"],
        },
      ],
    };

    await getOrCreateJsonFile("test-configs", "test-config.json", testConfig);

    fs.writeFileSync(
      "test-configs/test-config.json",
      JSON.stringify(testConfig, null, 2),
    );

    await translateController({
      text,
      from: sourceLanguage,
      name: nameOfTranslation,
      settingsFile: "test-configs/test-config.json",
    });

    expect(
      fs.existsSync(
        `${testConfig.basePath}/${testConfig.languages[0].files[0]}`,
      ),
    ).toBe(true);

    await translateController({
      text,
      from: sourceLanguage,
      name: "helloWorld2",
      settingsFile: "test-configs/test-config.json",
    });

    const { file } = await getOrCreateJsonFile(
      testConfig.basePath,
      testConfig.languages[0].files[0],
    );

    expect(file.helloWorld).toBe(
      `Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`,
    );
    expect(file.helloWorld2).toBe(
      `Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`,
    );
  });

  it("It's preserving old data on the files even when the name of the translation is nested", async () => {
    const testConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          name: "es",
          files: ["es.json"],
        },
      ],
    };

    await getOrCreateJsonFile("test-configs", "test-config.json", testConfig);

    fs.writeFileSync(
      "test-configs/test-config.json",
      JSON.stringify(testConfig, null, 2),
    );

    await translateController({
      text,
      from: sourceLanguage,
      name: "nested.helloWorld",
      settingsFile: "test-configs/test-config.json",
    });

    expect(
      fs.existsSync(
        `${testConfig.basePath}/${testConfig.languages[0].files[0]}`,
      ),
    ).toBe(true);

    await translateController({
      text,
      from: sourceLanguage,
      name: "nested.helloWorld2",
      settingsFile: "test-configs/test-config.json",
    });

    const { file } = await getOrCreateJsonFile(
      testConfig.basePath,
      testConfig.languages[0].files[0],
    );

    expect(file.helloWorld).toBe(
      `Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`,
    );
    expect(file.nested.helloWorld).toBe(
      `Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`,
    );
  });

  it("It's throwing an error if no name is provided for a language", async () => {
    const testConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          files: ["en.json"],
        },
      ],
    };

    importJSONFile.mockImplementationOnce(async () => testConfig);

    await expect(
      translateController({
        text,
        from: sourceLanguage,
        name: nameOfTranslation,
        settingsFile: "test-configs/test-config-without-name.json",
      }),
    ).rejects.toThrow("No name found for language on index 0");
  });

  it("It's throwing an error if no files are provided for a language", async () => {
    const testConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          name: "en",
        },
      ],
    };

    importJSONFile.mockImplementationOnce(async () => testConfig);

    await expect(
      translateController({
        text,
        from: sourceLanguage,
        name: nameOfTranslation,
        settingsFile: "test-configs/test-config-without-files.json",
      }),
    ).rejects.toThrow(
      `No files found for language ${testConfig.languages[0].name} on index 0`,
    );
  });

  it("It's throwing an error if empty files are provided on files array", async () => {
    const testConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          name: "en",
          files: [""],
        },
      ],
    };

    importJSONFile.mockImplementationOnce(async () => testConfig);

    await expect(
      translateController({
        text,
        from: sourceLanguage,
        name: nameOfTranslation,
        settingsFile: "test-configs/test-config-with-empty-files.json",
      }),
    ).rejects.toThrow(
      "There is an invalid language config on your settings file, please check it",
    );
  });

  it("It's notifying the user if the property already exists on the file and ask if he wants to overwrite it", async () => {
    const testConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          name: "es",
          files: ["es.json"],
        },
      ],
    };

    const file = {
      [nameOfTranslation]: text,
    };

    importJSONFile.mockImplementation(async (path) => {
      if (path.includes("test-configs/test-config.json")) return testConfig;

      return file;
    });

    await translateController({
      text,
      from: sourceLanguage,
      name: nameOfTranslation,
      settingsFile: "test-configs/test-config.json",
    });

    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it("It's not overwriting the file if the user doesn't want to", async () => {
    const testConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          name: "es",
          files: ["es.json", "es-ES.json", "es-MX.json"],
        },
      ],
    };

    const file = {
      [nameOfTranslation]: text,
    };

    importJSONFile.mockImplementation(async (path) => {
      if (path.includes("test-configs/test-config.json")) return testConfig;

      return file;
    });

    prompt.mockImplementationOnce(() => "no");

    await translateController({
      text,
      from: sourceLanguage,
      name: nameOfTranslation,
      settingsFile: "test-configs/test-config.json",
    });

    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      parsePath(`${testConfig.basePath}/${testConfig.languages[0].files[1]}`),
      JSON.stringify(
        {
          [nameOfTranslation]: `${text} translated from ${sourceLanguage} to ${testConfig.languages[0].name}`,
        },
        null,
        2,
      ),
    );

    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      2,
      parsePath(`${testConfig.basePath}/${testConfig.languages[0].files[2]}`),
      JSON.stringify(
        {
          [nameOfTranslation]: `${text} translated from ${sourceLanguage} to ${testConfig.languages[0].name}`,
        },
        null,
        2,
      ),
    );

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);

    expect(prompt).toHaveBeenCalledTimes(3);
  });
});
