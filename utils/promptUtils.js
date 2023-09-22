/**
 * Get an array of commands to autocomplete the user prompt input
 * @param {string[]} commands - Array of commands to auto complete
 * @returns {function(string): string[]} a function that receives a string and returns an array of commands that start with that string
 */
const autoComplete = (commands = []) => {
  return (str) => {
    var results = [];
    
    commands.forEach((command) => {
      if (command.indexOf(str) == 0)
        results.push(command);
    });

    return results;
  };
};

module.exports = { autoComplete };
