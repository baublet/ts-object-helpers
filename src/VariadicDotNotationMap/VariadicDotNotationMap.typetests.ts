import { VariadicDotNotationMap, VariadicDotNotationKeys } from "./VariadicDotNotationMap";

type SimpleModel = {
  id: string;
  child: {
    num: number;
    bool: boolean;
  };
};

const simpleKey: VariadicDotNotationKeys<SimpleModel> = "child.$";
const rootLevelTest: Partial<VariadicDotNotationMap<SimpleModel>> = {
  $: {
    num: 1,
    bool: true,
  },
};
const rootLevelTest2: Partial<VariadicDotNotationMap<SimpleModel>> = {
  $: "id",
};

type ComplexModel = {
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
  arrayNode: {
    id: string;
    super: "duper";
    nestedObject: {
      hello: string;
      world: number;
      stringArray: string[];
      objectArray: { id: string }[];
    };
  }[];
};

const test: VariadicDotNotationMap<ComplexModel> = {
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
  "arrayNode.$.nestedObject.objectArray": [{ id: "test" }],
  "arrayNode.$.nestedObject.objectArray.$": { id: "test" },
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
        yo: [{ id: "" }],
      },
    },
  },
};

const key: VariadicDotNotationKeys<ComplexModel> =
  "arrayNode.$.nestedObject.stringArray";
const inferredFromMap: VariadicDotNotationMap<ComplexModel>[typeof key] = [""];
// @ts-expect-error
const invalidInference: VariadicDotNotationMap<ComplexModel>[typeof key] = 1;
const key2: VariadicDotNotationKeys<ComplexModel> = "$";

type PartialModelTest =
  | undefined
  | {
      test: 123;
      nested: {
        for?: 123;
      };
    };

const partialProperties: VariadicDotNotationKeys<PartialModelTest>[] = [
  "test",
  "nested.for",
  "nested",
];
// @ts-expect-error
const partialPropertyErrorTest: DotNotationKeys<PartialModelTest>[] = ["wrong"];
