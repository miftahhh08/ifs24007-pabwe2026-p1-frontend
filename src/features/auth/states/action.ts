import type { ThunkAppDispatch } from "@/types/action";
import type { LoginInput, RegisterInput, User } from "@/types";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { getErrorMessage } from "@/helpers/errorHelper";
import { hasAuthSession, removeAuthToken } from "@/helpers/apiHelper";
import { getMeApi, loginApi, logoutApi, registerApi } from "../api/authApi";
import { asyncSetToday } from "@/features/logs/states/action";

export const AuthActionType = {
  SET_AUTH_USER: "SET_AUTH_USER",
  SET_IS_AUTH_LOADING: "SET_IS_AUTH_LOADING",
} as const;

export type AuthAction =
  | { type: typeof AuthActionType.SET_AUTH_USER; payload: { user: User | null } }
  | { type: typeof AuthActionType.SET_IS_AUTH_LOADING; payload: { isLoading: boolean } };

export function setAuthUserAction(user: User | null): AuthAction {
  return { type: AuthActionType.SET_AUTH_USER, payload: { user } };
}

export function setIsAuthLoadingAction(isLoading: boolean): AuthAction {
  return { type: AuthActionType.SET_IS_AUTH_LOADING, payload: { isLoading } };
}

export function asyncCheckAuth() {
  return async (dispatch: ThunkAppDispatch) => {
    if (!hasAuthSession()) return;
    dispatch(setIsAuthLoadingAction(true));
    try {
      const user = await getMeApi();
      dispatch(setAuthUserAction(user));
    } catch {
      await removeAuthToken();
      dispatch(setAuthUserAction(null));
    } finally {
      dispatch(setIsAuthLoadingAction(false));
    }
  };
}

export function asyncRegister(input: RegisterInput, onSuccess?: () => void) {
  return async (dispatch: ThunkAppDispatch) => {
    dispatch(setIsAuthLoadingAction(true));
    try {
      const res = await registerApi(input);
      dispatch(setAuthUserAction(res.user));
      showSuccessDialog(`Selamat datang, ${res.user.name}!`);
      onSuccess?.();
      await dispatch(asyncSetToday());
    } catch (error) {
      showErrorDialog(getErrorMessage(error));
    } finally {
      dispatch(setIsAuthLoadingAction(false));
    }
  };
}

export function asyncLogin(input: LoginInput, onSuccess?: () => void) {
  return async (dispatch: ThunkAppDispatch) => {
    dispatch(setIsAuthLoadingAction(true));
    try {
      const res = await loginApi(input);
      dispatch(setAuthUserAction(res.user));
      showSuccessDialog(`Berhasil masuk sebagai ${res.user.name}`);
      onSuccess?.();
      await dispatch(asyncSetToday());
    } catch (error) {
      showErrorDialog(getErrorMessage(error));
    } finally {
      dispatch(setIsAuthLoadingAction(false));
    }
  };
}

export function asyncLogout() {
  return async (dispatch: ThunkAppDispatch) => {
    dispatch(setIsAuthLoadingAction(true));
    try {
      await logoutApi();
      dispatch(setAuthUserAction(null));
      showSuccessDialog("Berhasil keluar");
      await dispatch(asyncSetToday());
    } catch (error) {
      showErrorDialog(getErrorMessage(error));
    } finally {
      dispatch(setIsAuthLoadingAction(false));
    }
  };
}
