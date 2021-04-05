import { variadicGet } from "./variadicGet";

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

const maybeFiersteinOrNumeric = variadicGet(
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
