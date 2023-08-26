const { translate } = require('@vitalets/google-translate-api');
const { translateController } = require('./translateController');
const { configPath, config } = require('../utils/getConfigPath');
const { getOrCreateJsonFile } = require('../utils/getOrCreateJsonFile');
const fs = require('fs');

describe("TranslateController", () => {
    let text, sourceLanguage, nameOfTranslation;
    beforeEach(() => {
        jest.clearAllMocks();
        text = 'Hello World';
        sourceLanguage = 'en';
        nameOfTranslation = 'helloWorld';
    })
    
    afterEach(() => {
        if (fs.existsSync('test-configs')) {
            fs.rmSync('test-configs', { recursive: true });
        }
    })

    it("It's calling translate function for each language on config path", async () => {
        const { languages } = config;

        await translateController(text, sourceLanguage, nameOfTranslation, { settingsFile: configPath });

        expect(translate).toHaveBeenCalledTimes(languages.length);
    });

    it("It's throwing an error if no config file is found", async () => {
        await expect(translateController(text, sourceLanguage, nameOfTranslation, { settingsFile: 'non-existent-file' })).rejects.toThrow("No settings file found");
    });

    it("It's handling properly custom config files", async () => {
        const customConfig = {
            basePath: "test-configs/translations",
            languages: [
                {
                    name: 'en',
                    files: [
                        "en.json",
                    ]
                }
            ]
        };

        getOrCreateJsonFile('test-configs', 'custom-config.json', customConfig)

        fs.writeFileSync('test-configs/custom-config.json', JSON.stringify(customConfig, null, 2));

        await translateController(text, sourceLanguage, nameOfTranslation, { settingsFile: 'test-configs/custom-config.json' });

        expect(translate).toHaveBeenCalledTimes(1); 
    });

    it("It's throwing an error if no languages are found on config file", async () => {
        const noLanguagesConfig = {
            basePath: "test-configs/translations",
        };

        getOrCreateJsonFile('test-configs', 'no-languages.json', noLanguagesConfig)

        fs.writeFileSync('test-configs/no-languages.json', JSON.stringify(noLanguagesConfig, null, 2));

        await expect(translateController(text, sourceLanguage, nameOfTranslation, { settingsFile: 'test-configs/no-languages.json' })).rejects.toThrow("No languages or basePath found, please check your settings file");
    })

    it("It's throwing an error if text is not provided", async () => {
        await expect(translateController(undefined, sourceLanguage, nameOfTranslation, { settingsFile: configPath })).rejects.toThrow("No text to translate provided");
    });

    it("It's throwing an error if source language is not provided", async () => {
        await expect(translateController(text, undefined, nameOfTranslation, { settingsFile: configPath })).rejects.toThrow("No source language provided");
    });

    it("It's throwing an error if name of translation is not provided", async () => {
        await expect(translateController(text, sourceLanguage, undefined, { settingsFile: configPath })).rejects.toThrow("No name of translation provided"); 
    });

    it("It's creating properly the files with the translation result", async () => {
        const testConfig = {
            basePath: 'test-configs/translations',
            languages: [
                {
                    name: 'en',
                    files: [
                        'en.json',
                    ]
                }
            ]
        }

        getOrCreateJsonFile('test-configs', 'test-config.json', testConfig);

        fs.writeFileSync('test-configs/test-config.json', JSON.stringify(testConfig, null, 2));

        await translateController(text, sourceLanguage, nameOfTranslation, { settingsFile: 'test-configs/test-config.json' });

        expect(fs.existsSync(`${testConfig.basePath}/${testConfig.languages[0].files[0]}`)).toBe(true);

        const { file } = getOrCreateJsonFile(testConfig.basePath, testConfig.languages[0].files[0]);

        expect(file.helloWorld).toBe(`Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`);
    });

    it.skip("It's creating properly the files with object nesting", async () => {
        const testConfig = {
            basePath: 'test-configs/translations',
            languages: [
                {
                    name: 'en',
                    files: [
                        'en.json',
                    ]
                }
            ]
        }

        getOrCreateJsonFile('test-configs', 'test-config.json', testConfig);

        fs.writeFileSync('test-configs/test-config.json', JSON.stringify(testConfig, null, 2));

        await translateController(text, sourceLanguage, 'nested.helloWorld', { settingsFile: 'test-configs/test-config.json' });

        expect(fs.existsSync(`${testConfig.basePath}/${testConfig.languages[0].files[0]}`)).toBe(true);

        const { file } = getOrCreateJsonFile(testConfig.basePath, testConfig.languages[0].files[0]);

        expect(file.nested.helloWorld).toBe(`Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`);
    })

    it.skip("It's creating properly the files with deep object nesting", async () => {
        const testConfig = {
            basePath: 'test-configs/translations',
            languages: [
                {
                    name: 'en',
                    files: [
                        'en.json',
                    ]
                }
            ]
        }

        getOrCreateJsonFile('test-configs', 'test-config.json', testConfig);

        fs.writeFileSync('test-configs/test-config.json', JSON.stringify(testConfig, null, 2));

        await translateController(text, sourceLanguage, 'nested.deeply.object.to.test.helloWorld', { settingsFile: 'test-configs/test-config.json' });

        expect(fs.existsSync(`${testConfig.basePath}/${testConfig.languages[0].files[0]}`)).toBe(true);

        const { file } = getOrCreateJsonFile(testConfig.basePath, testConfig.languages[0].files[0]);

        expect(file.nested.deeply.object.to.test.helloWorld).toBe(`Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`);
    });

    it("It's preserving old data on the files", async () => {
        const testConfig = {
            basePath: 'test-configs/translations',
            languages: [
                {
                    name: 'en',
                    files: [
                        'en.json',
                    ]
                }
            ]
        }

        getOrCreateJsonFile('test-configs', 'test-config.json', testConfig);

        fs.writeFileSync('test-configs/test-config.json', JSON.stringify(testConfig, null, 2));

        await translateController(text, sourceLanguage, nameOfTranslation, { settingsFile: 'test-configs/test-config.json' });

        expect(fs.existsSync(`${testConfig.basePath}/${testConfig.languages[0].files[0]}`)).toBe(true);

        await translateController(text, sourceLanguage, 'helloWorld2', { settingsFile: 'test-configs/test-config.json' });
        
        const { file } = getOrCreateJsonFile(testConfig.basePath, testConfig.languages[0].files[0]);

        expect(file.helloWorld).toBe(`Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`);
        expect(file.helloWorld2).toBe(`Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`);
    })

    it.skip("It's preserving old data on the files even when the name of the translation is nested", async () => {
        const testConfig = {
            basePath: 'test-configs/translations',
            languages: [
                {
                    name: 'en',
                    files: [
                        'en.json',
                    ]
                }
            ]
        }

        getOrCreateJsonFile('test-configs', 'test-config.json', testConfig);

        fs.writeFileSync('test-configs/test-config.json', JSON.stringify(testConfig, null, 2));

        await translateController(text, sourceLanguage, nameOfTranslation, { settingsFile: 'test-configs/test-config.json' });

        expect(fs.existsSync(`${testConfig.basePath}/${testConfig.languages[0].files[0]}`)).toBe(true);

        await translateController(text, sourceLanguage, 'nested.helloWorld', { settingsFile: 'test-configs/test-config.json' });

        const { file } = getOrCreateJsonFile(testConfig.basePath, testConfig.languages[0].files[0]);

        expect(file.helloWorld).toBe(`Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`);
        expect(file.nested.helloWorld).toBe(`Hello World translated from ${sourceLanguage} to ${testConfig.languages[0].name}`);
    })

    it("It's throwing an error if no name is provided for a language", async () => {
        const testConfig = {
            basePath: 'test-configs/translations',
            languages: [
                {
                    files: [
                        'en.json',
                    ]
                }
            ]
        }

        getOrCreateJsonFile('test-configs', 'test-config-without-name.json', testConfig);

        fs.writeFileSync('test-configs/test-config-without-name.json', JSON.stringify(testConfig, null, 2));

        await expect(translateController(text, sourceLanguage, nameOfTranslation, { settingsFile: 'test-configs/test-config-without-name.json' })).rejects.toThrow("No name found for language on index 0");
    })

    it("It's throwing an error if no files are provided for a language", async () => {
        const testConfig = {
            basePath: 'test-configs/translations',
            languages: [
                {
                    name: 'en',
                }
            ]
        }

        getOrCreateJsonFile('test-configs', 'test-config-without-files.json', testConfig);

        fs.writeFileSync('test-configs/test-config-without-files.json', JSON.stringify(testConfig, null, 2));

        await expect(translateController(text, sourceLanguage, nameOfTranslation, { settingsFile: 'test-configs/test-config-without-files.json' })).rejects.toThrow(`No files found for language ${testConfig.languages[0].name} on index 0`);
    })

    it("It's throwing an error if files empties are provided on files array", async () => {
        const testConfig = {
            basePath: 'test-configs/translations',
            languages: [
                {
                    name: 'en',
                    files: [
                        '',
                    ]
                }
            ]
        }

        getOrCreateJsonFile('test-configs', 'test-config-with-empty-files.json', testConfig);

        fs.writeFileSync('test-configs/test-config-with-empty-files.json', JSON.stringify(testConfig, null, 2));

        await expect(translateController(text, sourceLanguage, nameOfTranslation, { settingsFile: 'test-configs/test-config-with-empty-files.json' })).rejects.toThrow("There is an invalid language config on your settings file, please check it");
    });
});
