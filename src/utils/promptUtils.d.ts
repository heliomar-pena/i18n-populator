import { Separator } from "@inquirer/prompts";

export type PromptUserOptions = (
  message: string,
  choices: readonly (string | Separator)[],
) => Promise<string>;
