import { jest } from "@jest/globals";

jest.mock("@vitalets/google-translate-api", () => ({
  translate: jest.fn((text, { from, to }) => ({
    text: `${text} translated from ${from} to ${to}`,
  })),
}));

jest.mock("./src/utils/promptUser", () => jest.fn(() => "yes"));

jest.mock("fs", () => ({
  existsSync: jest.fn(() => false),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  rmSync: jest.fn(),
}));

jest.mock("bing-translate-api", () => ({
  translate: jest.fn((text, from, to) => ({
    translation: `${text} translated from ${from} to ${to} using bing`,
  })),
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
