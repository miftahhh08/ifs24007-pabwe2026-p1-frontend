import { apiRequest } from "@/helpers/apiHelper";
import * as api from "./healthApi";
import type { RiskInput } from "@/types";

vi.mock("@/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

describe("healthApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("memanggil endpoint yang benar", async () => {
    await api.calcLabel(10, 2, 1);
    expect(apiRequest).toHaveBeenCalledWith("/api/label", { method: "POST", body: { sugarPerServingG: 10, servingsPerPack: 2, consumedServings: 1 } });
    const input = { age: 30 } as RiskInput;
    await api.assessRisk(input);
    expect(apiRequest).toHaveBeenCalledWith("/api/risk", { method: "POST", body: input });
    await api.addGlucose(100, "puasa");
    expect(apiRequest).toHaveBeenCalledWith("/api/glucose", { method: "POST", body: { value: 100, context: "puasa" } });
    await api.getGlucose();
    expect(apiRequest).toHaveBeenCalledWith("/api/glucose");
    await api.deleteGlucose(3);
    expect(apiRequest).toHaveBeenCalledWith("/api/glucose/3", { method: "DELETE" });
    await api.sendChat("halo");
    expect(apiRequest).toHaveBeenCalledWith("/api/chat", { method: "POST", body: { message: "halo" } });
    await api.identifyPhoto("abc", "image/png", "sample.png", "soda");
    expect(apiRequest).toHaveBeenCalledWith("/api/foods/identify", {
      method: "POST",
      body: { image: "abc", mediaType: "image/png", filename: "sample.png", hint: "soda" },
    });
  });

  describe("getChatStatus", () => {
    it("sukses memanggil /api/ai/status dengan mode cloud", async () => {
      vi.mocked(apiRequest).mockResolvedValueOnce({
        enabled: true,
        provider: "gemini",
        mode: "cloud",
        suggestions: ["Saran 1"],
      });

      const res = await api.getChatStatus();
      expect(apiRequest).toHaveBeenCalledWith("/api/ai/status");
      expect(res).toEqual({
        mode: "ai",
        provider: "gemini",
        suggestions: ["Saran 1"],
      });
    });

    it("memetakan mode local ke rules dan memakai saran default jika kosong", async () => {
      vi.mocked(apiRequest).mockResolvedValueOnce({
        enabled: true,
        provider: "local",
        mode: "local",
      });

      const res = await api.getChatStatus();
      expect(apiRequest).toHaveBeenCalledWith("/api/ai/status");
      expect(res.mode).toBe("rules");
      expect(res.provider).toBeNull();
      expect(res.suggestions).toEqual(api.DEFAULT_CHAT_SUGGESTIONS);
    });

    it("fallback ke /api/chat/status jika /api/ai/status gagal", async () => {
      vi.mocked(apiRequest)
        .mockRejectedValueOnce(new Error("404"))
        .mockResolvedValueOnce({
          mode: "ai",
          provider: "openai",
          suggestions: ["Pertanyaan A"],
        });

      const res = await api.getChatStatus();
      expect(apiRequest).toHaveBeenNthCalledWith(1, "/api/ai/status");
      expect(apiRequest).toHaveBeenNthCalledWith(2, "/api/chat/status");
      expect(res.mode).toBe("ai");
      expect(res.provider).toBe("openai");
    });

    it("mengembalikan status dasar default jika kedua endpoint gagal", async () => {
      vi.mocked(apiRequest)
        .mockRejectedValueOnce(new Error("404"))
        .mockRejectedValueOnce(new Error("500"));

      const res = await api.getChatStatus();
      expect(res).toEqual({
        mode: "rules",
        provider: null,
        suggestions: api.DEFAULT_CHAT_SUGGESTIONS,
      });
    });
  });
});
