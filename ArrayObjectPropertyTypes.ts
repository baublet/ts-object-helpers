import { PathForKey } from "./PrependObjectKeys";
import { DotNotationMap } from "./DotNotationMap";

export type ArrayObjectPropertyTypes<T> = {
  [K in keyof T]: T[K] extends Array<infer ArrayType>
    ? { [SameKey in K]: T[SameKey] } &
        {
          [InternalKey in PathForKey<"__arrayType", string & K>]: ArrayType;
        }
    : { [SameKey in K]: T[SameKey] };
}[keyof T];
