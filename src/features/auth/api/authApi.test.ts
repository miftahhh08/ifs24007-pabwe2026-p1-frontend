import { apiRequest } from "@/helpers/apiHelper";
import { getMeApi, loginApi, logoutApi, registerApi } from "./authApi";

vi.mock("@/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

const user = { id: 1, name: "Budi", email: "budi@example.com" };

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registerApi memanggil endpoint register", async () => {
    vi.mocked(apiRequest).mockResolvedValueOnce({ user });
    const input = { name: "Budi", email: "budi@example.com", password: "password123" };

    const res = await registerApi(input);

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/register", { method: "POST", body: input });
    expect(res).toEqual({ user });
  });

  it("loginApi memanggil endpoint login", async () => {
    vi.mocked(apiRequest).mockResolvedValueOnce({ user });
    const input = { email: "budi@example.com", password: "secret" };

    const res = await loginApi(input);

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/login", { method: "POST", body: input });
    expect(res).toEqual({ user });
  });

  it("getMeApi memanggil endpoint me", async () => {
    vi.mocked(apiRequest).mockResolvedValueOnce({ user });
    expect(await getMeApi()).toEqual(user);
    expect(apiRequest).toHaveBeenCalledWith("/api/auth/me");
  });

  it("logoutApi memanggil endpoint logout", async () => {
    vi.mocked(apiRequest).mockResolvedValueOnce({ message: "Berhasil keluar" });
    expect(await logoutApi()).toEqual({ message: "Berhasil keluar" });
    expect(apiRequest).toHaveBeenCalledWith("/api/auth/logout", { method: "POST" });
  });
});
