import type { UnknownAction } from "@reduxjs/toolkit";
import type { TodayData } from "@/types";
import { receiveTodayAction, setIsTodayAction } from "./action";
import { isTodayReducer, todayReducer } from "./reducer";

const unknown = { type: "LAIN" } as UnknownAction;
const today: TodayData = { total_sugar_g: 5, limit_g: 50, percent: 10, logs: [] };

describe("logs reducer", () => {
  it("todayReducer", () => {
    expect(todayReducer(undefined, unknown)).toBeNull();
    expect(todayReducer(null, receiveTodayAction(today) as unknown as UnknownAction)).toEqual(today);
  });

  it("isTodayReducer", () => {
    expect(isTodayReducer(undefined, unknown)).toBe(false);
    expect(isTodayReducer(false, setIsTodayAction(true) as unknown as UnknownAction)).toBe(true);
  });
});
