import { DotNotationMap, DotNotationKeys } from "../DotNotationMap";

export type NestedPropertyTypeOf<
  T,
  Path extends DotNotationKeys<T>
> = DotNotationMap<T>[Path];
