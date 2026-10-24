import { apiRequest } from "@/helpers/apiHelper";
import type { AddedLog, StatsData, TodayData } from "@/types";

export function getToday() {
  return apiRequest<TodayData>("/api/logs/today");
}

export function addLog(foodId: string, servings: number) {
  return apiRequest<AddedLog>("/api/logs", { method: "POST", body: { foodId, servings } });
}

export function deleteLog(id: number) {
  return apiRequest<{ deleted: boolean }>(`/api/logs/${id}`, { method: "DELETE" });
}

export function getStats() {
  return apiRequest<StatsData>("/api/logs/stats");
}
