import type { ThunkAppDispatch } from "@/types/action";
import type { Food } from "@/types";
import { reportError } from "@/helpers/errorHelper";
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

/** Mengambil beberapa makanan berdasarkan id (urutan mengikuti `ids`); kosong bila gagal. */
export function asyncGetFoodsByIds(ids: string[]) {
  return async (): Promise<Food[]> => {
    try {
      const all = await searchFoods("");
      return ids.map((id) => all.find((f) => f.id === id)).filter((f): f is Food => Boolean(f));
    } catch {
      return [];
    }
  };
}

export function asyncSetFoods(q: string) {
  return async (dispatch: ThunkAppDispatch) => {
    dispatch(setIsFoodsAction(true));
    try {
      dispatch(receiveFoodsAction(await searchFoods(q)));
    } catch (error) {
      reportError(error);
    } finally {
      dispatch(setIsFoodsAction(false));
    }
  };
}
