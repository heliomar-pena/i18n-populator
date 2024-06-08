import { confirmUserAction, promptUserInput } from '../utils/promptUtils';
import { validEngines } from '../utils/translationEnginesUtils';

import {
  _promptBasePath,
  _promptLanguages,
  _promptTranslationEngines,
  generateConfigController,
} from './generateConfigController';

import { listFilesOnDirectory } from '../utils/listFiles';
import { parsePath } from '../utils/getConfigPath';
import fs from 'fs';

jest.mock("../utils/promptUtils", () => ({
  confirmUserAction: jest.fn(() => true),
  promptUserInput: jest.fn(),
}));

jest.mock("../utils/listFiles", () => ({
  listFilesOnDirectory: jest.fn(async () => Promise.resolve([])),
}));

jest.mock("fs", () => ({
  existsSync: jest.fn(() => false),
  writeFileSync: jest.fn(),
}));

const mockPromptBasePath = ({ basePath, pathFiles }) => {
  promptUserInput.mockReturnValueOnce(basePath);

  confirmUserAction.mockReturnValueOnce(true);

  listFilesOnDirectory.mockResolvedValueOnce(pathFiles);
};

const mockPromptLanguages = (languages = []) => {
  promptUserInput.mockReturnValueOnce("");

  for (const language of languages) {
    promptUserInput.mockReturnValueOnce(language);
  }
};

const mockPromptTranslationEngines = (engines = []) => {
  const enginesToPrompt = [...validEngines];

  for (const engine of enginesToPrompt) {
    confirmUserAction.mockReturnValueOnce(engines.includes(engine));
  }
};

describe("_promptTranslationEngines", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should return an array of translation engines to use", () => {
    const enginesToUse = ["google", "libreTranslate"];
    mockPromptTranslationEngines(enginesToUse);

    const result = _promptTranslationEngines(validEngines);

    expect(confirmUserAction).toHaveBeenCalledTimes(3);

    for (const validEngine of validEngines) {
      expect(confirmUserAction).toHaveBeenCalledWith(
        `Do you want to use ${validEngine} as translation engine? (y/n): `,
      );
    }

    expect(result).toEqual(enginesToUse);
  });

  it("should return an empty array if all translation engines are rejected", () => {
    const expectedEnginesToUse = [];
    mockPromptTranslationEngines(expectedEnginesToUse);

    const result = _promptTranslationEngines(validEngines);

    expect(confirmUserAction).toHaveBeenCalledTimes(3);

    for (const validEngine of validEngines) {
      expect(confirmUserAction).toHaveBeenCalledWith(
        `Do you want to use ${validEngine} as translation engine? (y/n): `,
      );
    }

    expect(result).toEqual(expectedEnginesToUse);
  });
});

describe("_promptBasePath", () => {
  let pathFiles = [];
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    pathFiles = ["ec.json", "cl.json"];
  });

  it("should return the base path and path files when confirmed", async () => {
    const basePath = "test-configs/translations";

    mockPromptBasePath({ basePath, pathFiles });

    const result = await _promptBasePath();

    expect(promptUserInput).toHaveBeenCalledTimes(2);
    expect(promptUserInput).toHaveBeenCalledWith(
      'Base path for the translations files: e.g. "src/localizations": ',
    );
    expect(confirmUserAction).toHaveBeenCalledTimes(1);

    expect(listFilesOnDirectory).toHaveBeenCalledTimes(1);
    expect(listFilesOnDirectory).toHaveBeenCalledWith(parsePath(basePath));

    expect(result).toEqual({ basePath, pathFiles });
  });

  it("should continue prompting if base path is not provided", async () => {
    promptUserInput.mockReturnValueOnce("");

    mockPromptBasePath({ basePath: "test-configs/translations", pathFiles });

    const result = await _promptBasePath();

    expect(promptUserInput).toHaveBeenCalledTimes(3);
    expect(promptUserInput).toHaveBeenCalledWith(
      'Base path for the translations files: e.g. "src/localizations": ',
    );
    expect(promptUserInput).toHaveBeenCalledWith(
      "\nPress enter to continue...",
    );

    expect(listFilesOnDirectory).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      basePath: "test-configs/translations",
      pathFiles,
    });
  });

  it("should continue prompting if files in path are empty", async () => {
    const basePath = "src/localizations";

    promptUserInput.mockReturnValueOnce(basePath);

    confirmUserAction.mockReturnValueOnce(false); // Path is empty. Are you sure you want to use this path?

    listFilesOnDirectory.mockResolvedValueOnce([]);

    mockPromptBasePath({ basePath, pathFiles });

    const result = await _promptBasePath();

    expect(promptUserInput).toHaveBeenCalledTimes(3);
    expect(promptUserInput).toHaveBeenCalledWith(
      'Base path for the translations files: e.g. "src/localizations": ',
    );

    expect(listFilesOnDirectory).toHaveBeenCalledTimes(2);
    expect(listFilesOnDirectory).toHaveBeenCalledWith(parsePath(basePath));

    expect(result).toEqual({ basePath, pathFiles });
  });

  it("should continue prompting if user does not confirm the path", async () => {
    const basePath = "src/localizations";

    promptUserInput.mockReturnValueOnce(basePath).mockReturnValueOnce(basePath); // Please insert the path you want to use

    confirmUserAction.mockReturnValueOnce(false).mockReturnValueOnce(false); // Please confirm that the path that you want to use is: ...

    listFilesOnDirectory
      .mockResolvedValueOnce(pathFiles)
      .mockResolvedValueOnce(pathFiles); // List files on directory is always returned well

    mockPromptBasePath({ basePath, pathFiles });

    const result = await _promptBasePath();

    expect(promptUserInput).toHaveBeenCalledTimes(4);
    expect(promptUserInput).toHaveBeenCalledWith(
      'Base path for the translations files: e.g. "src/localizations": ',
    );

    expect(listFilesOnDirectory).toHaveBeenCalledTimes(3);
    expect(listFilesOnDirectory).toHaveBeenCalledWith(parsePath(basePath));

    expect(result).toEqual({ basePath, pathFiles });
  });
});

