import lodashGet from "lodash.get";

import { DotNotationKeys, DotNotationMap } from "./DotNotationMap";

/**
 * A type safe wrapper around lodash.get
 * @param args
 * @returns
 */
export function get<
  Obj extends object,
  Path extends DotNotationKeys<Obj>,
  Default = DotNotationMap<Obj>[Path]
>(args: {
  object: Obj;
  path: DotNotationKeys<Obj>;
  slots?: (string | number)[];
  defaultValue?: DotNotationMap<Obj>[Path];
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
