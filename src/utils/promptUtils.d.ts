import { Separator } from "@inquirer/prompts";

export type ConfirmUserAction = (message: string) => Promise<boolean>;

export type PromptUserInput = (message: string) => Promise<string>;

export type PromptUserOptions = (
  message: string,
  choices: readonly (string | Separator)[],
) => Promise<string>;
