import { showConfirmDialog, showErrorDialog, showSuccessDialog, showUndoToast } from "@/helpers/toolsHelper";
import { addLog, deleteLog, getToday } from "../api/logApi";
import {
  LogActionType,
  asyncAddLog,
  asyncDeleteLog,
  asyncSetToday,
  receiveTodayAction,
  setIsTodayAction,
} from "./action";
import type { TodayData } from "@/types";

vi.mock("../api/logApi", () => ({ getToday: vi.fn(), addLog: vi.fn(), deleteLog: vi.fn() }));
vi.mock("@/helpers/toolsHelper", () => ({
  showConfirmDialog: vi.fn(),
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showUndoToast: vi.fn(),
}));

const today: TodayData = { total_sugar_g: 0, limit_g: 50, percent: 0, logs: [] };

describe("logs action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("action creators", () => {
    expect(receiveTodayAction(today)).toEqual({ type: LogActionType.RECEIVE_TODAY, payload: { today } });
    expect(setIsTodayAction(false)).toEqual({ type: LogActionType.SET_IS_TODAY, payload: { isToday: false } });
  });

  it("asyncSetToday sukses", async () => {
    vi.mocked(getToday).mockResolvedValue(today);
    const dispatch = vi.fn();
    await asyncSetToday()(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(2, receiveTodayAction(today));
    expect(dispatch).toHaveBeenLastCalledWith(setIsTodayAction(false));
  });

  it("asyncSetToday gagal", async () => {
    vi.mocked(getToday).mockRejectedValue(new Error("mati"));
    await asyncSetToday()(vi.fn());
    expect(showErrorDialog).toHaveBeenCalledWith("mati");
  });

  it("asyncAddLog sukses: toast lalu muat ulang", async () => {
    vi.mocked(addLog).mockResolvedValue({ id: 1, food: "Es teh", servings: 2, sugar_g: 40 });
    const dispatch = vi.fn();
    vi.mocked(showUndoToast).mockResolvedValue(false);
    await asyncAddLog("es-teh-manis", 2)(dispatch);
    expect(showUndoToast).toHaveBeenCalledWith("Es teh x2 dicatat (40 g gula)");
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(deleteLog).not.toHaveBeenCalled();
  });

  it("asyncAddLog: Urungkan menghapus catatan yang baru dibuat", async () => {
    vi.mocked(addLog).mockResolvedValue({ id: 9, food: "Es teh", servings: 1, sugar_g: 20 });
    vi.mocked(showUndoToast).mockResolvedValue(true);
    const dispatch = vi.fn();
    await asyncAddLog("es-teh-manis", 1)(dispatch);
    expect(deleteLog).toHaveBeenCalledWith(9);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(showSuccessDialog).toHaveBeenCalledWith("Catatan dibatalkan");
  });

  it("asyncAddLog gagal", async () => {
    vi.mocked(addLog).mockRejectedValue(new Error("ditolak"));
    await asyncAddLog("x", 1)(vi.fn());
    expect(showErrorDialog).toHaveBeenCalledWith("ditolak");
  });

  it("asyncDeleteLog dibatalkan: tidak menghapus", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValue(false);
    const dispatch = vi.fn();
    await asyncDeleteLog(1)(dispatch);
    expect(deleteLog).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("asyncDeleteLog dikonfirmasi: menghapus dan muat ulang", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValue(true);
    vi.mocked(deleteLog).mockResolvedValue({ deleted: true });
    const dispatch = vi.fn();
    await asyncDeleteLog(3)(dispatch);
    expect(deleteLog).toHaveBeenCalledWith(3);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("asyncDeleteLog gagal", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValue(true);
    vi.mocked(deleteLog).mockRejectedValue(new Error("tidak ada"));
    await asyncDeleteLog(3)(vi.fn());
    expect(showErrorDialog).toHaveBeenCalledWith("tidak ada");
  });
});
