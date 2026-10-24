import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import AuthModal from "./AuthModal";
import * as authActions from "../states/action";

describe("AuthModal", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tidak menampilkan apa pun bila isOpen bernilai false", () => {
    const { container } = renderWithProviders(<AuthModal isOpen={false} onClose={onClose} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("menampilkan modal masuk secara default", () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={onClose} defaultTab="login" />);
    expect(screen.getByRole("heading", { name: "Masuk ke GulaSadar" })).toBeInTheDocument();
    expect(screen.getByLabelText("Alamat Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Kata Sandi")).toBeInTheDocument();
    expect(screen.queryByLabelText("Nama Lengkap")).not.toBeInTheDocument();
  });

  it("dapat beralih ke tab daftar dan kembali ke tab masuk", async () => {
    const { rerender } = renderWithProviders(<AuthModal isOpen={true} onClose={onClose} defaultTab="login" />);
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));

    expect(screen.getByRole("heading", { name: "Daftar Akun Baru" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nama Lengkap")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(screen.getByRole("heading", { name: "Masuk ke GulaSadar" })).toBeInTheDocument();

    // Re-render dengan defaultTab baru
    rerender(<AuthModal isOpen={true} onClose={onClose} defaultTab="register" />);
    expect(screen.getByRole("heading", { name: "Daftar Akun Baru" })).toBeInTheDocument();
  });

  it("validasi email dan kata sandi pada formulir masuk", async () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={onClose} defaultTab="login" />);

    await userEvent.type(screen.getByLabelText("Alamat Email"), "bukan-email");
    await userEvent.type(screen.getByLabelText("Kata Sandi"), "123456");
    await userEvent.click(screen.getByRole("button", { name: "Masuk Sekarang" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Format email tidak valid");

    await userEvent.clear(screen.getByLabelText("Alamat Email"));
    await userEvent.type(screen.getByLabelText("Alamat Email"), "valid@test.com");
    await userEvent.clear(screen.getByLabelText("Kata Sandi"));
    await userEvent.type(screen.getByLabelText("Kata Sandi"), "123");
    await userEvent.click(screen.getByRole("button", { name: "Masuk Sekarang" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Kata sandi minimal 6 karakter");
  });

  it("validasi nama pada formulir daftar", async () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={onClose} defaultTab="register" />);

    await userEvent.type(screen.getByLabelText("Nama Lengkap"), "A");
    await userEvent.type(screen.getByLabelText("Alamat Email"), "test@mail.com");
    await userEvent.type(screen.getByLabelText("Kata Sandi"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Buat Akun" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Nama lengkap wajib diisi (2-100 karakter)");
  });

  it("mengirim data masuk yang valid dan memanggil onClose saat sukses", async () => {
    const spy = vi.spyOn(authActions, "asyncLogin").mockImplementation((_, onSuccess) => () => {
      onSuccess?.();
      return Promise.resolve();
    });
    renderWithProviders(<AuthModal isOpen={true} onClose={onClose} defaultTab="login" />);

    await userEvent.type(screen.getByLabelText("Alamat Email"), "user@test.com");
    await userEvent.type(screen.getByLabelText("Kata Sandi"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Masuk Sekarang" }));

    expect(spy).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("mengirim data pendaftaran yang valid dan memanggil onClose saat sukses", async () => {
    const spy = vi.spyOn(authActions, "asyncRegister").mockImplementation((_, onSuccess) => () => {
      onSuccess?.();
      return Promise.resolve();
    });
    renderWithProviders(<AuthModal isOpen={true} onClose={onClose} defaultTab="register" />);

    await userEvent.type(screen.getByLabelText("Nama Lengkap"), "Budi Santoso");
    await userEvent.type(screen.getByLabelText("Alamat Email"), "budi@test.com");
    await userEvent.type(screen.getByLabelText("Kata Sandi"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Buat Akun" }));

    expect(spy).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("menutup modal saat tombol tutup atau Escape ditekan", async () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={onClose} />);
    await userEvent.click(screen.getByLabelText("Tutup formulir masuk"));
    expect(onClose).toHaveBeenCalledTimes(1);

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("menampilkan teks Memproses... saat isLoading bernilai true", () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={onClose} />, {
      isAuthLoading: true,
    });

    const submitBtn = screen.getByRole("button", { name: "Memproses..." });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("dapat beralih antara tab Masuk dan Daftar", async () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={onClose} defaultTab="login" />);
    expect(screen.getByRole("button", { name: "Masuk Sekarang" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    expect(screen.getByRole("button", { name: "Buat Akun" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(screen.getByRole("button", { name: "Masuk Sekarang" })).toBeInTheDocument();
  });
});
