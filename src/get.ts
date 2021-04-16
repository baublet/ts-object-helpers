import lodashGet from "lodash.get";

import { Paths } from "./helperTypes/Paths";
import { PathToType } from "./helperTypes/PathToType";

/**
 * A type safe wrapper around lodash.get that's as type safe as we can make it
 * when using variadic accessors, rather than known string literals.
 */
export function get<
  SubjectObject extends object,
  Path extends Paths<SubjectObject>,
  ProvidedDefault extends any = undefined
>(
  subjectObject: SubjectObject,
  optionsOrPath: Path | GetOptions<Path>,
  defaultValue?: ProvidedDefault
): PathToType<SubjectObject, Path> {
  const pathAsString = (typeof optionsOrPath === "object"
    ? (optionsOrPath as any).path
    : optionsOrPath) as string;
  const pathParts = pathAsString.split(".");
  const slotCount = pathParts.filter((path) => path === "$");
  const slots =
    typeof optionsOrPath === "object" ? (optionsOrPath as any).slots || [] : [];

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

type GetOptions<Path extends string> = {
  path: Path;
  slots?: (string | number)[];
};
