import { Depth } from "./Depth";

export type DeepRequired<T, D extends number = 5> = [D] extends [never]
  ? T
  : T extends Array<any>
  ? T
  : T extends Array<any>
  ? T
  : T extends object
  ? Required<
      {
        [K in keyof T]: T[K] extends Array<any>
          ? T[K]
          : T[K] extends object
          ? DeepRequired<T[K], Depth[D]>
          : T[K];
      }
    >
  : T;
