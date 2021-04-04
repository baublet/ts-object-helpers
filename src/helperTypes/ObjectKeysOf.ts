import { NonObjectKeysOf } from "./NonObjectKeysOf";

export type ObjectKeysOf<T> = Exclude<keyof T, NonObjectKeysOf<T>>;
