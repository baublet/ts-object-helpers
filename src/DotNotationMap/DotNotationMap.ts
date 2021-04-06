import {
  PathForKey,
  PrependObjectKeysWith,
} from "../helperTypes/PrependObjectKeys";
import { UnionToIntersection } from "../helperTypes/UnionToIntersection";
import { PartialKeysToRequiredOrUndefined } from "../helperTypes/PartialKeysToRequiredOrUndefined";
import { ObjectKeysOf } from "../helperTypes/ObjectKeysOf";
import { ValuesOf } from "../helperTypes/ValuesOf";

/**
 * Flattens an object nested up to 5 levels deep into a record of the nested
 * keys in dot notation, with the values preserved. E.g.,
 *
 * type Model = {
 *   id: string,
 *   child: {
 *     id: string,
 *     children: {
 *      id: string,
 *      name: string
 *     }[]
 *   }
 * }
 *
 * This helper converts that type to:
 *
 * type FlatModel = {
 *   "$": string | typeof child,
 *   "id": string,
 *   "child": { id: string, children: { id: string, name: string }[] },
 *   "child.$": string | typeof children,
 *   "child.id": string,
 *   "child.children": { id: string, name: string }[],
 *   "child.children.$": { id: string, name: string },
 *   "child.children.$.id": string,
 *   "child.children.$.name": string,
 * }
 */
export type DotNotationMap<
  T extends {},
  BasePath extends string = "",
  TransformedObject extends {} = PartialKeysToRequiredOrUndefined<T>
> = UnionToIntersection<
  | BaseTypesWithPath<TransformedObject, BasePath>
  | {
      [K in ObjectKeysOf<TransformedObject>]: D0<
        TransformedObject[K],
        PathForKey<string & K, BasePath>
      >;
    }[ObjectKeysOf<TransformedObject>]
>;

type D0<
  T extends {},
  BasePath extends string = "",
  TransformedObject extends {} = PartialKeysToRequiredOrUndefined<T>
> = UnionToIntersection<
  | BaseTypesWithPath<TransformedObject, BasePath>
  | {
      [K in ObjectKeysOf<TransformedObject>]: D1<
        TransformedObject[K],
        PathForKey<string & K, BasePath>
      >;
    }[ObjectKeysOf<TransformedObject>]
>;

type D1<
  T extends {},
  BasePath extends string = "",
  TransformedObject extends {} = PartialKeysToRequiredOrUndefined<T>
> = UnionToIntersection<
  | BaseTypesWithPath<TransformedObject, BasePath>
  | {
      [K in ObjectKeysOf<TransformedObject>]: D2<
        TransformedObject[K],
        PathForKey<string & K, BasePath>
      >;
    }[ObjectKeysOf<TransformedObject>]
>;

type D2<
  T extends {},
  BasePath extends string = "",
  TransformedObject extends {} = PartialKeysToRequiredOrUndefined<T>
> = UnionToIntersection<
  | BaseTypesWithPath<TransformedObject, BasePath>
  | {
      [K in ObjectKeysOf<TransformedObject>]: D3<
        TransformedObject[K],
        PathForKey<string & K, BasePath>
      >;
    }[ObjectKeysOf<TransformedObject>]
>;

type D3<
  T extends {},
  BasePath extends string = "",
  TransformedObject extends {} = PartialKeysToRequiredOrUndefined<T>
> =
  | BaseTypesWithPath<TransformedObject, BasePath>
  | {
      [K in ObjectKeysOf<TransformedObject>]: DFinal<
        TransformedObject[K],
        PathForKey<string & K, BasePath>
      >;
    }[ObjectKeysOf<TransformedObject>];

type DFinal<
  T extends {},
  BasePath extends string = "",
  TransformedObject extends {} = PartialKeysToRequiredOrUndefined<T>
> = BaseTypesWithPath<TransformedObject, BasePath>;

type BaseTypesWithPath<T, Path extends string = ""> = T extends Array<
  infer ArrayType
>
  ? PrependObjectKeysWith<
      { $: BaseTypesWithPath<ArrayType, PathForKey<"$", Path>> },
      Path
    > 
  : T extends {}
  ?
      | PrependObjectKeysWith<T, Path>
      | ValuesOf<
          {
            [K in keyof T]: PrependObjectKeysWith<{ $: ValuesOf<T> }, Path>;
          }
        >
  : T;

export type DotNotationKeys<T extends object> = keyof DotNotationMap<T>;
