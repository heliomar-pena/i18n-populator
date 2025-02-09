/**
 * Utility functions for prompting the user for input and confirmation
 * @module promptUtils
 */
import { confirm, input, select } from "@inquirer/prompts";

/**
 * Get an array of commands to autocomplete the user prompt input
 * @param {string[]} commands - Array of commands to auto complete
 * @returns {function(string): string[]} a function that receives a string and returns an array of commands that start with that string
 */
const autoComplete: (commands?: string[]) => (str?: string) => string[] = (
  commands = []
) => {
  return (str) => commands.filter((command) => command.indexOf(str) === 0);
};

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
  const userAnswer = await input({ message })

  return userAnswer;
};

const promptUserOptions = async (message, choices) => {
  const userAnswer = await select({
    message,
    choices
  })

  return userAnswer;
}

export { autoComplete, confirmUserAction, promptUserInput, promptUserOptions };
