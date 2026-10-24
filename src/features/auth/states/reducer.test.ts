import { AuthActionType } from "./action";
import { authUserReducer, isAuthLoadingReducer } from "./reducer";

describe("auth reducer", () => {
  it("authUserReducer mengembalikan user yang diterima", () => {
    const user = { id: 1, name: "Budi", email: "budi@example.com" };
    expect(
      authUserReducer(null, {
        type: AuthActionType.SET_AUTH_USER,
        payload: { user },
      })
    ).toEqual(user);

    expect(
      authUserReducer(user, {
        type: AuthActionType.SET_AUTH_USER,
        payload: { user: null },
      })
    ).toBeNull();
  });

  it("isAuthLoadingReducer mengubah status loading", () => {
    expect(
      isAuthLoadingReducer(false, {
        type: AuthActionType.SET_IS_AUTH_LOADING,
        payload: { isLoading: true },
      })
    ).toBe(true);

    expect(
      isAuthLoadingReducer(true, {
        type: "UNKNOWN_ACTION",
      })
    ).toBe(true);
  });
});
