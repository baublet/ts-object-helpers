# TypeScript Object Access Helpers ![Main Branch Status](https://github.com/baublet/ts-object-helpers/actions/workflows/test-and-build.yml/badge.svg)

Helps solve the problem of type-safe, deep-object access (or partial access) that is made possible with recent TypeScript versions.

- Uses `lodash.get` under the hood (fast, battle-tested, reliable)
- Adds as much type safety as possible
- Isomorphic
- Mandated 100% test coverage

## Requirements

- TypeScript 4.1+ (uses template literal types _heavily_)

## Documentation

### Installation

```bash
# npm
$ npm i --save @baublet/ts-object-helpers

# yarn
$ yarn add @baublet/ts-object-helpers
```

### Type Helpers

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

type DotNotationKeys = DotNotationMap<Model>;

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

#### `VariadicDotNotationMap<T extends object>`

Flattens an object nested up to 5 levels deep into a record of the nested keys in dot notation, with the values preserved.

```ts
type Model = {
  id: string,
  child: {
    id: string,
    children: {
     id: string,
     name: string
    }[]
  }
}

type DotNotatedModel = VariadicDotNotationMap<Model>;

// FlattenedModel is equivalent to the below
type FlatModel = {
  "$": string | typeof Model.child,
  "id": string,
  "child": { id: string, children: { id: string, name: string }[] },
  "child.$": string | typeof Model.child[0].children,
  "child.id": string,
  "child.children": { id: string, name: string }[],
  "child.children.$": { id: string, name: string }
  "child.children.$.id": string,
  "child.children.$.name": string
}
```

#### `NonObjectKeysOf<T extends object>`

Returns the keys of `T` that are primitives.

#### `ObjectKeysOf<T extends object>`

Returns the keys of `T` that are objects or object-like.

#### `PrependObjectKeysWith<T extends object, Key extends string>`

Creates a new object from `T` with the keys prepended with `Key`. If `Key` is an empty key, this just returns `T`.

#### `UnionToIntersection<T extends object>`

If `T` is a union of objects, converts `T` to an intersection between all of the objects unioned in `T`.

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

Type-safe accessor function for objects with **known keys and values**.

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
  { path: "dean.name" }
); // type: string. Value: Ashley Banks

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
); // type: { id: string, name: string }. Value: { id: "a88p", name: "Hillary King Banks" }
```

Limitations

- This only works on fully known object types (e.g., where properties of the object are all known at compile time)
- If values aren't fully known, this may not work properly.
- You can't use variables for accessing properties. If you want this functionality, we have basic support in `variadicGet`. For more complex examples, type safety cannot guaranteed at compile time. Use `lodash.get` and runtime checks for these scenarios.

#### `variadicGet`

Variadic get is useful when you have a known object, but need to access properties of the object by some variable property or properties.

```ts
const person = {
  id: "a10023b",
  name: "Carlton Banks",
  dean: {
    id: "p93i",
    name: "Ashley Banks",
  },
};

const nameOrId = urlParams.get("property");

const personNameOrId = get(person, { path: "$", slots: [nameOrId] }); // type: string. Value: either "a10023b" or "Carlton Banks"
```

Limitations:

- Variadics won't properly type check on sub-objects of non-array properties. This may be possible, but it creates a huge problem when dealing with objects of any size, as every possible combination of properties on each object and sub-object has to be full mapped out.
