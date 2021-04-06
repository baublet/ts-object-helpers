import { get } from "./get";

const fixtureData = {
  name: "Mulan",
  characters: [
    {
      name: "Mulan",
      role: "lead",
      actor: "Ming-Na Wen",
      mother: {
        name: "Fa Li",
        actor: "Freda Foh Shen",
      },
      father: {
        name: "Fa Zhou",
        actor: "Soon-Tek Oh",
      },
    },
    {
      name: "General Chang",
      role: "supporting",
      actor: "BD Wong",
    },
    {
      name: "Yao",
      role: "supporting",
      actor: "Harvey Fierstein",
    },
  ],
};

const maybeFiersteinOrNumeric = get(
  fixtureData,
  {
    path: "characters.$.name",
    slots: [2],
  },
  1
);

const possibleValues: typeof maybeFiersteinOrNumeric[] = [
  "Harvey Fierstein",
  1,
];

type DeepPartial =
  | undefined
  | {
      logs?: {
        phase0: string;
        userDefined?: string[];
      };
    };

const deepPartial: DeepPartial = {
  logs: {
    phase0: "test",
  },
};

const result = get(deepPartial, "logs");
type ResultType = typeof result;
// @ts-expect-error
const resultShouldFail: ResultType = "fail";
const resultShouldFail2: ResultType = {
  phase0: "123",
  // @ts-expect-error
  userDefined: ["123", 123],
};
const resultShouldSucceed: ResultType = undefined;
const resultShouldSucceed2: ResultType = {
  phase0: "test",
  userDefined: ["test 123", "test 321"],
};
const resultShouldSucceed3: ResultType = {
  phase0: "test",
  userDefined: []
};
