# i18n auto translations generator

Make easiest translations for your project with only one terminal command. Generate translations for all the languages that you're handling on your project free.

![i18n translations (1)](https://github.com/victor-heliomar/i18n-translation-generator/assets/66505715/2566afc9-7120-466c-b9e5-4301e32bd64d)

This project uses [Google Translate API](https://github.com/vitalets/google-translate-api) to generate the translations, which is using [Translateer](https://github.com/Songkeys/Translateer) to access Google Translate API free an unlimited using Puppeteer. In a future I'll include the option to use an Google API Key so you could use it with your own account.

> DISCLAIMER! To be 100% legal please use official Google Translate API.

```sh
npx i18n-translate-generator translate "Hello world" "en" "greetings"
```

## Roadmap

- [x] Generates translations for all the languages that you're handling on your project free.
- [x] Allow custom paths for translations files and configuration file.
- [x] Create the possibility of nest new translations (for example { accountSettings: { title: 'Account settings' } })
- [ ] Create landing page and logo for the project.
- [ ] Handle properly text interpolation on most of cases. For example (Hi {{name}}!)
- [ ] Allow translate various text at once saving queries to Google Translate API.
- [ ] Allow use Google API Key to use your own account.

## Features

1. Create translations for all the languages that you're handling on your project with only one command for free saving a lot of time.
2. It's easy to use and configure.
3. Doesn't need Google Translation API Key.
4. Work on the most recent versions of NodeJS. (Tested on v14.16.1)

## How to use

### Install

Actually it is not required to install it on your project to work. But you can optionally install it locally or globally with npm or yarn. So when you ran npx it will use your local or global installation instead of download it each time.

```sh
npm install i18n-translate-generator
```

```sh
yarn add i18n-translate-generator
```

### Translate

1. The first thing you need to do is create a json file that will work as configuration of the project, it have the next structure:

```json
{
    "basePath": "example/i18n", // The base path where is your translation json files
    "languages": [ // The languages that you want to translate
        {
            "name": "en", // The language that you're handling on the files that you will include in files property
            "files": [
                "en.json" // All the files where you're handling the language mentioned above
            ]
        }
    ]
}
```

Also you can check an example on [configuration file](./i18n-auto-translate.config.json)

2. In order to translate, you need to run the `translate` command, write the phrase you want to translate and select the source language that it is wrote in, and at the end add a name for your new translation, this will be used on your json files as property name.

```sh
npx i18n-translate-generator translate "Hello world" "en" "greetings"
```

Another example in spanish

```sh
npx i18n-translate-generator translate "Hola mundo" "es" "greetings"
```

You only need to specify in what language is wrote the text that you're passing through command, since all the languages that you want to translate are specified on the configuration file.

Also, additionally you can specify the path of the configuration file, by default it will search for the file called `i18n-auto-translate.config.json` on the root of your project, but you can specify another path with the `-s` or `--settings-file` flag.

### Nested Translations

You can nest translations by using the `.` character, for example to create the next json:

```json

{
  "accountSettings": {
    "title": "Account settings"
  }
}
```

You only need to pass the next text to the command:

```sh
npx i18n-translate-generator translate "Account settings" "en" "accountSettings.title"
```

For example

```sh
npx i18n-translate-generator translate "Hello world" "en" "greetings" -s "example/custom-setting.config.json"
```

## Configuration file

The configuration file is an json file which allow you to modify certain aspects of the project, like the languages that you want to translate, the path of the translations files, etc. Here is a list of the properties that you can modify on the configuration file.

| Property | Type | Description | Required | Example | Default |
| --- | --- | --- | --- | --- | --- |
| `basePath` | string | The path where the translations files are located. | <center>:white_check_mark:</center> | `"./src/assets/i18n"` | |
| `languages` | { name: string, files: string[] }[] | The languages that you want to translate and the files where are you saving their translations | <center>:white_check_mark:</center> | `[{ "name": "en", "files": ["en.json"] }]` | |

## Commands

| Command | Description | Arguments | Example |
| --- | --- | --- | --- |
| `translate` | Translate a text to all the languages that you're handling on your project. | `text`: The word or sentence that you want to translate. <br/>`sourceLanguage`: The language of the text that you wrote on `text`. <br/>`propertyName`: The property name that you want to be used to include your new translation on your project | `npx i18n-auto-translate translate "my text" "en" "myText"` |
| `help` | Show the help menu with all the available commands. | | `npx i18n-auto-translate help` |
