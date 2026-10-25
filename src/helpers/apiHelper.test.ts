import { apiRequest } from "./apiHelper";

const okResponse = (data: unknown) => ({ ok: true, json: async () => ({ data }) }) as Response;

describe("apiRequest", () => {
  afterEach(() => vi.restoreAllMocks());

  it("GET dengan query dan mengabaikan nilai undefined", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(okResponse([1]));
    const data = await apiRequest("/api/foods", { query: { q: "teh", x: undefined } });
    expect(data).toEqual([1]);
    expect(spy.mock.calls[0][0]).toBe("/api/proxy/api/foods?q=teh");
    expect(String(spy.mock.calls[0][0])).not.toContain("x=");
  });

  it("GET tanpa opsi tidak menambah query string", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(okResponse({}));
    await apiRequest("/api/health");
    expect(String(spy.mock.calls[0][0]).endsWith("/api/health")).toBe(true);
  });

  it("POST mengirim body JSON", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(okResponse({ id: 1 }));
    await apiRequest("/api/logs", { method: "POST", body: { foodId: "a" } });
    expect(spy.mock.calls[0][1]?.body).toBe(JSON.stringify({ foodId: "a" }));
    expect(spy.mock.calls[0][1]?.method).toBe("POST");
  });

  it("melempar pesan error dari server", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Makanan tidak ditemukan" }),
    } as Response);
    await expect(apiRequest("/x")).rejects.toThrow("Makanan tidak ditemukan");
  });

  it("memakai pesan default jika respons error bukan JSON", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error("bukan json");
      },
    } as unknown as Response);
    await expect(apiRequest("/x")).rejects.toThrow("Terjadi kesalahan pada server");
  });

  it("melempar pesan jika server tidak terjangkau", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(apiRequest("/x")).rejects.toThrow("Tidak dapat terhubung ke server");
  });

  it("mengirim request ke proxy sisi server dengan header penanda klien", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(okResponse({}));
    await apiRequest("/api/auth/me");
    expect(spy.mock.calls[0][0]).toBe("/api/proxy/api/auth/me");
    expect(spy.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
      "x-requested-with": "GulaSadar",
    });
    expect(spy.mock.calls[0][1]?.credentials).toBe("same-origin");
  });

  it("tidak pernah membawa token di sisi browser", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(okResponse({}));
    await apiRequest("/api/auth/me");
    expect(JSON.stringify(spy.mock.calls[0][1]?.headers)).not.toMatch(/authorization/i);
    expect(sessionStorage.length).toBe(0);
    expect(localStorage.length).toBe(0);
  });
});
