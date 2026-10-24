import { makeStore, store } from "./store";

describe("store", () => {
  it("memiliki state awal yang benar", () => {
    expect(store.getState()).toEqual({
      foods: [],
      isFoods: false,
      today: null,
      isToday: false,
      authUser: null,
      isAuthLoading: false,
    });
  });

  it("makeStore menerima preloadedState", () => {
    expect(makeStore({ isFoods: true }).getState().isFoods).toBe(true);
  });
});
