export type DeepRequired<T> = T extends Array<any>
  ? T
  : T extends Array<any>
  ? T
  : T extends object
  ? Required<
      {
        [K in keyof T]: T[K] extends Array<any>
          ? T[K]
          : T[K] extends object
          ? DeepRequired<T[K]>
          : T[K];
      }
    >
  : T;
