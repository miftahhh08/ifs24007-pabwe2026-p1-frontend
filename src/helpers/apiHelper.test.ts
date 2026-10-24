import { apiRequest, getAuthToken, setAuthToken, removeAuthToken } from "./apiHelper";

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

  it("menyimpan, membaca, dan menghapus auth token", () => {
    localStorage.clear();
    expect(getAuthToken()).toBeNull();
    setAuthToken("my-token-123");
    expect(getAuthToken()).toBe("my-token-123");
    removeAuthToken();
    expect(getAuthToken()).toBeNull();

    vi.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
      throw new Error("storage error");
    });
    expect(getAuthToken()).toBeNull();

    vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new Error("storage error");
    });
    expect(() => setAuthToken("x")).not.toThrow();

    vi.spyOn(Storage.prototype, "removeItem").mockImplementationOnce(() => {
      throw new Error("storage error");
    });
    expect(() => removeAuthToken()).not.toThrow();

    const origWindow = globalThis.window;
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    expect(getAuthToken()).toBeNull();
    expect(() => setAuthToken("x")).not.toThrow();
    expect(() => removeAuthToken()).not.toThrow();
    globalThis.window = origWindow;
  });

  it("menyertakan header Authorization saat auth token ada", async () => {
    setAuthToken("secret-token");
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(okResponse({}));
    await apiRequest("/api/auth/me");
    expect(spy.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer secret-token",
    });
    removeAuthToken();
  });
});
