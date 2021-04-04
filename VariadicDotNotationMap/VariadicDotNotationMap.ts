import { PathForKey, PrependObjectKeysWith } from "../helperTypes/PrependObjectKeys";
import { ArrayObjectPropertyTypes } from "./ArrayObjectPropertyTypes";
import { UnionToIntersection } from "../helperTypes/UnionToIntersection";

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
 * type FlatModel {
 *   "id": string,
 *   "child": { id: string, children: { id: string, name: string }[] }
 *   "child.id": string,
 *   "child.children": { id: string, name: string }[],
 *   "child.children.$": { id: string, name: string }
 *   "child.children.$.id": string,
 *   "child.children.$.name": string
 * }
 */
export type VariadicDotNotationMap<
  T,
  BasePath extends string = ""
> = UnionToIntersection<
  | BaseTypesWithPath<T, BasePath>
  | {
      [K in ObjectKeysOf<T>]: D2<T[K], PathForKey<string & K, BasePath>>;
    }[ObjectKeysOf<T>]
>;

type D2<T, Path extends string> =
  | BaseTypesWithPath<T, Path>
  | {
      [K in ObjectKeysOf<T>]: D3<T[K], PathForKey<string & K, Path>>;
    }[ObjectKeysOf<T>];

type D3<T, Path extends string> =
  | BaseTypesWithPath<T, Path>
  | {
      [K in ObjectKeysOf<T>]: D4<T[K], PathForKey<string & K, Path>>;
    }[ObjectKeysOf<T>];

type D4<T, Path extends string> =
  | BaseTypesWithPath<T, Path>
  | {
      [K in ObjectKeysOf<T>]: D5<T[K], PathForKey<string & K, Path>>;
    }[ObjectKeysOf<T>];

type D5<T, Path extends string> =
  | BaseTypesWithPath<T, Path>
  | {
      [K in ObjectKeysOf<T>]: D6<T[K], PathForKey<string & K, Path>>;
    }[ObjectKeysOf<T>];

type D6<T, Path extends string> =
  | BaseTypesWithPath<T, Path>
  | {
      [K in ObjectKeysOf<T>]: DFinal<T[K], PathForKey<string & K, Path>>;
    }[ObjectKeysOf<T>];

type DFinal<T, Path extends string> = BaseTypesWithPath<T, Path>;

type BaseTypesWithPath<T, Path extends string = ""> =
  | PrependObjectKeysWith<ArrayObjectPropertyTypes<T>, Path>
  | ValuesOf<
      { [K in keyof T]: PrependObjectKeysWith<{ $: ValuesOf<T> }, Path> }
    >;

type NonObjectKeysOf<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : T[K] extends object ? never : K;
}[keyof T];

type ObjectKeysOf<T> = Exclude<keyof T, NonObjectKeysOf<T>>;
type ValuesOf<T> = T[keyof T];

export type VariadicDotNotationKeys<T extends object> = keyof VariadicDotNotationMap<T>;
