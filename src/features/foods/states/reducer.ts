import type { UnknownAction } from "@reduxjs/toolkit";
import type { Food } from "@/types";
import { FoodActionType, type FoodAction } from "./action";

export function foodsReducer(foods: Food[] = [], action: UnknownAction): Food[] {
  const a = action as unknown as FoodAction;
  return a.type === FoodActionType.RECEIVE_FOODS ? a.payload.foods : foods;
}

export function isFoodsReducer(isFoods = false, action: UnknownAction): boolean {
  const a = action as unknown as FoodAction;
  return a.type === FoodActionType.SET_IS_FOODS ? a.payload.isFoods : isFoods;
}
