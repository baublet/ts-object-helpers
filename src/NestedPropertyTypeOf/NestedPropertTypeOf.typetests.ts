import { NestedPropertyTypeOf } from "./NestedPropertyTypeOf";

const nestedPropertyTypeOfTestModel = {
  id: "2",
  name: "Subject",
  parent: {
    id: "1",
    name: "Parent",
  },
  children: [
    {
      id: "3",
      name: "Child 1",
    },
    {
      id: "4",
      name: "Child 2",
    },
  ],
};

type Model = typeof nestedPropertyTypeOfTestModel;

type ChildrenType = NestedPropertyTypeOf<Model, "children">;

const childrenType: ChildrenType = [
  {
    id: "1",
    name: "Child",
  },
  {
    // @ts-expect-error
    id: 2,
    // @ts-expect-error
    name: { bunny: "rabbit " },
  },
];
