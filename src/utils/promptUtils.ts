/**
 * Utility functions for prompting the user for input and confirmation
 * @module promptUtils
 */
import { confirm, input, select } from "@inquirer/prompts";
import { PromptUserOptions } from "./promptUtils.d";

/**
 * Prompts the user for confirmation of an action
 * @param {string} message - The message to display to the user
 * @returns {boolean} true if the user confirms the action, false otherwise
 */
const confirmUserAction = async (message) => {
  const userAnswer = await confirm({ message, default: false });

  return userAnswer;
};

const promptUserInput = async (message) => {
  const userAnswer = await input({ message });

  return userAnswer;
};

const promptUserOptions: PromptUserOptions = async (message, choices) => {
  const userAnswer = await select<string>({
    message,
    choices,
  });

  return userAnswer;
};

export { confirmUserAction, promptUserInput, promptUserOptions };
