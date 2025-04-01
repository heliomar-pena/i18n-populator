import { Settings, SortOrder } from "../types/settings.d";
import { GenericObject } from "../types/shared";

const sortHandlers: Record<
  SortOrder,
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
  [SortOrder.NONE]: (object: GenericObject) => object,
};

function sortObjectKeys(obj: any, sort: SortOrder = SortOrder.NONE): any {
  const sortHandler = sortHandlers[sort];

  if (!sortHandler) {
    throw new Error(
      `The sort option you've provided is not supported, please try one of the next: ${Object.values(SortOrder).join(", ")}`
    );
  }

  if (sort === SortOrder.NONE || typeof obj !== "object" || obj === null) {
    return obj;
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
