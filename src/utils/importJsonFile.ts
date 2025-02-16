import fs from "fs";

const importJsonFile = <ReturnType>(
  parsedFilePath: string,
): Promise<ReturnType> => {
  return new Promise((resolve, reject) => {
    fs.readFile(parsedFilePath, "utf8", (err, data) => {
      try {
        if (err) throw err;

        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
};

export { importJsonFile };
