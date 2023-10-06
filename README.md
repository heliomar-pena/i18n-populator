# i18n auto translations generator

Make easiest translations for your project with only one terminal command. Generate translations for all the languages that you're handling on your project free.

![i18n translations (1)](https://github.com/victor-heliomar/i18n-translation-generator/assets/66505715/2566afc9-7120-466c-b9e5-4301e32bd64d)

This project uses [Google Translate API](https://github.com/vitalets/google-translate-api) and [Bing Translate API](https://github.com/plainheart/bing-translate-api) to generate the translations. In a future I'll include the option to use an Google API Key / Bing Api Key so you could use it with your own account.

> DISCLAIMER! To be 100% legal please use official Google Translate API.

```sh
npx i18n-translate-generator translate "Hello world" "en" "greetings" --engine "bing"
```

## Roadmap

- [x] Generates translations for all the languages that you're handling on your project free.
- [x] Allow custom paths for translations files and configuration file.
- [x] Create the possibility of nest new translations (for example { accountSettings: { title: 'Account settings' } })
- [x] Integrate at least two translation APIs so user could use the one that fits better for him.
- [ ] Create landing page and logo for the project.
- [ ] Handle properly text interpolation on most of cases. For example (Hi {{name}}!)
- [ ] Allow translate various text at once saving queries to Google Translate API.
- [ ] Allow use Google API Key to use your own account.

## Features

1. Create translations for all the languages that you're handling on your project with only one command for free saving a lot of time.
2. It's easy to use and configure.
3. API Key is not mandatory. (Next versions will allow use your own API Key in case you want to use your own account and avoid free request limit)
4. Work on the most recent versions of NodeJS. (Tested on v14.16.1)

## How to use

### Install

Actually it is not required to install it on your project to work. But you can optionally install it locally or globally with npm or yarn. So when you ran npx it will use your local or global installation instead of download it each time. In case you want to install it on your project it's recommended install it as dev dependency.

```sh
npm install --save-dev i18n-translate-generator
```

```sh
yarn add i18n-translate-generator --dev
```

### Translate

1. The first thing you need to do is create a json file that will work as configuration of the project, it have the next structure:

```json
{
    "basePath": "example/i18n", // The base path where is your translation json files
    "translationEngines": [ // Your preference translation engines
        "google",
        "bing"
    ],
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

For example

```sh
npx i18n-translate-generator translate "Hello world" "en" "greetings" -s "example/custom-setting.config.json"
```

### Choosing translation engine

Currently there are two translation engines available, Google Translate and Bing Translate. There are two ways to configure the engine(s) that you want to use. The first one is specifying the engines on the configuration file, and the second one is specifying the engine that you want to use on the command.

#### How it works

You can only specify one engine through the CLI command, but you can specify multiple engines on the configuration file. When you define multiple engines on the configuration file, it will use them on order of preference, and if one of them fails, it will use the next one.

If you don't define any engine on the configuration file and you don't specify any engine on the command, it will use by default all the translation engine that are free and doesn't need API Key.

#### Define engines on configuration file

To define them on the configuration file you should create a new property called "translationEngines", which should content an array of engines in order of preference (I meant, put first the engine that you like more and then the second one that you like more, and so on). The engines that you can use are "google" and "bing".

For example:

```json
{
    "basePath": "example/i18n", // The base path where is your translation json files
    "translationEngines": [ // Your preference translation engines
        "google",
        "bing"
    ],
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

#### Define engine on command

To define the engine on the command you should use the flag `-e` or `--engine` followed by the engine that you want to use. The engines that you can use are "google" and "bing". 

If you specify a engine on the command, it will put it on the first position of the array of engines, and then it will use the engines that you defined on the configuration file.

If you don't specify any engine, the program will try to get your preferences from your configuration file, and if you don't have any configuration file, it will use by default all the translation engine that are free and doesn't need API Key.

For example:

```sh
npx i18n-translate-generator translate "Welcome to the jungle" "en" "welcomeMessage" -e "bing"
```

### Nested Translations

You can nest translations by using the `.` character on the property name parameter, for example:

```sh
npx i18n-translate-generator translate "Account settings" "en" "accountSettings.title"
```

```json
{
  "accountSettings": {
    "title": "Configuración de la cuenta",
  }
}
```

You can continue nesting translations as much as you want.

```sh
npx i18n-translate-generator translate "Email" "en" "accountSettings.email"
```

```json
{
  "accountSettings": {
    "title": "Configuración de la cuenta",
    "email": "Correo electrónico",
  }
}
```

```sh
npx i18n-translate-generator translate "Are you sure you want to change your email?" "en" "accountSettings.modal.edit.title"
```

```json
{
  "accountSettings": {
    "title": "Configuración de la cuenta",
    "email": "Correo electrónico",
    "modal": {
      "edit": {
        "title": "¿Estás seguro que quieres cambiar tu correo?",
      }
    }
  }
}
```

## Configuration file

The configuration file is an json file which allow you to modify certain aspects of the project, like the languages that you want to translate, the path of the translations files, etc. Here is a list of the properties that you can modify on the configuration file.

| Property | Type | Description | Required | Example | Default |
| --- | --- | --- | --- | --- | --- |
| `basePath` | string | The path where the translations files are located. | :white_check_mark: | `"./src/assets/i18n"` | |
| `languages` | { name: string, files: string[] }[] | The languages that you want to translate and the files where are you saving their translations | :white_check_mark: | `[{ "name": "en", "files": ["en.json"] }]` | |
| `translationEngines` | string[] | The translation engines that you want to use in order of preference. The available engines are "google" and "bing". | | `["google", "bing"]` | `["google", "bing"]` |

## Commands

| Command | Description | Arguments | Example |
| --- | --- | --- | --- |
| `translate` | Translate a text to all the languages that you're handling on your project. | `text`: The word or sentence that you want to translate. `sourceLanguage`: The language of the text that you wrote on `text`. `propertyName`: The property name that you want to be used to include your new translation on your project | `npx i18n-auto-translate translate "my text" "en" "myText"` |
| `help` | Show the help menu with all the available commands. | | `npx i18n-auto-translate help` |
