import lodashGet from "lodash.get";

import {
  VariadicDotNotationKeys,
  VariadicDotNotationMap,
} from "./VariadicDotNotationMap";

/**
 * A type safe wrapper around lodash.get that's as type safe as we can make it
 * when using variadic accessors, rather than known string literals.
 */
export function variadicGet<
  Obj extends object,
  Path extends VariadicDotNotationKeys<Obj>,
  ProvidedDefault extends any = never,
  ResultType = VariadicDotNotationMap<Obj>[Path] | ProvidedDefault
>(
  subjectObject: Obj,
  options: {
    path: VariadicDotNotationKeys<Obj>;
    slots?: (string | number)[];
    defaultValue?: ProvidedDefault;
  }
): ResultType {
  const pathAsString = options.path as string;
  const pathParts = pathAsString.split(".");
  const slotCount = pathParts.filter((path) => path === "$");
  const slots = options.slots;

  if (!slots) {
    return lodashGet(subjectObject, pathAsString, options.defaultValue);
  }

  if (slotCount.length !== slots.length) {
    throw new Error(
      `Slots passed doesn't match the slots in the accessor! Path: ${options.path}. Slots: ${options.slots}`
    );
  }

  if (slotCount.length === 0) {
    return lodashGet(subjectObject, pathAsString, options.defaultValue);
  }

  let slotIndex = 0;
  const pathPartsWithSlotsReplaced = pathParts.map((part) => {
    if (part !== "$") {
      return part;
    }
    return slots[slotIndex++];
  });

  return lodashGet(
    subjectObject,
    pathPartsWithSlotsReplaced.join("."),
    options.defaultValue
  );
}
