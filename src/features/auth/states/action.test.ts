import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { getAuthToken, removeAuthToken } from "@/helpers/apiHelper";
import { getMeApi, loginApi, logoutApi, registerApi } from "../api/authApi";
import {
  AuthActionType,
  asyncCheckAuth,
  asyncLogin,
  asyncLogout,
  asyncRegister,
  setAuthUserAction,
  setIsAuthLoadingAction,
} from "./action";

vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

vi.mock("@/helpers/apiHelper", () => ({
  getAuthToken: vi.fn(),
  removeAuthToken: vi.fn(),
}));

vi.mock("../api/authApi", () => ({
  getMeApi: vi.fn(),
  loginApi: vi.fn(),
  logoutApi: vi.fn(),
  registerApi: vi.fn(),
}));

describe("auth action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("action creators bekerja sesuai payload", () => {
    const user = { id: 1, name: "Budi", email: "budi@example.com" };
    expect(setAuthUserAction(user)).toEqual({
      type: AuthActionType.SET_AUTH_USER,
      payload: { user },
    });
    expect(setIsAuthLoadingAction(true)).toEqual({
      type: AuthActionType.SET_IS_AUTH_LOADING,
      payload: { isLoading: true },
    });
  });

  describe("asyncCheckAuth", () => {
    it("tidak melakukan apa pun jika token tidak ada", async () => {
      vi.mocked(getAuthToken).mockReturnValue(null);
      const dispatch = vi.fn();
      await asyncCheckAuth()(dispatch);
      expect(dispatch).not.toHaveBeenCalled();
      expect(getMeApi).not.toHaveBeenCalled();
    });

    it("memuat profil pengguna jika token valid", async () => {
      vi.mocked(getAuthToken).mockReturnValue("tok-123");
      const user = { id: 1, name: "Budi", email: "budi@example.com" };
      vi.mocked(getMeApi).mockResolvedValue(user);

      const dispatch = vi.fn();
      await asyncCheckAuth()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(true));
      expect(dispatch).toHaveBeenCalledWith(setAuthUserAction(user));
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(false));
    });

    it("menghapus token dan set user null jika getMeApi gagal", async () => {
      vi.mocked(getAuthToken).mockReturnValue("tok-expired");
      vi.mocked(getMeApi).mockRejectedValue(new Error("Sesi berakhir"));

      const dispatch = vi.fn();
      await asyncCheckAuth()(dispatch);

      expect(removeAuthToken).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setAuthUserAction(null));
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(false));
    });
  });

  describe("asyncRegister", () => {
    it("sukses mendaftar akun", async () => {
      const user = { id: 1, name: "Budi", email: "budi@example.com" };
      vi.mocked(registerApi).mockResolvedValue({ user, token: "tok-1" });

      const dispatch = vi.fn();
      const onSuccess = vi.fn();
      await asyncRegister({ name: "Budi", email: "budi@example.com", password: "secret" }, onSuccess)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(true));
      expect(dispatch).toHaveBeenCalledWith(setAuthUserAction(user));
      expect(showSuccessDialog).toHaveBeenCalledWith("Selamat datang, Budi!");
      expect(onSuccess).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(false));
    });

    it("gagal mendaftar menampilkan error dialog", async () => {
      vi.mocked(registerApi).mockRejectedValue(new Error("Email sudah terdaftar"));

      const dispatch = vi.fn();
      await asyncRegister({ name: "Budi", email: "budi@example.com", password: "secret" })(dispatch);

      expect(showErrorDialog).toHaveBeenCalledWith("Email sudah terdaftar");
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(false));
    });
  });

  describe("asyncLogin", () => {
    it("sukses masuk akun", async () => {
      const user = { id: 2, name: "Siti", email: "siti@example.com" };
      vi.mocked(loginApi).mockResolvedValue({ user, token: "tok-2" });

      const dispatch = vi.fn();
      const onSuccess = vi.fn();
      await asyncLogin({ email: "siti@example.com", password: "secret" }, onSuccess)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(true));
      expect(dispatch).toHaveBeenCalledWith(setAuthUserAction(user));
      expect(showSuccessDialog).toHaveBeenCalledWith("Berhasil masuk sebagai Siti");
      expect(onSuccess).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(false));
    });

    it("gagal masuk menampilkan error dialog", async () => {
      vi.mocked(loginApi).mockRejectedValue(new Error("Kata sandi salah"));

      const dispatch = vi.fn();
      await asyncLogin({ email: "siti@example.com", password: "secret" })(dispatch);

      expect(showErrorDialog).toHaveBeenCalledWith("Kata sandi salah");
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(false));
    });
  });

  describe("asyncLogout", () => {
    it("sukses keluar akun", async () => {
      vi.mocked(logoutApi).mockResolvedValue({ message: "Berhasil keluar" });

      const dispatch = vi.fn();
      await asyncLogout()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(true));
      expect(dispatch).toHaveBeenCalledWith(setAuthUserAction(null));
      expect(showSuccessDialog).toHaveBeenCalledWith("Berhasil keluar");
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(false));
    });

    it("gagal keluar tetap menampilkan error dialog", async () => {
      vi.mocked(logoutApi).mockRejectedValue(new Error("Gagal logout"));

      const dispatch = vi.fn();
      await asyncLogout()(dispatch);

      expect(showErrorDialog).toHaveBeenCalledWith("Gagal logout");
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoadingAction(false));
    });
  });
});
