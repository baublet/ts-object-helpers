import { Depth } from "./Depth";

export type PathToType<T, P extends string, D extends number = 5> = [
  D
] extends [never]
  ? unknown
  : T extends Array<unknown>
  ? P extends `${number}.${infer Rest}`
    ? PathToType<T[number], Rest, Depth[D]>
    : P extends `${number}`
    ? T[number]
    : unknown
  : P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathToType<T[K], Rest, Depth[D]>
    : unknown
  : P extends `${infer K}`
  ? K extends keyof T
    ? T[K]
    : unknown
  : unknown;

type Tuple = [{ name: "A" }, { name: "B" }];
const tupleTest: PathToType<Tuple, "0.name"> = "A";
