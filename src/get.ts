import { DotNotationKeys, DotNotationMap } from "./DotNotationMap";
import { variadicGet } from "./variadicGet";

/**
 * A type safe wrapper around lodash.get that's as type safe as we can make it
 * when using variadic accessors, rather than known string literals.
 */
export function get<
  Obj extends object,
  Path extends DotNotationKeys<Obj>,
  Default = DotNotationMap<Obj>[Path]
>(
  subjectObject: Obj,
  options: {
    path: DotNotationKeys<Obj>;
    slots?: (string | number)[];
    defaultValue?: DotNotationMap<Obj>[Path];
  }
): Default {
  // Casting here to prevent possibly-infinite instantiation issues. We don't
  // care to infer at this point, since we're type complete at the exposed ends
  // of this function, anyway.
  return variadicGet(subjectObject, options as any);
}
