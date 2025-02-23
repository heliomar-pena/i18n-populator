type FindLastIndexCallback<T> = (value: T, index: number, obj: T[]) => boolean;

export type FindLastIndex<T> = (
  predicate: FindLastIndexCallback<T>,
  thisArg?: any,
) => number;
