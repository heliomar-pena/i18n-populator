import { jest } from "@jest/globals";

jest.mock("@vitalets/google-translate-api", () => ({
  translate: jest.fn((text, { from, to }) => ({
    text: `${text} translated from ${from} to ${to}`,
  })),
}));

jest.mock("fs", () => ({
  existsSync: jest.fn(() => false),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  rmSync: jest.fn(),
  readFile: jest.fn(() => ({})),
  readdir: jest.fn(() => ({})),
}));

jest.mock("bing-translate-api", () => ({
  MET: {
    translate: jest.fn((text, from, to) => ([{
      translations: [{ text: `${text} translated from ${from} to ${to} using bing` },]
    }])),
  }
}));

jest.mock("./src/services/libreTranslate", () => ({
  translate: jest.fn((text, { from, to }) => ({
    text: `${text} translated from ${from} to ${to} using libreTranslate`,
  })),
}));

jest.mock("./src/types/settings.d", () => ({
  Engines: {
    GOOGLE: "google",
    BING: "bing",
    LIBRE_TRANSLATE: "libreTranslate",
  },
  SortOrder: {
    ASC: "A-Z",
    DESC: "Z-A",
    NONE: "none",
  },
}));

jest.mock("prompt-sync-plus/dist/index.d", () => ({
  AutocompleteBehavior: {
    CYCLE: "cycle",
    HYBRID: "hybrid",
    SUGGEST: "suggest",
  },
  Key: {
    TAB: 9,
  },
}));

jest.mock("@inquirer/prompts", () => ({
  confirm: jest.fn(() => true),
  input: jest.fn(() => ""),
  select: jest.fn(() => ""),
}));
