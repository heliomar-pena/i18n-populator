const fs = require('fs');

/**
 * Retrieves a list of files in the specified directory.
 * @param {string} directory - The directory path.
 * @returns {Promise<string[]>} - A promise that resolves to an array of file names in the directory.
 */
const listFilesOnDirectory = (directory) => {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(files);
        });
    });
};

module.exports = { listFilesOnDirectory }