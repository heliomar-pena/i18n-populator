import { Engines } from "../types/settings";

export type TranslateController = {
  text: string;
  from: string;
  name: string;
  settingsFile?: string;
  engine?: Engines;
};
