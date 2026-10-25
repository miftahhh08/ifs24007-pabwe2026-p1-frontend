import { apiRequest, hasAuthSession, setAuthToken, removeAuthToken } from "./apiHelper";

const okResponse = (data: unknown) => ({ ok: true, json: async () => ({ data }) }) as Response;

describe("apiRequest", () => {
  afterEach(() => vi.restoreAllMocks());

  it("GET dengan query dan mengabaikan nilai undefined", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(okResponse([1]));
    const data = await apiRequest("/api/foods", { query: { q: "teh", x: undefined } });
    expect(data).toEqual([1]);
    expect(spy.mock.calls[0][0]).toContain("/api/foods?q=teh");
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

  it("mengirim request lewat /api/proxy tanpa header Authorization", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(okResponse({}));
    await apiRequest("/api/auth/me");
    expect(spy.mock.calls[0][0]).toBe("/api/proxy/api/auth/me");
    expect(spy.mock.calls[0][1]?.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("setAuthToken mengirim token ke /api/session dan menandai sesi aktif", async () => {
    localStorage.clear();
    expect(hasAuthSession()).toBe(false);
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response);
    await setAuthToken("rahasia-123");
    expect(spy).toHaveBeenCalledWith("/api/session", expect.objectContaining({ method: "POST" }));
    expect(hasAuthSession()).toBe(true);
    // token tidak boleh tersimpan di storage maupun cookie yang bisa dibaca JS
    expect(JSON.stringify({ ...localStorage })).not.toContain("rahasia-123");
    expect(document.cookie).not.toContain("rahasia-123");
  });

  it("setAuthToken melempar error dan tidak menandai sesi jika server menolak", async () => {
    localStorage.clear();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response);
    await expect(setAuthToken("x")).rejects.toThrow("Gagal menyimpan sesi login");
    expect(hasAuthSession()).toBe(false);
  });

  it("removeAuthToken menghapus penanda dan tetap aman saat jaringan gagal", async () => {
    localStorage.setItem("gulasadar:session", "1");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("offline"));
    await expect(removeAuthToken()).resolves.toBeUndefined();
    expect(hasAuthSession()).toBe(false);
  });

  it("hasAuthSession aman saat storage error", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
      throw new Error("storage error");
    });
    expect(hasAuthSession()).toBe(false);
  });
});
