import { apiRequest, removeAuthToken, setAuthToken } from "@/helpers/apiHelper";
import { getMeApi, loginApi, logoutApi, registerApi } from "./authApi";

vi.mock("@/helpers/apiHelper", () => ({
  apiRequest: vi.fn(),
  setAuthToken: vi.fn(),
  removeAuthToken: vi.fn(),
}));

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registerApi memanggil endpoint register dan menyimpan token", async () => {
    const mockRes = { user: { id: 1, name: "Budi", email: "budi@example.com" }, token: "tok-123" };
    vi.mocked(apiRequest).mockResolvedValueOnce(mockRes);

    const input = { name: "Budi", email: "budi@example.com", password: "password123" };
    const res = await registerApi(input);

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/register", {
      method: "POST",
      body: input,
    });
    expect(setAuthToken).toHaveBeenCalledWith("tok-123");
    expect(res).toEqual(mockRes);
  });

  it("loginApi memanggil endpoint login dan menyimpan token", async () => {
    const mockRes = { user: { id: 2, name: "Siti", email: "siti@example.com" }, token: "tok-456" };
    vi.mocked(apiRequest).mockResolvedValueOnce(mockRes);

    const input = { email: "siti@example.com", password: "secret" };
    const res = await loginApi(input);

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      body: input,
    });
    expect(setAuthToken).toHaveBeenCalledWith("tok-456");
    expect(res).toEqual(mockRes);
  });

  it("registerApi dan loginApi menangani respon tanpa token", async () => {
    vi.mocked(apiRequest).mockResolvedValueOnce({ user: { id: 1, name: "Budi", email: "budi@example.com" } } as never);
    await registerApi({ name: "Budi", email: "budi@example.com", password: "123" });
    expect(setAuthToken).not.toHaveBeenCalled();

    vi.mocked(apiRequest).mockResolvedValueOnce({ user: { id: 1, name: "Budi", email: "budi@example.com" } } as never);
    await loginApi({ email: "budi@example.com", password: "123" });
    expect(setAuthToken).not.toHaveBeenCalled();
  });

  it("getMeApi memanggil endpoint me", async () => {
    const mockUser = { id: 1, name: "Budi", email: "budi@example.com" };
    vi.mocked(apiRequest).mockResolvedValueOnce({ user: mockUser });

    const user = await getMeApi();

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/me");
    expect(user).toEqual(mockUser);
  });

  it("logoutApi memanggil endpoint logout dan menghapus token", async () => {
    vi.mocked(apiRequest).mockResolvedValueOnce({ message: "Berhasil keluar" });

    const res = await logoutApi();

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
    });
    expect(removeAuthToken).toHaveBeenCalled();
    expect(res).toEqual({ message: "Berhasil keluar" });
  });

  it("logoutApi tetap menghapus token bila request error", async () => {
    vi.mocked(apiRequest).mockRejectedValueOnce(new Error("Network error"));

    await expect(logoutApi()).rejects.toThrow("Network error");
    expect(removeAuthToken).toHaveBeenCalled();
  });
});
