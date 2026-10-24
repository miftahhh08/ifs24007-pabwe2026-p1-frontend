import { apiRequest } from "@/helpers/apiHelper";
import { addLog, deleteLog, getStats, getToday } from "./logApi";

vi.mock("@/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

describe("logApi", () => {
  it("getToday memanggil GET /api/logs/today", async () => {
    await getToday();
    expect(apiRequest).toHaveBeenCalledWith("/api/logs/today");
  });

  it("addLog memanggil POST /api/logs", async () => {
    await addLog("es-teh-manis", 2);
    expect(apiRequest).toHaveBeenCalledWith("/api/logs", {
      method: "POST",
      body: { foodId: "es-teh-manis", servings: 2 },
    });
  });

  it("deleteLog memanggil DELETE /api/logs/:id", async () => {
    await deleteLog(7);
    expect(apiRequest).toHaveBeenCalledWith("/api/logs/7", { method: "DELETE" });
  });

  it("getStats memanggil GET /api/logs/stats", async () => {
    await getStats();
    expect(apiRequest).toHaveBeenCalledWith("/api/logs/stats");
  });
});
