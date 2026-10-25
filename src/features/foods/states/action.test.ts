import { showErrorDialog } from "@/helpers/toolsHelper";
import { searchFoods } from "../api/foodApi";
import { FoodActionType, asyncGetFoodsByIds, asyncSetFoods, receiveFoodsAction, setIsFoodsAction } from "./action";
import type { Food } from "@/types";

vi.mock("../api/foodApi", () => ({ searchFoods: vi.fn() }));
vi.mock("@/helpers/toolsHelper", () => ({ showErrorDialog: vi.fn() }));

const food = { id: "a", name: "A" } as Food;

describe("foods action", () => {
  it("action creators membentuk action yang benar", () => {
    expect(receiveFoodsAction([food])).toEqual({ type: FoodActionType.RECEIVE_FOODS, payload: { foods: [food] } });
    expect(setIsFoodsAction(true)).toEqual({ type: FoodActionType.SET_IS_FOODS, payload: { isFoods: true } });
  });

  it("asyncSetFoods sukses: loading, receive, selesai", async () => {
    vi.mocked(searchFoods).mockResolvedValue([food]);
    const dispatch = vi.fn();
    await asyncSetFoods("a")(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(1, setIsFoodsAction(true));
    expect(dispatch).toHaveBeenNthCalledWith(2, receiveFoodsAction([food]));
    expect(dispatch).toHaveBeenNthCalledWith(3, setIsFoodsAction(false));
  });

  it("asyncSetFoods gagal: menampilkan dialog error", async () => {
    vi.mocked(searchFoods).mockRejectedValue(new Error("gagal"));
    const dispatch = vi.fn();
    await asyncSetFoods("a")(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
    expect(dispatch).toHaveBeenLastCalledWith(setIsFoodsAction(false));
  });

  it("asyncGetFoodsByIds mengembalikan makanan sesuai urutan id dan mengabaikan yang tak ada", async () => {
    const b = { id: "b", name: "B" } as Food;
    vi.mocked(searchFoods).mockResolvedValue([food, b]);
    expect(await asyncGetFoodsByIds(["b", "x", "a"])()).toEqual([b, food]);
    expect(searchFoods).toHaveBeenCalledWith("");
  });

  it("asyncGetFoodsByIds mengembalikan daftar kosong bila gagal", async () => {
    vi.mocked(searchFoods).mockRejectedValue(new Error("gagal"));
    expect(await asyncGetFoodsByIds(["a"])()).toEqual([]);
  });
});
