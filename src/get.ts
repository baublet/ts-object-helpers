import lodashGet from "lodash.get";

import { DotNotationKeys, DotNotationMap } from "./DotNotationMap";
import { DeepRequired } from "./helperTypes/DeepRequired";

/**
 * A type safe wrapper around lodash.get that's as type safe as we can make it
 * when using variadic accessors, rather than known string literals.
 */
export function get<
  SubjectObject extends object,
  Path extends keyof DotNotationMap<SubjectObject>,
  ProvidedDefault extends any = undefined
>(
  subjectObject: SubjectObject,
  optionsOrPath:
    | Path
    | {
        path: Path;
        slots?: (string | number)[];
      },
  defaultValue?: ProvidedDefault
): DotNotationMap<SubjectObject>[Path] | ProvidedDefault {
  const pathAsString = (typeof optionsOrPath === "object"
    ? optionsOrPath.path
    : optionsOrPath) as string;
  const pathParts = pathAsString.split(".");
  const slotCount = pathParts.filter((path) => path === "$");
  const slots =
    typeof optionsOrPath === "object" ? optionsOrPath.slots || [] : [];

  if (slotCount.length !== slots.length) {
    throw new Error(
      `Slots passed doesn't match the slots in the accessor! Path: ${pathAsString}. Slots: ${slots}`
    );
  }

  if (slotCount.length === 0) {
    return lodashGet(subjectObject, pathAsString, defaultValue);
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
    defaultValue
  );
}
