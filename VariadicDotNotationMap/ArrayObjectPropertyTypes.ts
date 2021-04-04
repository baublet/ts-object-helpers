import { VariadicDotNotationMap } from "./DotNotationMap";
import { PathForKey } from "./PrependObjectKeys";

export type ArrayObjectPropertyTypes<T> = {
  [K in keyof T]: T[K] extends Array<infer ArrayType>
    ? { [SameKey in K]: ArrayType[] } &
        {
          [InternalKey in PathForKey<"$", string & K>]: ArrayType;
        } &
        {
          [InternalKey in PathForKey<
            "$",
            string & K
          >]: ArrayType extends Array<any>
            ? {
                [SK in PathForKey<"$", string & K>]: ArrayType;
              }
            : ArrayType extends object
            ? {
                [SK in PathForKey<"$", string & K>]: VariadicDotNotationMap<
                  ArrayType,
                  PathForKey<"$", string & K>
                >;
              }[PathForKey<"$", string & K>]
            : {
                [SK in PathForKey<"$", string & K>]: ArrayType;
              };
        }[PathForKey<"$", string & K>]
    : { [SameKey in K]: T[SameKey] };
}[keyof T];
