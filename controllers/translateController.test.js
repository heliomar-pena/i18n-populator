import { translate } from '@vitalets/google-translate-api.js';
import { translateController } from './translateController.js';
import { configPath, parsePath } from '../utils/getConfigPath.js';
import { getOrCreateJsonFile } from '../utils/getOrCreateJsonFile.js';
import promptFactory from 'prompt-sync.js';
const prompt = promptFactory();
import fs from 'fs';
import { validEngines } from '../services/translateService.js';
import { getLanguagesCodesWithNames, supportedLanguages } from '../utils/supportedLanguagesUtils.js';

const config = require(parsePath(configPath));

describe("TranslateController", () => {
  let text, sourceLanguage, nameOfTranslation;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    text = "Hello World";
    sourceLanguage = "en";
    nameOfTranslation = "helloWorld";

    if (fs.existsSync("test-configs")) {
      fs.rmSync("test-configs", { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync("test-configs")) {
      fs.rmSync("test-configs", { recursive: true });
    }
  });

  it("It's calling translate function for each language on config path except for the source language", async () => {
    const { languages } = config;

    await translateController(text, sourceLanguage, nameOfTranslation, {
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
    await expect(
      translateController(text, sourceLanguage, nameOfTranslation, {
        settingsFile: "non-existent-file",
      }),
    ).rejects.toThrow("No settings file found");
  });

  it("It's handling properly custom config files", async () => {
    const customConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          name: "es",
          files: ["es.json"],
        },
        {
          name: "fr",
          files: ["fr.json"],
        },
      ],
    };

    await getOrCreateJsonFile("test-configs", "custom-config.json", customConfig);

    fs.writeFileSync(
      "test-configs/custom-config.json",
      JSON.stringify(customConfig, null, 2),
    );

    await translateController(text, sourceLanguage, nameOfTranslation, {
      settingsFile: "test-configs/custom-config.json",
    });

    expect(translate).toHaveBeenCalledTimes(2);
  });

  it("It's throwing an error if no languages are found on config file", async () => {
    const noLanguagesConfig = {
      basePath: "test-configs/translations",
    };

    await getOrCreateJsonFile("test-configs", "no-languages.json", noLanguagesConfig);

    fs.writeFileSync(
      "test-configs/no-languages.json",
      JSON.stringify(noLanguagesConfig, null, 2),
    );

    await expect(
      translateController(text, sourceLanguage, nameOfTranslation, {
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

    await getOrCreateJsonFile(
      "test-configs",
      "invalid-translation-engine.json",
      invalidTranslationEngineConfig,
    );

    fs.writeFileSync(
      "test-configs/invalid-translation-engine.json",
      JSON.stringify(invalidTranslationEngineConfig, null, 2),
    );

    await expect(
      translateController(text, sourceLanguage, nameOfTranslation, {
        settingsFile: "test-configs/invalid-translation-engine.json",
      }),
    ).rejects.toThrow(
      `There is an invalid translation engine on your settings file, here are the valid ones: ${validEngines.join(", ")}`,
    );
  });

  it("It's throwing an error if text is not provided", async () => {
    await expect(
      translateController(undefined, sourceLanguage, nameOfTranslation, {
        settingsFile: configPath,
      }),
    ).rejects.toThrow("No text to translate provided");
  });

  it("It's throwing an error if source language is not provided", async () => {
    const error = new Error("No language provided");
    await expect(
      translateController(text, undefined, nameOfTranslation, {
        settingsFile: configPath,
      }),
    ).rejects.toThrow(
      `${error.message}.\n\nPlease use one of these:\n\n${getLanguagesCodesWithNames(supportedLanguages).join("\n")}`,
    );
  });

  it("It's throwing an error if source language is not supported", async () => {
    const sourceLanguage = "invalid-language";
    const error = new Error(`Language ${sourceLanguage} is not supported`);
    await expect(
      translateController(text, sourceLanguage, nameOfTranslation, {
        settingsFile: configPath,
      }),
    ).rejects.toThrow(
      `${error.message}.\n\nPlease use one of these:\n\n${getLanguagesCodesWithNames(supportedLanguages).join("\n")}`,
    );
  });

  it("It's throwing an error if name of translation is not provided", async () => {
    await expect(
      translateController(text, sourceLanguage, undefined, {
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

    await translateController(text, sourceLanguage, nameOfTranslation, {
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

    await translateController(text, sourceLanguage, "nested.helloWorld", {
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

    await translateController(
      text,
      sourceLanguage,
      "nested.deeply.object.to.test.helloWorld",
      { settingsFile: "test-configs/test-config.json" },
    );

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

    await translateController(text, sourceLanguage, nameOfTranslation, {
      settingsFile: "test-configs/test-config.json",
    });

    expect(
      fs.existsSync(
        `${testConfig.basePath}/${testConfig.languages[0].files[0]}`,
      ),
    ).toBe(true);

    await translateController(text, sourceLanguage, "helloWorld2", {
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

    await translateController(text, sourceLanguage, nameOfTranslation, {
      settingsFile: "test-configs/test-config.json",
    });

    expect(
      fs.existsSync(
        `${testConfig.basePath}/${testConfig.languages[0].files[0]}`,
      ),
    ).toBe(true);

    await translateController(text, sourceLanguage, "nested.helloWorld", {
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

    await getOrCreateJsonFile(
      "test-configs",
      "test-config-without-name.json",
      testConfig,
    );

    fs.writeFileSync(
      "test-configs/test-config-without-name.json",
      JSON.stringify(testConfig, null, 2),
    );

    await expect(
      translateController(text, sourceLanguage, nameOfTranslation, {
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

    await getOrCreateJsonFile(
      "test-configs",
      "test-config-without-files.json",
      testConfig,
    );

    fs.writeFileSync(
      "test-configs/test-config-without-files.json",
      JSON.stringify(testConfig, null, 2),
    );

    await expect(
      translateController(text, sourceLanguage, nameOfTranslation, {
        settingsFile: "test-configs/test-config-without-files.json",
      }),
    ).rejects.toThrow(
      `No files found for language ${testConfig.languages[0].name} on index 0`,
    );
  });

  it("It's throwing an error if files empties are provided on files array", async () => {
    const testConfig = {
      basePath: "test-configs/translations",
      languages: [
        {
          name: "en",
          files: [""],
        },
      ],
    };

    await getOrCreateJsonFile(
      "test-configs",
      "test-config-with-empty-files.json",
      testConfig,
    );

    fs.writeFileSync(
      "test-configs/test-config-with-empty-files.json",
      JSON.stringify(testConfig, null, 2),
    );

    await expect(
      translateController(text, sourceLanguage, nameOfTranslation, {
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

    await getOrCreateJsonFile("test-configs", "test-config.json", testConfig);

    fs.writeFileSync(
      "test-configs/test-config.json",
      JSON.stringify(testConfig, null, 2),
    );

    const { file } = await getOrCreateJsonFile(
      testConfig.basePath,
      testConfig.languages[0].files[0],
    );

    file[nameOfTranslation] = text;

    fs.writeFileSync(
      `${testConfig.basePath}/${testConfig.languages[0].files[0]}`,
      JSON.stringify(file, null, 2),
    );

    await translateController(text, sourceLanguage, nameOfTranslation, {
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

    await getOrCreateJsonFile("test-configs", "test-config.json", testConfig);

    fs.writeFileSync(
      "test-configs/test-config.json",
      JSON.stringify(testConfig, null, 2),
    );

    const { file } = await getOrCreateJsonFile(
      testConfig.basePath,
      testConfig.languages[0].files[0],
    );

    file[nameOfTranslation] = text;

    fs.writeFileSync(
      `${testConfig.basePath}/${testConfig.languages[0].files[0]}`,
      JSON.stringify(file, null, 2),
    );

    prompt.mockImplementationOnce(() => "no");

    await translateController(text, sourceLanguage, nameOfTranslation, {
      settingsFile: "test-configs/test-config.json",
    });

    const { file: esFile } = await getOrCreateJsonFile(
      testConfig.basePath,
      testConfig.languages[0].files[0],
    );
    const { file: esMxFile } = await getOrCreateJsonFile(
      testConfig.basePath,
      testConfig.languages[0].files[1],
    );
    const { file: esEsFile } = await getOrCreateJsonFile(
      testConfig.basePath,
      testConfig.languages[0].files[2],
    );

    expect(esFile[nameOfTranslation]).toBe(text);
    expect(esMxFile[nameOfTranslation]).toBe(
      `${text} translated from ${sourceLanguage} to ${testConfig.languages[0].name}`,
    );
    expect(esEsFile[nameOfTranslation]).toBe(
      `${text} translated from ${sourceLanguage} to ${testConfig.languages[0].name}`,
    );

    expect(prompt).toHaveBeenCalledTimes(1);
  });
});
