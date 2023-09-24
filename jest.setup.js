jest.mock('@vitalets/google-translate-api', () => ({
  translate: jest.fn((text, {from, to}) => ({ text: `${text} translated from ${from} to ${to}` })),
}));

jest.mock(
  'prompt-sync',
  () => {
    const mPrompt = jest.fn(() => 'yes');
    return jest.fn(() => mPrompt);
  },
  { virtual: true },
);
