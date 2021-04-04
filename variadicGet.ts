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
  Default = VariadicDotNotationMap<Obj>[Path]
>(args: {
  object: Obj;
  path: VariadicDotNotationKeys<Obj>;
  slots?: (string | number)[];
  defaultValue?: VariadicDotNotationMap<Obj>[Path];
}): Default {
  const pathAsString = args.path as string;
  const pathParts = pathAsString.split(".");
  const slotCount = pathParts.filter((path) => path === "$");
  const slots = args.slots;

  if (!slots) {
    return lodashGet(args.object, pathAsString, args.defaultValue);
  }

  if (slotCount.length !== slots.length) {
    throw new Error(
      `Slots passed doesn't match the slots in the accessor! Path: ${args.path}. Slots: ${args.slots}`
    );
  }

  if (slotCount.length === 0) {
    return lodashGet(args.object, pathAsString, args.defaultValue);
  }

  let slotIndex = 0;
  const pathPartsWithSlotsReplaced = pathParts.map((part) => {
    if (part !== "$") {
      return part;
    }
    return slots[slotIndex++];
  });

  return lodashGet(
    args.object,
    pathPartsWithSlotsReplaced.join("."),
    args.defaultValue
  );
}
