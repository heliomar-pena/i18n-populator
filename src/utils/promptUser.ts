/**
 * This file is created in order to be able to easily mock prompt-sync-plus in tests
 * @module promptUser
 **/

import promptFactory, { AutocompleteBehavior, Key } from "prompt-sync-plus";

const prompt = promptFactory({
  sigint: true,
  autocomplete: {
    behavior: AutocompleteBehavior.CYCLE,
    fill: false,
    searchFn: function (query: string): string[] {
      return [];
    },
    sticky: false,
    suggestColCount: 0,
    triggerKey: Key.SIGINT,
  },
  echo: "",
  eot: false,
  defaultResponse: "",
});

export default prompt;
