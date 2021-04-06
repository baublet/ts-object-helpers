import { DotNotationMap, DotNotationKeys } from "./DotNotationMap";

type SimpleModel = {
  id: string;
  tags: string[];
  child: {
    num: number;
    bool: boolean;
  };
  ids: { id: string }[];
};

const simpleKey: DotNotationKeys<SimpleModel> = "ids.$.id";
const rootLevelTest: DotNotationMap<SimpleModel> = {
  $: {
    bool: true,
    num: 1,
  },
  id: "id",
  ids: [
    { id: "test" },
    // @ts-expect-error
    { id: 1 },
    { id: "3" },
    // @ts-expect-error
    undefined
  ],
  tags: [
    "test",
    // @ts-expect-error
    1,
  ],
};
const rootLevelTest2: Partial<DotNotationMap<SimpleModel>> = {
  $: "id",
};

type ComplexModel = {
  root: string;
  a: {
    hello: string;
  };
  super: {
    deeply: {
      nested: {
        yo: { id: string }[];
      };
    };
  };
  stringArray: string[];
  arrayNode: {
    id?: string;
    super: "duper";
    nestedObject: {
      hello: string;
      world: number;
      stringArray: string[];
      objectArray: { id: string }[];
    };
  }[];
};

const test: DotNotationMap<ComplexModel> = {
  root: "kappa",
  arrayNode: [
    {
      id: "",
      super: "duper",
      nestedObject: {
        hello: "world",
        world: 42,
        objectArray: [{ id: "test" }],
        stringArray: ["wow"],
      },
    },
  ],
  "a.hello": "a.hello",
  "arrayNode.$": {
    id: "",
    super: "duper",
    nestedObject: {
      hello: "world",
      world: 42,
      objectArray: [{ id: "test" }],
      stringArray: ["wow"],
    },
  },
  "arrayNode.$.id": "id",
  "arrayNode.$.notHere": "callBackLater",
  "arrayNode.$.nestedObject": {
    hello: "world",
    world: 42,
    objectArray: [
      {
        id: "test",
        // @ts-expect-error
        notHere: "hah",
      },
    ],
    stringArray: ["wow"],
  },

  "arrayNode.$.nestedObject.hello": "world",
  // @ts-expect-error
  "arrayNode.$.notARealProperty": "test",
  "arrayNode.$.nestedObject.objectArray": [{ id: "test" }],
  "arrayNode.$.nestedObject.objectArray.$": { id: "test" },
  // @ts-expect-error
  "arrayNode.$.nestedObject.objectArray.$.notARealProperty": "id",
  "arrayNode.$.nestedObject.objectArray.$.id": "id",
  "arrayNode.$.nestedObject.stringArray": [""],
  "arrayNode.$.nestedObject.stringArray.$": "string",
  "arrayNode.$.nestedObject.world": 42,
  "arrayNode.$.super": "duper",
  "super.deeply": {
    nested: {
      yo: [{ id: "" }],
    },
  },
  "super.deeply.nested": { yo: [{ id: "" }] },
  "super.deeply.nested.yo": [{ id: "" }],
  "super.deeply.nested.yo.$": { id: "" },
  "super.deeply.nested.yo.$.id": "id",
  a: { hello: "world" },
  super: {
    deeply: {
      nested: {
        yo: [
          {
            id: "",
            // @ts-expect-error
            notHere: "oops",
          },
        ],
      },
    },
  },
};

const key: DotNotationKeys<ComplexModel> = "stringArray.$";
const inferredFromMap: DotNotationMap<ComplexModel>[typeof key] = "";
// @ts-expect-error
const invalidInference: DotNotationMap<ComplexModel>[typeof key] = 1;
const key2: DotNotationKeys<ComplexModel> = "$";

type PartialModelTest = {
  test: 123;
  nested: {
    for?: 123;
  };
};

const partialModelTestProperties: DotNotationKeys<PartialModelTest>[] = [
  "test",
  "nested.for",
  "nested",
  // @ts-expect-error
  "nope",
];
// @ts-expect-error
const partialPropertyErrorTest: DotNotationKeys<PartialModelTest>[] = ["wrong"];
const nestedPartial: DotNotationMap<PartialModelTest>["nested.for"] = 123;
const nestedPartialUndefined: DotNotationMap<PartialModelTest>["nested.for"] = undefined;
// @ts-expect-error
const invalidNestedPartial: DotNotationMap<PartialModelTest>["nested.for"] =
  "123";
