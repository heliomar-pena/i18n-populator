// src/types/settings.ts
export enum Engines {
    GOOGLE = "google",
    BING = "bing",
    LIBRE_TRANSLATE = "libreTranslate",
  }
  
  export enum SortOrder {
    ASC = "A-Z",
    DESC = "Z-A",
    NONE = "none",
  }
  
  export type Settings = {
    basePath: string;
    translationEngines: any;
    languages: any;
    sort?: SortOrder;
  };
  