import { variadicGet } from "./variadicGet";

describe("basics", () => {
  it("accesses basic properties", () => {
    expect(
      variadicGet({
        object: {
          test: 123,
        },
        path: "test",
      })
    ).toEqual(123);
  });

  it("accesses nested properties", () => {
    expect(
      variadicGet({
        object: {
          test: {
            floofer: "nooter",
          },
        },
        path: "test",
      })
    ).toEqual({
      floofer: "nooter",
    });

    expect(
      variadicGet({
        object: {
          test: {
            floofer: "nooter",
          },
        },
        path: "test.floofer",
      })
    ).toEqual("nooter");
  });

  it("accesses array properties", () => {
    expect(
      variadicGet({
        object: {
          test: {
            floofer: ["nooter"],
          },
        },
        path: "test.floofer",
      })
    ).toEqual(["nooter"]);
  });
});

describe("slots", () => {
  it("accesses properties by slots", () => {
    expect(
      variadicGet({
        object: {
          test: {
            floofer: ["nooter", "scooter"],
          },
        },
        path: "test.floofer.$",
        slots: [1],
      })
    ).toEqual("scooter");
  });
});
