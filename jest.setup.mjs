jest.mock("@vitalets/google-translate-api", () => ({
  translate: jest.fn((text, { from, to }) => ({
    text: `${text} translated from ${from} to ${to}`,
  })),
}));

jest.mock(
  "prompt-sync",
  () => {
    const mPrompt = jest.fn(() => "yes");
    return jest.fn(() => mPrompt);
  },
  { virtual: true },
);

jest.mock("bing-translate-api", () => ({
  translate: jest.fn((text, from, to) => ({
    translation: `${text} translated from ${from} to ${to} using bing`,
  })),
}));

jest.mock("./services/libreTranslate", () => ({
  translate: jest.fn((text, { from, to }) => ({
    text: `${text} translated from ${from} to ${to} using libreTranslate`,
  })),
}));
