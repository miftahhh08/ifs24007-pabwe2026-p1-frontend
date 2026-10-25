import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { renderWithProviders } from "@/test-utils";
import LoginPage from "./LoginPage";
import * as authActions from "../states/action";
import * as apiHelper from "@/helpers/apiHelper";

vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));

describe("LoginPage", () => {
  const push = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    localStorage.clear();
  });

  it("mengarahkan ke beranda jika sudah ada token atau authUser", () => {
    vi.spyOn(apiHelper, "hasAuthSession").mockReturnValue(true);
    renderWithProviders(<LoginPage />);
    expect(push).toHaveBeenCalledWith("/");
  });

  it("menampilkan tampilan LOGIN secara default dengan ilustrasi dan tombol pil", () => {
    vi.spyOn(apiHelper, "hasAuthSession").mockReturnValue(false);
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole("heading", { name: "GulaSadar" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "LOGIN" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.queryByLabelText("Nama Lengkap")).not.toBeInTheDocument();
  });

  it("dapat beralih ke formulir DAFTAR dan kembali ke LOGIN", async () => {
    vi.spyOn(apiHelper, "hasAuthSession").mockReturnValue(false);
    renderWithProviders(<LoginPage />);

    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    expect(screen.getByRole("heading", { name: "DAFTAR" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nama Lengkap")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(screen.getByRole("heading", { name: "LOGIN" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Nama Lengkap")).not.toBeInTheDocument();
  });

  it("menampilkan pesan kesalahan validasi pada format email dan kata sandi", async () => {
    vi.spyOn(apiHelper, "hasAuthSession").mockReturnValue(false);
    renderWithProviders(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Email"), "bukan-email");
    await userEvent.type(screen.getByLabelText("Password"), "123456");
    await userEvent.click(screen.getByRole("button", { name: "LOGIN" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Format email tidak valid");

    await userEvent.clear(screen.getByLabelText("Email"));
    await userEvent.type(screen.getByLabelText("Email"), "valid@mail.com");
    await userEvent.clear(screen.getByLabelText("Password"));
    await userEvent.type(screen.getByLabelText("Password"), "123");
    await userEvent.click(screen.getByRole("button", { name: "LOGIN" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Kata sandi minimal 6 karakter");
  });

  it("validasi nama lengkap pada mode pendaftaran", async () => {
    vi.spyOn(apiHelper, "hasAuthSession").mockReturnValue(false);
    renderWithProviders(<LoginPage />);

    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    await userEvent.type(screen.getByLabelText("Nama Lengkap"), "X");
    await userEvent.type(screen.getByLabelText("Email"), "test@mail.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "DAFTAR SEKARANG" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Nama lengkap wajib diisi (2-100 karakter)");
  });

  it("mengirim data masuk yang valid dan mengarahkan ke beranda", async () => {
    vi.spyOn(apiHelper, "hasAuthSession").mockReturnValue(false);
    const spy = vi.spyOn(authActions, "asyncLogin").mockImplementation((_, onSuccess) => {
      onSuccess?.();
      return () => Promise.resolve();
    });

    renderWithProviders(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Email"), "user@mail.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "LOGIN" }));

    expect(spy).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/");
  });

  it("mengirim data pendaftaran yang valid dan mengarahkan ke beranda", async () => {
    vi.spyOn(apiHelper, "hasAuthSession").mockReturnValue(false);
    const spy = vi.spyOn(authActions, "asyncRegister").mockImplementation((_, onSuccess) => {
      onSuccess?.();
      return () => Promise.resolve();
    });

    renderWithProviders(<LoginPage />);

    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    await userEvent.type(screen.getByLabelText("Nama Lengkap"), "Budi Santoso");
    await userEvent.type(screen.getByLabelText("Email"), "budi@mail.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "DAFTAR SEKARANG" }));

    expect(spy).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/");
  });

  it("opsi lanjutkan sebagai tamu menyimpan flag guest dan mengarahkan ke beranda", async () => {
    vi.spyOn(apiHelper, "hasAuthSession").mockReturnValue(false);
    renderWithProviders(<LoginPage />);

    const guestBtn = screen.getByRole("button", { name: /Lanjutkan sebagai Tamu/i });
    await userEvent.click(guestBtn);

    expect(localStorage.getItem("gulasadar:guest")).toBe("true");
    expect(push).toHaveBeenCalledWith("/");
  });

  it("menampilkan teks memproses saat isLoading bernilai true", () => {
    vi.spyOn(apiHelper, "hasAuthSession").mockReturnValue(false);
    renderWithProviders(<LoginPage />, { isAuthLoading: true });
    expect(screen.getByText("MEMPROSES...")).toBeInTheDocument();
  });
});
