import {
  PartialKeys,
  PartialKeysToRequiredOrUndefined,
} from "./PartialKeysToRequiredOrUndefined";

type PartialKeyTestModel = {
  normalPartial?: string;
  partialPlusUndefined?: string | undefined;
  requiredPartial: string | undefined;
  required: string;
};

type PartialKeysTestModelKeys = PartialKeys<PartialKeyTestModel>;
const pkeysTest: PartialKeysTestModelKeys[] = [
  "normalPartial",
  "partialPlusUndefined",
  // @ts-expect-error
  "required",
];

type Test = {
  partial?: string;
  required: string;
  explicitPartial?: string | undefined;
  andThis: string | undefined;
  rootArray: string[];
  rootPartialArray?: string[];
  nested?: {
    deeply?: {
      normalPartial?: string;
      partialPlusUndefined?: string | undefined;
      requiredPartial: string | undefined;
      required: string;
    };
  };
};

type PartialToRequired = PartialKeysToRequiredOrUndefined<Test>;

// @ts-expect-error
const p2r5: PartialToRequired = {
  required: "test",
  andThis: undefined,
  partial: undefined,
};

const p2r0: PartialToRequired = {
  required: "test",
  andThis: undefined,
  explicitPartial: "string",
  partial: undefined,
  nested: undefined,
  rootArray: [""],
  rootPartialArray: undefined,
};

const p2r1: PartialToRequired = {
  required: "test",
  andThis: undefined,
  explicitPartial: "string",
  partial: undefined,
  nested: {
    deeply: {
      normalPartial: undefined,
      required: "string",
      requiredPartial: undefined,
      partialPlusUndefined: "part",
    },
  },
  rootArray: [""],
  rootPartialArray: [""],
};

const p2r3: PartialToRequired = {
  required: "test",
  andThis: undefined,
  explicitPartial: "string",
  partial: undefined,
  nested: {
    // @ts-expect-error
    deeply: {
      normalPartial: undefined,
      required: "string",
      requiredPartial: undefined,
    },
  },
};

const p2r6: PartialToRequired = {
  required: "test",
  andThis: undefined,
  explicitPartial: "string",
  partial: undefined,
  nested: {
    deeply: undefined,
  },
  rootArray: [""],
  rootPartialArray: undefined,
};

const p2r2: PartialToRequired = {
  // @ts-expect-error
  required: undefined,
  andThis: "andThis",
  explicitPartial: undefined,
  // @ts-expect-error
  partial: 1,
};
