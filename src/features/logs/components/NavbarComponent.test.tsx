import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { renderWithProviders } from "@/test-utils";
import NavbarComponent from "./NavbarComponent";
import * as authActions from "@/features/auth/states/action";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

describe("NavbarComponent", () => {
  it("menandai menu Beranda aktif di '/'", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    renderWithProviders(<NavbarComponent />);
    expect(screen.getByRole("link", { name: /Beranda/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Cari Makanan/ })).not.toHaveAttribute("aria-current");
  });

  it("menandai menu Cari Makanan aktif di '/makanan'", () => {
    vi.mocked(usePathname).mockReturnValue("/makanan");
    renderWithProviders(<NavbarComponent />);
    expect(screen.getByRole("link", { name: /Cari Makanan/ })).toHaveAttribute("aria-current", "page");
  });

  it("menyediakan menu fitur kesehatan", () => {
    vi.mocked(usePathname).mockReturnValue("/risiko");
    renderWithProviders(<NavbarComponent />);
    for (const name of [/Label/, /Risiko/, /Gula Darah/, /Sobat Gula/, /Bantuan/])
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Risiko/ })).toHaveAttribute("aria-current", "page");
  });

  it("menampilkan tautan Masuk ke /auth/login saat belum login", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    renderWithProviders(<NavbarComponent />, { authUser: null });

    const link = screen.getByRole("link", { name: /Masuk/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/auth/login");
  });

  it("menampilkan nama pengguna dan tombol keluar saat sudah login", async () => {
    const spy = vi.spyOn(authActions, "asyncLogout").mockReturnValue(() => Promise.resolve());
    vi.mocked(usePathname).mockReturnValue("/");
    const user = { id: 1, name: "Budi Santoso", email: "budi@example.com" };

    renderWithProviders(<NavbarComponent />, { authUser: user });

    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    const logoutBtn = screen.getByRole("button", { name: "Keluar akun" });
    expect(logoutBtn).toBeInTheDocument();

    await userEvent.click(logoutBtn);
    expect(spy).toHaveBeenCalled();
  });
});
