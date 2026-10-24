import type { ThunkAppDispatch } from "@/types/action";
import type { TodayData } from "@/types";
import { showConfirmDialog, showErrorDialog, showSuccessDialog, showUndoToast } from "@/helpers/toolsHelper";
import { addLog, deleteLog, getToday } from "../api/logApi";

export const LogActionType = {
  RECEIVE_TODAY: "RECEIVE_TODAY",
  SET_IS_TODAY: "SET_IS_TODAY",
} as const;

export type LogAction =
  | { type: typeof LogActionType.RECEIVE_TODAY; payload: { today: TodayData } }
  | { type: typeof LogActionType.SET_IS_TODAY; payload: { isToday: boolean } };

export function receiveTodayAction(today: TodayData): LogAction {
  return { type: LogActionType.RECEIVE_TODAY, payload: { today } };
}

export function setIsTodayAction(isToday: boolean): LogAction {
  return { type: LogActionType.SET_IS_TODAY, payload: { isToday } };
}

export function asyncSetToday() {
  return async (dispatch: ThunkAppDispatch) => {
    dispatch(setIsTodayAction(true));
    try {
      dispatch(receiveTodayAction(await getToday()));
    } catch (error) {
      showErrorDialog(error.message);
    } finally {
      dispatch(setIsTodayAction(false));
    }
  };
}

export function asyncAddLog(foodId: string, servings: number) {
  return async (dispatch: ThunkAppDispatch) => {
    try {
      const added = await addLog(foodId, servings);
      await dispatch(asyncSetToday());
      if (await showUndoToast(`${added.food} x${added.servings} dicatat (${added.sugar_g} g gula)`)) {
        await deleteLog(added.id);
        await dispatch(asyncSetToday());
        showSuccessDialog("Catatan dibatalkan");
      }
    } catch (error) {
      showErrorDialog(error.message);
    }
  };
}

export function asyncDeleteLog(id: number) {
  return async (dispatch: ThunkAppDispatch) => {
    if (!(await showConfirmDialog("Hapus catatan?", "Catatan ini akan dihapus dari hari ini."))) return;
    try {
      await deleteLog(id);
      await dispatch(asyncSetToday());
    } catch (error) {
      showErrorDialog(error.message);
    }
  };
}
