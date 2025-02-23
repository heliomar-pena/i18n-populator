import { homepage, bugs } from "../package.json";

const remoteURL = homepage.split("#")[0];
const remoteProdBranch = "master";

const links = {
  remoteURL,
  allLanguagesRemoteFile: `${remoteURL}/blob/${remoteProdBranch}/src/ALL-LANGUAGES-CODES.json`,
  Iso639Info: "https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes",
  createNewIssue: bugs.url,
};

const config = {
  defaultConfigPath: "i18n-populator.config.json",
  links,
};

export default config;
