/** 
 * This file is created in order to be able to easily mock prompt-sync-plus in tests
 * @module promptUser
 **/

import promptFactory from 'prompt-sync-plus';

const prompt = promptFactory({
  sigint: true,
});

export default prompt;
