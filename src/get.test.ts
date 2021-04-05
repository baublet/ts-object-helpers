import { get } from "./get";

it("returns the right value from a known object type", () => {
  expect(
    get(
      {
        id: "id",
      },
      { path: "id" },
      "defaultId"
    )
  ).toEqual("id");
});
