import { Depth } from "./Depth";

export type PartialKeysToRequiredOrUndefined<
  T,
  MaximumDepth extends number = 5
> = ReplacePlaceholderLiterals<
  RecursivePartialKeysToRequiredOrUndefined<T, MaximumDepth>
>;

type RecursivePartialKeysToRequiredOrUndefined<T, D extends number = 5> = [
  D
] extends [never]
  ? T
  : T extends Array<infer ArrayType>
  ? RecursivePartialKeysToRequiredOrUndefined<ArrayType, Depth[D]>[]
  : T extends {}
  ? {
      [K in keyof T]-?: K extends PartialKeys<T>
        ? Maybe<RecursivePartialKeysToRequiredOrUndefined<T[K], Depth[D]>>
        : RecursivePartialKeysToRequiredOrUndefined<T[K], Depth[D]>;
    }
  : T;

// This solution is required because TS at compile time will optimize away partial
// types like `{ k?: string | undefined }` to `{ k?: string }`, and things like
// `{ k: string | undefined }` to `{ k? string }`. These are not the same thing,
// so I'm not really sure why it does this.
type Maybe<T> = T extends string
  ? "__placeholderForStringUndefined"
  : T | "__placeholderForUndefined";

type ReplacePlaceholderLiterals<T> = T extends "__placeholderForStringUndefined"
  ? string | undefined
  : T extends "__placeholderForUndefined"
  ? Exclude<T, "__placeholderForUndefined"> | undefined
  : T extends {}
  ? {
      [K in keyof T]: ReplacePlaceholderLiterals<T[K]>;
    }
  : T;

export type PartialKeys<T> = {
  [K in keyof T]-?: undefined extends { [K2 in keyof T]: K2 }[K] ? K : never;
}[keyof T];
