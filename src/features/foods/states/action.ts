import type { ThunkAppDispatch } from "@/types/action";
import type { Food } from "@/types";
import { showErrorDialog } from "@/helpers/toolsHelper";
import { searchFoods } from "../api/foodApi";

export const FoodActionType = {
  RECEIVE_FOODS: "RECEIVE_FOODS",
  SET_IS_FOODS: "SET_IS_FOODS",
} as const;

export type FoodAction =
  | { type: typeof FoodActionType.RECEIVE_FOODS; payload: { foods: Food[] } }
  | { type: typeof FoodActionType.SET_IS_FOODS; payload: { isFoods: boolean } };

export function receiveFoodsAction(foods: Food[]): FoodAction {
  return { type: FoodActionType.RECEIVE_FOODS, payload: { foods } };
}

export function setIsFoodsAction(isFoods: boolean): FoodAction {
  return { type: FoodActionType.SET_IS_FOODS, payload: { isFoods } };
}

export function asyncSetFoods(q: string) {
  return async (dispatch: ThunkAppDispatch) => {
    dispatch(setIsFoodsAction(true));
    try {
      dispatch(receiveFoodsAction(await searchFoods(q)));
    } catch (error) {
      showErrorDialog(error.message);
    } finally {
      dispatch(setIsFoodsAction(false));
    }
  };
}
