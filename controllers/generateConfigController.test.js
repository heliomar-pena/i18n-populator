const { confirmUserAction, promptUserInput } = require("../utils/promptUtils");
const { validEngines } = require("../utils/translationEnginesUtils");
const { _promptBasePath, _promptLanguages, _promptTranslationEngines, generateConfigController } = require("./generateConfigController");
const { listFilesOnDirectory } = require("../utils/listFiles");
const { parsePath } = require("../utils/getConfigPath");
const fs = require("fs");

jest.mock("../utils/promptUtils", () => ({
  confirmUserAction: jest.fn(() => true),
  promptUserInput: jest.fn(),
}));

jest.mock("../utils/listFiles", () => ({
  listFilesOnDirectory: jest.fn(async () => Promise.resolve([])),
}))

const mockPromptBasePath = ({ basePath, pathFiles }) => {
  promptUserInput
    .mockReturnValueOnce(basePath);
  
  confirmUserAction
    .mockReturnValueOnce(true);

  listFilesOnDirectory.mockResolvedValueOnce(pathFiles);
}

const mockPromptLanguages = (languages = []) => {
  promptUserInput
    .mockReturnValueOnce("");

  for (const language of languages) {
    promptUserInput
      .mockReturnValueOnce(language);
  }
}

const mockPromptTranslationEngines = (engines = []) => {
  const enginesToPrompt = [...validEngines];

  for (const engine of enginesToPrompt) {
    confirmUserAction 
      .mockReturnValueOnce(engines.includes(engine));
  }
}

describe("_promptTranslationEngines", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it("should return an array of translation engines to use", () => {
    const enginesToUse = ["google", "libreTranslate"];
    mockPromptTranslationEngines(enginesToUse)

    const result = _promptTranslationEngines(validEngines);

    expect(confirmUserAction).toHaveBeenCalledTimes(3);

    for (validEngine of validEngines) {
      expect(confirmUserAction).toHaveBeenCalledWith(
        `Do you want to use ${validEngine} as translation engine? (y/n): `
      );
    }

    expect(result).toEqual(enginesToUse);
  });

  it("should return an empty array if all translation engines are rejected", () => {
    const expectedEnginesToUse = [];
    mockPromptTranslationEngines(expectedEnginesToUse);

    const result = _promptTranslationEngines(validEngines);

    expect(confirmUserAction).toHaveBeenCalledTimes(3);

    for (validEngine of validEngines) {
      expect(confirmUserAction).toHaveBeenCalledWith(
        `Do you want to use ${validEngine} as translation engine? (y/n): `
      );
    }

    expect(result).toEqual(expectedEnginesToUse);
  });
});

describe("_promptBasePath", () => {
  let pathFiles = [];
  beforeEach(() => {
    jest.clearAllMocks();
    pathFiles = ["ec.json", "cl.json"];
  });

  it("should return the base path and path files when confirmed", async () => {
    const basePath = "test-configs/translations";

    mockPromptBasePath({ basePath, pathFiles })

    const result = await _promptBasePath();

    expect(promptUserInput).toHaveBeenCalledTimes(2);
    expect(promptUserInput).toHaveBeenCalledWith(
      'Base path for the translations files: b.e "src/localizations.": '
      );
    expect(confirmUserAction).toHaveBeenCalledTimes(1);

    expect(listFilesOnDirectory).toHaveBeenCalledTimes(1);
    expect(listFilesOnDirectory).toHaveBeenCalledWith(parsePath(basePath));

    expect(result).toEqual({ basePath, pathFiles });
  });

  it("should continue prompting if base path is not provided", async () => {
    promptUserInput.mockReturnValueOnce("");
    
    mockPromptBasePath({ basePath: "test-configs/translations", pathFiles })

    const result = await _promptBasePath();

    expect(promptUserInput).toHaveBeenCalledTimes(3);
    expect(promptUserInput).toHaveBeenCalledWith(
      'Base path for the translations files: b.e "src/localizations.": '
    );
    expect(promptUserInput).toHaveBeenCalledWith(
      '\nPress enter to continue...'
    );

    expect(listFilesOnDirectory).toHaveBeenCalledTimes(1);

    expect(result).toEqual({ basePath: "test-configs/translations", pathFiles });
  });

  it("should continue prompting if files in path are empty", async () => {
    const basePath = "src/localizations";

    mockPromptBasePath({ basePath, pathFiles: [] })

    promptUserInput
      .mockReturnValueOnce("n"); // Are you sure you want to use this path?

    const result = await _promptBasePath();

    expect(promptUserInput).toHaveBeenCalledTimes(2);
    expect(promptUserInput).toHaveBeenCalledWith(
      'Base path for the translations files: b.e "src/localizations.": '
    );

    expect(listFilesOnDirectory).toHaveBeenCalledTimes(1);
    expect(listFilesOnDirectory).toHaveBeenCalledWith(parsePath(basePath));

    expect(result).toEqual({ basePath, pathFiles: [] });
  });

  it("should continue prompting if user does not confirm the path", async () => {
    const basePath = "src/localizations";

    promptUserInput
      .mockReturnValueOnce(basePath)
      .mockReturnValueOnce(basePath); // Please insert the path you want to use

    confirmUserAction
      .mockReturnValueOnce(false)
      .mockResolvedValueOnce(false); // Please confirm that the path that you want to use is: ...
    
    listFilesOnDirectory
      .mockResolvedValueOnce(pathFiles)
      .mockResolvedValueOnce(pathFiles); // List files on directory is always returned well
      
    mockPromptBasePath({ basePath, pathFiles });

    const result = await _promptBasePath();

    expect(promptUserInput).toHaveBeenCalledTimes(3);
    expect(promptUserInput).toHaveBeenCalledWith(
      'Base path for the translations files: b.e "src/localizations.": '
    );

    expect(listFilesOnDirectory).toHaveBeenCalledTimes(2);
    expect(listFilesOnDirectory).toHaveBeenCalledWith(parsePath(basePath));

    expect(result).toEqual({ basePath, pathFiles });
  });
});

describe("_promptLanguages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should prompt for language names and return an array of languages", () => {
    const filesNames = ["english-file.json", "spanish-file.json"];
    const languages = ["en", "es"]

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
    expect(result).toEqual([
      { name: "fr", files: ["french-file.json"] },
    ]);
  });

  it("should skip file if user don't input any language name", () => {
    const filesNames = ["english-file.json", "spanish-file.json"];
    const languages = ["", "es"]

    mockPromptLanguages(languages);

    const result = _promptLanguages(filesNames);

    expect(promptUserInput).toHaveBeenCalledTimes(4);
    expect(result).toEqual([
      { name: "es", files: ["spanish-file.json"] },
    ]);
  })

  it("should repeat prompt if user input an invalid language name", () => {
    const filesNames = ["english-file.json", "spanish-file.json"];
    const languages = ["invalid", "", "en", "es"]

    mockPromptLanguages(languages);

    const result = _promptLanguages(filesNames);

    expect(promptUserInput).toHaveBeenCalledTimes(6);
    expect(result).toEqual([
      { name: "en", files: ["english-file.json"] },
      { name: "es", files: ["spanish-file.json"] },
    ]);
  })
});

