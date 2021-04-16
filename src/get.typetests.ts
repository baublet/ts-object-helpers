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
} as const;

const fierstein = get(
  fixtureData,
  "characters.2.actor"
);
