import type { UnknownAction } from "@reduxjs/toolkit";
import type { TodayData } from "@/types";
import { LogActionType, type LogAction } from "./action";

export function todayReducer(today: TodayData | null = null, action: UnknownAction): TodayData | null {
  const a = action as unknown as LogAction;
  return a.type === LogActionType.RECEIVE_TODAY ? a.payload.today : today;
}

export function isTodayReducer(isToday = false, action: UnknownAction): boolean {
  const a = action as unknown as LogAction;
  return a.type === LogActionType.SET_IS_TODAY ? a.payload.isToday : isToday;
}
