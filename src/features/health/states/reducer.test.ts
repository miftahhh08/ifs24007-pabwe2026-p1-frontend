import { glucoseReducer, statsReducer } from "./reducer";
import { markGlucoseLoadedAction, receiveGlucoseAction, receiveStatsAction } from "./action";

const log = { id: 1, value: 95, context: "puasa" as const, category: "normal", measured_at: "2026-10-23 08:00:00" };

describe("health reducer", () => {
  it("glucoseReducer: state awal, menerima riwayat, dan menandai selesai muat", () => {
    const initial = glucoseReducer(undefined, { type: "@@INIT" });
    expect(initial).toEqual({ logs: [], loaded: false });
    expect(glucoseReducer(initial, markGlucoseLoadedAction())).toEqual({ logs: [], loaded: true });
    expect(glucoseReducer(initial, receiveGlucoseAction([log]))).toEqual({ logs: [log], loaded: true });
    expect(glucoseReducer(initial, { type: "LAIN" })).toBe(initial);
  });

  it("statsReducer: state awal null dan menerima statistik", () => {
    expect(statsReducer(undefined, { type: "@@INIT" })).toBeNull();
    const stats = { limit_g: 50, streak: 2, days: [] };
    expect(statsReducer(null, receiveStatsAction(stats))).toBe(stats);
    expect(statsReducer(stats, { type: "LAIN" })).toBe(stats);
  });
});
