/**
 * Utility functions for prompting the user for input and confirmation
 * @module promptUtils
 */
import { AutocompleteBehavior } from "prompt-sync-plus";
import prompt from "./promptUser.js";

/**
 * Get an array of commands to autocomplete the user prompt input
 * @param {string[]} commands - Array of commands to auto complete
 * @returns {function(string): string[]} a function that receives a string and returns an array of commands that start with that string
 */
const autoComplete = (commands = []) => {
  return (str) => commands.filter((command) => command.indexOf(str) === 0);
};

/**
 * Prompts the user for confirmation of an action
 * @param {string} message - The message to display to the user
 * @returns {boolean} true if the user confirms the action, false otherwise
 */
const confirmUserAction = (message) => {
  const userAnswer = prompt(message, "no", {
    autocomplete: autoComplete(["y", "n", "yes", "no"]),
  });

  const userConfirmed = ["y", "yes"].includes(userAnswer?.toLowerCase());

  return userConfirmed;
};

const promptUserInput = (message, autocomplete = []) => {
  return prompt(message, {
    autocomplete: {
      searchFn: autoComplete(autocomplete),
      behavior: AutocompleteBehavior.HYBRID,
      suggestColCount: 3,
      fill: true,
      sticky: true,
    },
  });
};

export { autoComplete, confirmUserAction, promptUserInput };
