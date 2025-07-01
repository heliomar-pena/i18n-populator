import { Settings, SortOrder } from "../types/settings.d";
import { GenericObject } from "../types/shared";

const sortHandlers: Record<
  Exclude<SortOrder, SortOrder.NONE>,
  (object: GenericObject) => GenericObject
> = {
  [SortOrder.ASC]: (object: GenericObject) =>
    Object.fromEntries(
      Object.entries(object).sort(([a], [b]) => a.localeCompare(b))
    ),
  [SortOrder.DESC]: (object: GenericObject) =>
    Object.fromEntries(
      Object.entries(object).sort(([a], [b]) => b.localeCompare(a))
    ),
};

function sortObjectKeys(obj: any, sort: SortOrder = SortOrder.NONE): any {
  if (sort === SortOrder.NONE || typeof obj !== "object" || obj === null) {
    return obj;
  }

  const sortHandler = sortHandlers[sort];
  if (!sortHandler) {
    throw new Error(
      `The sort option you've provided is not supported, please try one of the next: ${Object.values(SortOrder).join(", ")}`
    );
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sortObjectKeys(item, sort));
  }

  const sortedEntries = Object.entries(obj).map(([key, value]) => [
    key,
    sortObjectKeys(value, sort),
  ]);

  return sortHandler(Object.fromEntries(sortedEntries));
}

export { sortObjectKeys };
