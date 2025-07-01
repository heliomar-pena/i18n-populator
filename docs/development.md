# Development

This documentation points to help developers that wants to contribute on the project, and wants to know how to set up it locally for development.

## Requirements

It's recommended to use the version of node that is on the [.nvmrc](../.nvmrc) file, if you are using nvm would be enough if you switch to that version before installing dependencies, if you are not familiar with NVM, please check the version mentioned in the [.nvmrc](../.nvmrc) and download that from the [official NodeJS page](https://nodejs.org/en).

### NVM

```sh
nvm use && npm i
```

## Cloning

As you are not formally included as contributor on the project, you'll need to make a fork of my repository, then modify that fork and finally make a Pull Request from your forked repo to my repository to include your changes on the project.

Here is the [official github documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) that I suggest you to follow. Anyway, if you need help, just contact me via LinkedIn, my contact is in my GitHub Profile.

## Installing dependencies

To install dependencies just run:

```sh
npm i
```

after setting up the node version on your computer.

## Running the project locally

### Adding example folder and json files

If you take a look to the [config file](../i18n-populator.config.json) file that is at the root of the project, it have an example version of an config file, which makes reference to an example folder that doesn't exists on the project. You can create this folder and the files that are mentioned there, so you can run the CLI tool and you'll being creating translations that would be saved on that folder.

```sh
mkdir -p example && echo "{}" > ./example/es.json && echo "{}" > ./example/en.json && echo "{}" > ./example/pt.json && echo "{}" > ./example/ja.json
```

Doing this, you will now be able to execute the translate command with the parameters you want, and it will create translation for those 4 languages that are on the config file. You can modify the config file as you need for what you're developing. Just be sure of not push changes with privates keys inside.

> [!IMPORTANT]
> Avoid pushing private keys on the i18n-populator.config.js file

### Run the CLI tool using my local version

To run the project you'll need using the `tsx` library, which is a tool that help running typescript in NodeJS in an easier way. Here is the [official npm page of tsx](https://www.npmjs.com/package/tsx).

Example of running the project:

#### Check languages availables

```sh
npx tsx src/cli.ts languages
```

#### Starting setup wizard

```sh
npx tsx src/cli.ts init
```

#### Creating translations

```sh
npx tsx src/cli.ts --text "Hello beautiful world" --from es --name "hi_beautiful_world_test"
```

## Pushing your changes

As mentioned above, you need to push your changes to your repository, then make a PR from your forked repository to the official repository. [You can check this documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).

I will do my best to review your code and your changes, it's possible that I left comments on your PR, just let me know if you don't want do extra changes and I could apply the necessary changes in case the PR needs to be merged.

## THANKS

Thanks a lot for your contribution!
