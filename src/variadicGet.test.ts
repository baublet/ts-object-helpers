import { variadicGet } from "./variadicGet";

describe("basics", () => {
  it("accesses basic properties", () => {
    expect(
      variadicGet(
        {
          test: 123,
        },
        {
          path: "test",
        }
      )
    ).toEqual(123);
  });

  it("accesses nested properties", () => {
    expect(
      variadicGet(
        {
          test: {
            floofer: "nooter",
          },
        },
        {
          path: "test",
        }
      )
    ).toEqual({
      floofer: "nooter",
    });

    expect(
      variadicGet(
        {
          test: {
            floofer: "nooter",
          },
        },
        {
          path: "test.floofer",
        }
      )
    ).toEqual("nooter");
  });

  it("accesses array properties", () => {
    expect(
      variadicGet(
        {
          test: {
            floofer: ["nooter"],
          },
        },
        {
          path: "test.floofer",
        }
      )
    ).toEqual(["nooter"]);
  });
});

describe("slots", () => {
  it("accesses properties by slots", () => {
    expect(
      variadicGet(
        {
          test: {
            floofer: ["nooter", "scooter"],
          },
        },
        {
          path: "test.floofer.$",
          slots: [1],
        }
      )
    ).toEqual("scooter");
  });
});

it("throws if the slots don't align", () => {
  const obj = {
    test: {
      nested: 123,
    },
  };
  expect(() => {
    variadicGet(obj, {
      path: "test.$",
      slots: [],
    });
  }).toThrow();
});

it("doesn't throw if slots are truthy, but they didn't pass a path that needs them", () => {
  const obj = {
    test: {
      nested: 123,
    },
  };
  expect(() => {
    variadicGet(obj, {
      path: "test",
      slots: [],
    });
  }).not.toThrow();
});
