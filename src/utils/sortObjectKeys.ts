import { Settings, SortOrder } from "../types/settings";

const sortHandlers = {
  [SortOrder.ASC]: (object: Record<string, any>) =>
    Object.fromEntries(
      Object.entries(object).sort(([a], [b]) => a.localeCompare(b))
    ),

  [SortOrder.DESC]: (object: Record<string, any>) =>
    Object.fromEntries(
      Object.entries(object).sort(([a], [b]) => b.localeCompare(a))
    ),
};

function sortObjectKeys(obj: any, sort: SortOrder = SortOrder.NONE): any {
  if (sort === SortOrder.NONE || typeof obj !== "object" || obj === null)
    return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sortObjectKeys(item, sort));
  }

  const sortedEntries = Object.entries(obj).map(([key, value]) => [
    key,
    sortObjectKeys(value, sort),
  ]);

  return sortHandlers[sort]
    ? sortHandlers[sort](Object.fromEntries(sortedEntries))
    : obj;
}

export { sortObjectKeys };
