export type NonObjectKeysOf<T> = Exclude<
  {
    [K in keyof T]: T[K] extends Array<any>
      ? K
      : T[K] extends object
      ? never
      : K;
  }[keyof T],
  undefined
>;
