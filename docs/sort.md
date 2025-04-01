# Alphabetical JSON Sorting

This update permanently enables alphabetical sorting of JSON keys during the translation process. By doing so, the translation files will have their keys organized automatically, reducing merge conflicts and improving overall readability.

## What It Does

- **Automatic Sorting:**  
  When translations are generated, keys in the JSON files will be sorted alphabetically.

- **Reduced Merge Conflicts:**  
  New translation entries are inserted into the appropriate order, minimizing the chance of conflicts when multiple changes are merged.

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
