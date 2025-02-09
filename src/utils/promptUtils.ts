/**
 * Utility functions for prompting the user for input and confirmation
 * @module promptUtils
 */
import { AutocompleteBehavior, Key } from "prompt-sync-plus/dist/index.d";
import prompt from "./promptUser";

/**
 * Get an array of commands to autocomplete the user prompt input
 * @param {string[]} commands - Array of commands to auto complete
 * @returns {function(string): string[]} a function that receives a string and returns an array of commands that start with that string
 */
const autoComplete: (commands?: string[]) => (str?: string) => string[] = (commands = []) => {
  return (str) => commands.filter((command) => command.indexOf(str) === 0);
};

/**
 * Prompts the user for confirmation of an action
 * @param {string} message - The message to display to the user
 * @returns {boolean} true if the user confirms the action, false otherwise
 */
const confirmUserAction = (message) => {
  const userAnswer = prompt(message, {
    autocomplete: {
      searchFn: autoComplete(["y", "n", "yes", "no"]),
      behavior: AutocompleteBehavior.CYCLE,
      fill: false,
      sticky: false,
      suggestColCount: 0,
      triggerKey: Key.SIGINT
    },
    echo: "",
    eot: false,
    defaultResponse: "no",
    sigint: false
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
      triggerKey: Key.SIGINT
    },
    echo: "",
    eot: false,
    defaultResponse: "",
    sigint: false
  });
};

export { autoComplete, confirmUserAction, promptUserInput };
