import type { UnknownAction } from "@reduxjs/toolkit";
import type { Food } from "@/types";
import { receiveFoodsAction, setIsFoodsAction } from "./action";
import { foodsReducer, isFoodsReducer } from "./reducer";

const unknown = { type: "LAIN" } as UnknownAction;
const food = { id: "a" } as Food;

describe("foods reducer", () => {
  it("foodsReducer", () => {
    expect(foodsReducer(undefined, unknown)).toEqual([]);
    expect(foodsReducer([], receiveFoodsAction([food]) as unknown as UnknownAction)).toEqual([food]);
  });

  it("isFoodsReducer", () => {
    expect(isFoodsReducer(undefined, unknown)).toBe(false);
    expect(isFoodsReducer(false, setIsFoodsAction(true) as unknown as UnknownAction)).toBe(true);
  });
});
