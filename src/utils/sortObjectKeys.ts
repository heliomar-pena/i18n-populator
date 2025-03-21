import { Settings } from "../types/settings";

function sortObjectKeys(
  obj: any,
  sortOrder: Settings["sort"]
): any {
  if (sortOrder === "none") return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => sortObjectKeys(item, sortOrder));
  } else if (obj !== null && typeof obj === "object") {
    const keys = Object.keys(obj);
    const sortedKeys =
      sortOrder === "A-Z" ? keys.sort() : keys.sort().reverse();
    const sortedObj: any = {};
    for (const key of sortedKeys) {
      sortedObj[key] = sortObjectKeys(obj[key], sortOrder);
    }
    return sortedObj;
  }
  return obj;
}

export { sortObjectKeys };
