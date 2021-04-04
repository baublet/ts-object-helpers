export type PrependObjectKeysWith<
  Object extends unknown,
  Path extends string
> = Path extends ""
  ? Object
  : {
      [K in keyof Object as PathForKey<string & K, Path>]: Object[K];
    };

export type PathForKey<Key extends string, P extends string = ""> = P extends ""
  ? Key
  : `${P}.${Key}`;
