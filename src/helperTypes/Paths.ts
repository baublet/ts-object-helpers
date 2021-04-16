import { Depth } from "./Depth";

export type Paths<T, D extends number = 5> = [D] extends [never]
  ? never
  : T extends Array<infer ArrayType>
  ? "0" | Join<"0", Paths<ArrayType, Depth[D]>>
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Depth[D]>>
        : never;
    }[keyof T]
  : "";

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;
