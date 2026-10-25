import type { UnknownAction } from "@reduxjs/toolkit";
import type { GlucoseLog, StatsData } from "@/types";
import { HealthActionType, type HealthAction } from "./action";

export interface GlucoseState {
  logs: GlucoseLog[];
  /** false sampai permintaan pertama selesai (berhasil maupun gagal). */
  loaded: boolean;
}

const INITIAL_GLUCOSE: GlucoseState = { logs: [], loaded: false };

export function glucoseReducer(state: GlucoseState = INITIAL_GLUCOSE, action: UnknownAction): GlucoseState {
  const a = action as unknown as HealthAction;
  switch (a.type) {
    case HealthActionType.RECEIVE_GLUCOSE:
      return { logs: a.payload.logs, loaded: true };
    case HealthActionType.MARK_GLUCOSE_LOADED:
      return { ...state, loaded: true };
    default:
      return state;
  }
}

export function statsReducer(stats: StatsData | null = null, action: UnknownAction): StatsData | null {
  const a = action as unknown as HealthAction;
  return a.type === HealthActionType.RECEIVE_STATS ? a.payload.stats : stats;
}
