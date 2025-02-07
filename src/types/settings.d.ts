export enum Engines {
    GOOGLE = 'google',
    BING = 'bing',
    LIBRE_TRANSLATE = 'libreTranslate'
}

export type TranslationEngines = Engines[];

export type Language = {
    name: "en",
    files: string[],
}

export type Path = string[];

export type Languages = Language[];

export type Settings = {
    basePath: Path,
    translationEngines: TranslationEngines,
    languages: Languages
}