describe("_promptLanguages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should prompt for language names and return an array of languages", () => {
    const filesNames = ["english-file.json", "spanish-file.json"];
    const languages = ["en", "es"];

    mockPromptLanguages(languages);

    const result = _promptLanguages(filesNames);

    expect(promptUserInput).toHaveBeenCalledTimes(4);
    expect(result).toEqual([
      { name: "en", files: ["english-file.json"] },
      { name: "es", files: ["spanish-file.json"] },
    ]);
  });

  it("should skip files that are not JSON files", () => {
    const filesNames = ["french-file.json", "README-file.txt"];
    mockPromptLanguages(["fr"]);

    const result = _promptLanguages(filesNames);

    expect(promptUserInput).toHaveBeenCalledTimes(3);
    expect(result).toEqual([{ name: "fr", files: ["french-file.json"] }]);
  });

  it("should skip file if user don't input any language name", () => {
    const filesNames = ["english-file.json", "spanish-file.json"];
    const languages = ["", "es"];

    mockPromptLanguages(languages);

    const result = _promptLanguages(filesNames);

    expect(promptUserInput).toHaveBeenCalledTimes(4);
    expect(result).toEqual([{ name: "es", files: ["spanish-file.json"] }]);
  });

  it("should repeat prompt if user input an invalid language name", () => {
    const filesNames = ["english-file.json", "spanish-file.json"];
    const languages = ["invalid", "", "en", "es"];

    mockPromptLanguages(languages);

    const result = _promptLanguages(filesNames);

    expect(promptUserInput).toHaveBeenCalledTimes(6);
    expect(result).toEqual([
      { name: "en", files: ["english-file.json"] },
      { name: "es", files: ["spanish-file.json"] },
    ]);
  });
});

describe("generateConfigController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`Process.exit(${code})`); // Forces the code to throw instead of exit
    });
  });

  it("should overwrite the configuration file if it already exists and user confirms", async () => {
    const configPath = parsePath("/i18n-populator.config.json");
    const basePath = "test-configs/translations";
    const pathFiles = ["english-file.json", "spanish-file.json"];

    fs.existsSync.mockReturnValueOnce(true);

    confirmUserAction.mockReturnValueOnce(true);

    mockPromptBasePath({ basePath, pathFiles });
    promptUserInput.mockReturnValueOnce("");
    mockPromptLanguages(["en", "es"]);
    mockPromptTranslationEngines(["google", "bing"]);

    await generateConfigController();

    expect(confirmUserAction).toHaveBeenCalledWith(
      `The configuration file already exists. Do you want to overwrite it? (y/n): `,
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      configPath,
      JSON.stringify(
        {
          basePath,
          translationEngines: ["google", "bing"],
          languages: [
            { name: "en", files: ["english-file.json"] },
            { name: "es", files: ["spanish-file.json"] },
          ],
        },
        null,
        2,
      ),
    );
  });

  it("should cancel the wizard if the configuration file already exists and user does not confirm", async () => {
    const configPath = parsePath("/i18n-populator.config.json");

    fs.existsSync.mockReturnValueOnce(true);
    confirmUserAction.mockReturnValueOnce(false);

    try {
      await generateConfigController();

      expect(true).toBe(false); // If the code reaches this point, the test should fail since process is not exited
    } catch (err) {
      expect(err.message).toBe("Process.exit(0)");
      expect(process.exit).toHaveBeenCalledTimes(1);
      expect(process.exit).toHaveBeenCalledWith(0);
      expect(fs.existsSync).toHaveBeenCalledTimes(1);
      expect(fs.existsSync).toHaveBeenCalledWith(configPath);
      expect(confirmUserAction).toHaveBeenCalledTimes(1);
      expect(confirmUserAction).toHaveBeenCalledWith(
        `The configuration file already exists. Do you want to overwrite it? (y/n): `,
      );
    }
  });

  it("should create a new configuration file if it does not exist", async () => {
    const configPath = parsePath("/i18n-populator.config.json");
    const userSelectedBasePath = "test-configs/translations";
    const filesNames = ["english.json", "spanish.json"];

    fs.existsSync.mockReturnValueOnce(false);

    mockPromptBasePath({
      basePath: userSelectedBasePath,
      pathFiles: filesNames,
    });

    promptUserInput.mockReturnValueOnce("");

    mockPromptLanguages(["en", "es"]);

    mockPromptTranslationEngines(["google", "bing"]);

    await generateConfigController();

    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(fs.existsSync).toHaveBeenCalledWith(configPath);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      configPath,
      JSON.stringify(
        {
          basePath: userSelectedBasePath,
          translationEngines: ["google", "bing"],
          languages: [
            { name: "en", files: ["english.json"] },
            { name: "es", files: ["spanish.json"] },
          ],
        },
        null,
        2,
      ),
    );
  });
});
