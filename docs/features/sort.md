# SORT

Sorting is a feature that was added as a proposal to avoid conflicts when multiple persons adds translations on the same repo.

A problem I noticed when working with multiple front developers on the same repository, is that Translations have always a lot of conflicts. And it's mostly because we all add the translations at the same place: at the end of the file.

This feature "SORTING" proposes that you'll do a BIG change to your .json files, sorting then the first time, but after that, it'll help avoid the conflicts the most possible, as you and your code dudes would be modifying the same file but in different places, based on the alphabetic sorting.

## How it works?

Let's imagine I add a translation called "hello_world", and **Samuel**, which is other FrontEnd that works with me, adds a translation called "user_profile", without sorting enabled, it would look like this:

### Comparison

**My branch**:

```js
{
  "jay": "Wooho!",
  "submit": "Enviar",
  "add_picture": "Agregar imagen",
  "hello_world": "Hola mundo"
}
```

**Samuel branch**:

```js
{
  "jay": "Wooho!",
  "submit": "Enviar",
  "add_picture": "Agregar imagen",
  "user_profile": "Perfil de usuario"
}
```

### Analysis

This would cause conflicts as from GIT point of view, both versions are incompatible, as they have on the SAME LINE, DIFFERENT CONTENT, and it would not know how to merge them by itself, you'll have to solve this conflict. AND THIS WOULD HAPPEN ON EACH LANGUAGE YOU HAVE ON YOUR PROJECT.

### Solution

With sorting, it'll look like this:

**My branch**:

```js
{
  "add_picture": "Agregar imagen",
  "hello_world": "Hola mundo"
  "jay": "Wooho!",
  "submit": "Enviar",
}
```

**Samuel branch**:

```js
{
  "add_picture": "Agregar imagen",
  "jay": "Wooho!",
  "submit": "Enviar",
  "user_profile": "Perfil de usuario"
}
```

### Analysis solution

It'll not have conflict as the changes were added on different places of the same file, which can be merged automatically by GitHub.

### How to Enable

To enable this feature permanently, add `"sort": true` in your `i18n-populator.config.json` file:

```json
{
  "basePath": "example",
  "sort": true,
  "translationEngines": [],
  "languages": []
}
```
