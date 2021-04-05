# TypeScript Object Access Helpers ![Main Branch Status](https://github.com/baublet/ts-object-helpers/actions/workflows/test-and-build.yml/badge.svg)

Solves the problem of type-safe, deep-object access (or partial access) that is made possible with recent TypeScript language features.

```ts
import { get } from "@baublet/ts-object-helpers";

const show = {
  name: "The Fresh Prince",
  characters: [
    {
      name: "Will Smith",
      parents: [
        {
          name: "Vy Smith",
        },
      ],
    },
  ],
};

const willsMom = get(
  show,
  { path: "characters.parents.$.name", slots: [0] },
  "Aunt Viv"
);

console.log(willsMom); // "Vy Smith"
```

- Uses `lodash.get` under the hood (fast, battle-tested, reliable)
- Adds as much type safety as possible
- Isomorphic (works both in the browser and in node)
- 100% test coverage

[@baublet/ts-object-helpers on NPM](https://www.npmjs.com/package/@baublet/ts-object-helpers)

## Requirements

- TypeScript 4.1+ (requires template literal types)

## Documentation

### Installation

```bash
# npm
$ npm i --save @baublet/ts-object-helpers

# yarn
$ yarn add @baublet/ts-object-helpers
```

### Type Helpers

#### `NestedPropertyTypeOf<T extends object, DotNotationKeyOf<T>>`

Takes an object with a known set of keys and values, and some dot-notation property of that objects, and creates a type that represents the value of the accessed property.

```ts
type Model = {
  id: string;
  child: {
    id: string;
    children: {
      id: string;
      name: string;
    }[];
  };
};

type ChildNameType = NestedPropertyTypeOf<Model, "id.child.children.$.name">; // string
```

#### `DotNotationKeys<T extends object>`

Takes an object with a known set of keys and recursively returns all possible dot notation accessors for the known type.

```ts
type Model = {
  id: string;
  child: {
    id: string;
    children: {
      id: string;
      name: string;
    }[];
  };
};

type ModelKeys = DotNotationKeys<Model>;

// The above type is equivalent to the below:
type FlatModelKeys =
  | "id"
  | "child"
  | "child.id"
  | "child.children"
  | "child.children.$"
  | "child.children.$.id"
  | "child.children.$.name";
```

#### `DotNotationMap<T extends object>`

Flattens an object nested up to 5 levels deep into a record of the nested keys in dot notation, with the values preserved.

**Note:** this generic is best used on known types. For example, `Record<string, KnownType>` won't work well with this type, since we can't infer the infinite possible combination of keys on `Record<string, KnownType>`.

```ts
type Model = {
  id: string;
  child: {
    id: string;
    children: {
      id: string;
      name: string;
    }[];
  };
};

type DotNotatedModel = DotNotationMap<Model>;

// The above type is equivalent to the below:
type FlatModel = {
  id: string;
  child: { id: string; children: { id: string; name: string }[] };
  "child.id": string;
  "child.children": { id: string; name: string }[];
  "child.children.$": { id: string; name: string };
  "child.children.$.id": string;
  "child.children.$.name": string;
};
```

#### `NonObjectKeysOf<T extends object>`

Returns the keys of `T` that are primitive types (that is, they're not objects).

#### `ObjectKeysOf<T extends object>`

Returns the keys of `T` that are objects or object-like.

#### `PrependObjectKeysWith<T extends object, Key extends string>`

Creates a new object from `T` with the keys prepended with `Key`. If `Key` is an empty string, this returns `T`.

#### `UnionToIntersection<T extends object>`

If `T` is a union of objects, converts `T` to an intersection between all of the objects unioned in `T`. Credit: [S Stefan Baumgartner](https://fettblog.eu/typescript-union-to-intersection/)

#### `ValuesOf<T extends object>`

Constructs a type from all of the values of `T` as a union.

```ts
type Model = {
  id: "id";
  object1: { test: 123 };
};

// Values = "id" | { test: 123 }
type Values = ValuesOf<Model>;

const values: Values[] = ["id", { test: 123 }];
```

### Functions

#### `get`

Type-safe accessor function for objects with **known keys and values**. Similar API to `lodash.get`.

```ts
function get(
  subjectObject: object,
  optionsOrPath:
    | string
    | {
        path: string;
        slots?: (string | number)[];
      },
  defaultValue?: any
): ProvidedDefault | object[path];
```

**Example**

```ts
const person = {
  id: "a10023b",
  name: "Carlton Banks",
  dean: {
    id: "p93i",
    name: "Ashley Banks",
  },
  departments: [
    {
      id: 1,
      name: "History",
      chair: {
        id: "a43c",
        name: "Vivian Banks",
      },
    },
    {
      id: 2,
      name: "Literature",
      chair: {
        id: "a88p",
        name: "Hillary King Banks",
      },
    },
  ],
};

const deanName = get(
  person,
  "dean.name".
  "n/a"
); // type: string | "n/a". Value: Ashley Banks

const firstDepartmentName = get(
  person,
  { path: "department.$.name"), slots: [0] }
); // type: string. Value: History

const secondDepartmentName = get(
  person,
  { path: "department.$.name"), slots: [1] }
); // type: string. Value: Literature

const secondDepartmentChair = get(
  person,
  { path: "department.$.chair"), slots: [1] }
); // type: undefined | { id: string, name: string }. Value: { id: "a88p", name: "Hillary King Banks" }
```

**Limitations**

- This only works on fully known object types (e.g., where properties of the object are all known at compile time)
- If values aren't fully known at compile time, this may not work properly.
- If the accessors aren't fully known at compile time, this may not work properly.

For more complex examples, type safety cannot guaranteed at compile time. Use `lodash.get` and runtime checks for these scenarios.
