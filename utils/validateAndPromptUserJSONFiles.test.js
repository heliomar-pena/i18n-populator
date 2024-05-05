const { validateAndPromptUserJSONFiles } = require('../utils/validateAndPromptUserJSONFiles');
const { getOrCreateJsonFile } = require('../utils/getOrCreateJsonFile');
const { parsePath } = require('./getConfigPath');
const prompt = require("prompt-sync")();
const fs = require('fs');

describe('validateAndPromptUserJSONFiles', () => {
    let filesMock, filesName, basePath, nameOfTranslation;
    beforeEach(() => {
       jest.clearAllMocks();
       jest.resetModules();

       filesMock = {
            'withTest.json': {
               test: 'Test translation',
            },
            'withHelloWorld.json': {
                helloWorld: 'Hello World',
            }
        }
        filesName = Object.keys(filesMock);

        basePath = 'test-configs/translations';

        nameOfTranslation = 'test';

        // Creating files
        filesName.forEach((fileName) => {
            let { file, parsedPath } = getOrCreateJsonFile(basePath, fileName);
            file = filesMock[fileName];

            fs.writeFileSync(parsedPath, JSON.stringify(file, null, 2));
        });
    })

    afterEach(() => {
        if (fs.existsSync('test-configs')) {
            fs.rmSync('test-configs', { recursive: true });
        }
    })

    it("should not include the json files that already have the property if the user doesn't confirm it", () => {
        prompt.mockImplementationOnce(() => 'no');

        const filesToEdit = validateAndPromptUserJSONFiles(basePath, filesName, nameOfTranslation);
        const fileName = filesName.find((fileName) => filesMock[fileName][nameOfTranslation] === undefined);
        const expectedParsedPath = parsePath(`${basePath}/${fileName}`);

        expect(prompt).toHaveBeenCalledTimes(1);
        expect(filesToEdit).toEqual([{ file: filesMock[fileName], parsedPath: expectedParsedPath }]); 
    });
    
    it('should include the json files that already have the property if the user confirm it', () => {
        prompt.mockImplementationOnce(() => 'yes');

        const filesToEdit = validateAndPromptUserJSONFiles(basePath, filesName, nameOfTranslation);
        const expectedFiles = filesName.map((fileName) => ({ file: filesMock[fileName], parsedPath: parsePath(`${basePath}/${fileName}`) }));

        console.log({ filesToEdit, expectedFiles, prompt })

        expect(prompt).toHaveBeenCalledTimes(1);
        expect(filesToEdit).toEqual(expectedFiles); 
    });

    it("should return an empty array if all the files already have the property and the user doesn't want overwrite them", () => {
        prompt.mockImplementationOnce(() => 'no');

        const filesToEdit = validateAndPromptUserJSONFiles(basePath, [filesName[0]], nameOfTranslation);

        expect(prompt).toHaveBeenCalledTimes(1);
        expect(filesToEdit).toEqual([]); 
    });
});
