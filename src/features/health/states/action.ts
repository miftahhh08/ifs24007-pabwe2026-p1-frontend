import type { ThunkAppDispatch } from "@/types/action";
import type {
  ChatReply, ChatStatus, GlucoseAdded, GlucoseContext, GlucoseLog, IdentifyResult,
  LabelResult, RiskInput, RiskResult, StatsData,
} from "@/types";
import { showConfirmDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { reportError } from "@/helpers/errorHelper";
import { getStats } from "@/features/logs/api/logApi";
import {
  addGlucose, assessRisk, calcLabel, deleteGlucose, getChatStatus, getGlucose, identifyPhoto, sendChat,
} from "../api/healthApi";

export const HealthActionType = {
  RECEIVE_GLUCOSE: "RECEIVE_GLUCOSE",
  MARK_GLUCOSE_LOADED: "MARK_GLUCOSE_LOADED",
  RECEIVE_STATS: "RECEIVE_STATS",
} as const;

export type HealthAction =
  | { type: typeof HealthActionType.RECEIVE_GLUCOSE; payload: { logs: GlucoseLog[] } }
  | { type: typeof HealthActionType.MARK_GLUCOSE_LOADED }
  | { type: typeof HealthActionType.RECEIVE_STATS; payload: { stats: StatsData } };

export function receiveGlucoseAction(logs: GlucoseLog[]): HealthAction {
  return { type: HealthActionType.RECEIVE_GLUCOSE, payload: { logs } };
}

export function markGlucoseLoadedAction(): HealthAction {
  return { type: HealthActionType.MARK_GLUCOSE_LOADED };
}

export function receiveStatsAction(stats: StatsData): HealthAction {
  return { type: HealthActionType.RECEIVE_STATS, payload: { stats } };
}

/**
 * Menjalankan permintaan ke API dan menampilkan pesan bila gagal.
 * Mengembalikan hasilnya, atau null saat gagal, supaya komponen cukup memeriksa hasil.
 */
async function attempt<T>(request: () => Promise<T>): Promise<T | null> {
  try {
    return await request();
  } catch (error) {
    reportError(error);
    return null;
  }
}

// ---------------------------------------------------------------- catatan gula darah

export function asyncSetGlucose() {
  return async (dispatch: ThunkAppDispatch) => {
    const logs = await attempt(getGlucose);
    dispatch(logs ? receiveGlucoseAction(logs) : markGlucoseLoadedAction());
  };
}

export function asyncAddGlucose(value: number, context: GlucoseContext) {
  return async (dispatch: ThunkAppDispatch): Promise<GlucoseAdded | null> => {
    const added = await attempt(() => addGlucose(value, context));
    if (!added) return null;
    showSuccessDialog("Catatan tersimpan");
    await dispatch(asyncSetGlucose());
    return added;
  };
}

export function asyncDeleteGlucose(id: number) {
  return async (dispatch: ThunkAppDispatch) => {
    if (!(await showConfirmDialog("Hapus catatan?", "Catatan gula darah ini akan dihapus."))) return;
    if ((await attempt(() => deleteGlucose(id))) === null) return;
    await dispatch(asyncSetGlucose());
  };
}

// ---------------------------------------------------------------- statistik

export function asyncSetStats() {
  return async (dispatch: ThunkAppDispatch) => {
    const stats = await attempt(getStats);
    if (stats) dispatch(receiveStatsAction(stats));
  };
}

// ---------------------------------------------------------------- alat bantu (tanpa state tersimpan)

export function asyncCalcLabel(sugarPerServingG: number, servingsPerPack: number, consumedServings: number) {
  return async (): Promise<LabelResult | null> =>
    attempt(() => calcLabel(sugarPerServingG, servingsPerPack, consumedServings));
}

export function asyncAssessRisk(input: RiskInput) {
  return async (): Promise<RiskResult | null> => attempt(() => assessRisk(input));
}

export function asyncSendChat(message: string) {
  return async (): Promise<ChatReply | null> => attempt(() => sendChat(message));
}

export function asyncGetChatStatus() {
  return async (): Promise<ChatStatus | null> => attempt(getChatStatus);
}

export function asyncIdentifyPhoto(image: string, mediaType: string, filename: string, hint: string) {
  return async (): Promise<IdentifyResult | null> =>
    attempt(() => identifyPhoto(image, mediaType, filename, hint));
}
