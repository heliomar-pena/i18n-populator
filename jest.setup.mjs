import { jest } from "@jest/globals";

jest.unstable_mockModule("@vitalets/google-translate-api", () => ({
  translate: jest.fn((text, { from, to }) => ({
    text: `${text} translated from ${from} to ${to}`,
  })),
}));

jest.unstable_mockModule("./utils/promptUser.js", () => {
  return { default: jest.fn(() => "yes") };
});

jest.unstable_mockModule("bing-translate-api", () => ({
  translate: jest.fn((text, from, to) => ({
    translation: `${text} translated from ${from} to ${to} using bing`,
  })),
}));

jest.unstable_mockModule("./services/libreTranslate", () => ({
  translate: jest.fn((text, { from, to }) => ({
    text: `${text} translated from ${from} to ${to} using libreTranslate`,
  })),
}));
