import type { UnknownAction } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { AuthActionType, type AuthAction } from "./action";

export function authUserReducer(user: User | null = null, action: UnknownAction): User | null {
  const a = action as unknown as AuthAction;
  return a.type === AuthActionType.SET_AUTH_USER ? a.payload.user : user;
}

export function isAuthLoadingReducer(isLoading = false, action: UnknownAction): boolean {
  const a = action as unknown as AuthAction;
  return a.type === AuthActionType.SET_IS_AUTH_LOADING ? a.payload.isLoading : isLoading;
}
