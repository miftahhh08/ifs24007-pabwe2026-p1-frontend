import { showConfirmDialog, showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { getStats } from "@/features/logs/api/logApi";
import {
  addGlucose, assessRisk, calcLabel, deleteGlucose, getChatStatus, getGlucose, identifyPhoto, sendChat,
} from "../api/healthApi";
import {
  HealthActionType,
  asyncAddGlucose,
  asyncAssessRisk,
  asyncCalcLabel,
  asyncDeleteGlucose,
  asyncGetChatStatus,
  asyncIdentifyPhoto,
  asyncSendChat,
  asyncSetGlucose,
  asyncSetStats,
  markGlucoseLoadedAction,
  receiveGlucoseAction,
  receiveStatsAction,
} from "./action";

vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
}));
vi.mock("@/features/logs/api/logApi", () => ({ getStats: vi.fn() }));
vi.mock("../api/healthApi", () => ({
  addGlucose: vi.fn(), assessRisk: vi.fn(), calcLabel: vi.fn(), deleteGlucose: vi.fn(),
  getChatStatus: vi.fn(), getGlucose: vi.fn(), identifyPhoto: vi.fn(), sendChat: vi.fn(),
}));

const log = { id: 1, value: 95, context: "puasa" as const, category: "normal", measured_at: "2026-10-23 08:00:00" };

describe("health action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("action creators bekerja sesuai payload", () => {
    expect(receiveGlucoseAction([log])).toEqual({ type: HealthActionType.RECEIVE_GLUCOSE, payload: { logs: [log] } });
    expect(markGlucoseLoadedAction()).toEqual({ type: HealthActionType.MARK_GLUCOSE_LOADED });
    const stats = { limit_g: 50, streak: 1, days: [] };
    expect(receiveStatsAction(stats)).toEqual({ type: HealthActionType.RECEIVE_STATS, payload: { stats } });
  });

  describe("glucose", () => {
    it("asyncSetGlucose menyimpan riwayat, dan menandai selesai muat saat gagal", async () => {
      const dispatch = vi.fn();
      vi.mocked(getGlucose).mockResolvedValueOnce([log]);
      await asyncSetGlucose()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(receiveGlucoseAction([log]));

      vi.mocked(getGlucose).mockRejectedValueOnce(new Error("muat gagal"));
      await asyncSetGlucose()(dispatch);
      expect(showErrorDialog).toHaveBeenCalledWith("muat gagal");
      expect(dispatch).toHaveBeenLastCalledWith(markGlucoseLoadedAction());
    });

    it("asyncAddGlucose mengembalikan hasil lalu memuat ulang riwayat", async () => {
      const added = { id: 1, value: 95, context: "puasa" as const, category: "normal", note: "ok" };
      vi.mocked(addGlucose).mockResolvedValue(added);
      const dispatch = vi.fn();
      expect(await asyncAddGlucose(95, "puasa")(dispatch)).toEqual(added);
      expect(addGlucose).toHaveBeenCalledWith(95, "puasa");
      expect(showSuccessDialog).toHaveBeenCalledWith("Catatan tersimpan");
      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    it("asyncAddGlucose mengembalikan null dan tidak memuat ulang saat gagal", async () => {
      vi.mocked(addGlucose).mockRejectedValue(new Error("simpan gagal"));
      const dispatch = vi.fn();
      expect(await asyncAddGlucose(95, "puasa")(dispatch)).toBeNull();
      expect(showErrorDialog).toHaveBeenCalledWith("simpan gagal");
      expect(dispatch).not.toHaveBeenCalled();
    });

    it("asyncDeleteGlucose: batal, sukses, dan gagal", async () => {
      const dispatch = vi.fn();
      vi.mocked(showConfirmDialog).mockResolvedValueOnce(false);
      await asyncDeleteGlucose(1)(dispatch);
      expect(deleteGlucose).not.toHaveBeenCalled();

      vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
      vi.mocked(deleteGlucose).mockResolvedValueOnce({ deleted: true });
      await asyncDeleteGlucose(1)(dispatch);
      expect(deleteGlucose).toHaveBeenCalledWith(1);
      expect(dispatch).toHaveBeenCalledTimes(1);

      dispatch.mockClear();
      vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
      vi.mocked(deleteGlucose).mockRejectedValueOnce(new Error("hapus gagal"));
      await asyncDeleteGlucose(1)(dispatch);
      expect(showErrorDialog).toHaveBeenCalledWith("hapus gagal");
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("stats", () => {
    it("asyncSetStats menyimpan statistik, atau menampilkan error", async () => {
      const stats = { limit_g: 50, streak: 3, days: [] };
      const dispatch = vi.fn();
      vi.mocked(getStats).mockResolvedValueOnce(stats);
      await asyncSetStats()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(receiveStatsAction(stats));

      dispatch.mockClear();
      vi.mocked(getStats).mockRejectedValueOnce(new Error("stat gagal"));
      await asyncSetStats()(dispatch);
      expect(showErrorDialog).toHaveBeenCalledWith("stat gagal");
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("alat bantu tanpa state", () => {
    it.each([
      ["asyncCalcLabel", calcLabel, () => asyncCalcLabel(10, 2, 1)(), [10, 2, 1]],
      ["asyncAssessRisk", assessRisk, () => asyncAssessRisk({ age: 30 } as never)(), [{ age: 30 }]],
      ["asyncSendChat", sendChat, () => asyncSendChat("halo")(), ["halo"]],
      ["asyncGetChatStatus", getChatStatus, () => asyncGetChatStatus()(), []],
      ["asyncIdentifyPhoto", identifyPhoto, () => asyncIdentifyPhoto("b64", "image/png", "a.png", "nasi")(), ["b64", "image/png", "a.png", "nasi"]],
    ] as const)("%s mengembalikan hasil, dan null disertai pesan error saat gagal", async (_name, api, run, args) => {
      const mocked = vi.mocked(api as (...a: unknown[]) => Promise<unknown>);
      mocked.mockResolvedValueOnce({ ok: true });
      expect(await run()).toEqual({ ok: true });
      expect(mocked).toHaveBeenCalledWith(...args);

      mocked.mockRejectedValueOnce(new Error("api gagal"));
      expect(await run()).toBeNull();
      expect(showErrorDialog).toHaveBeenCalledWith("api gagal");
    });
  });
});
