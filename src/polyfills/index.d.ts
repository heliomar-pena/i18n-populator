import { FindLastIndex } from "./Inquirer/findLastIndex.d";

declare global {
  interface Array<T> {
    findLastIndex?: FindLastIndex<T>;
  }
}
