import { screen } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import { renderWithProviders } from "@/test-utils";
import AppLayout from "./AppLayout";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

describe("AppLayout", () => {
  const push = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePathname).mockReturnValue("/");
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    localStorage.clear();
  });

  it("menampilkan navbar, konten, dan catatan edukasi", () => {
    localStorage.setItem("gulasadar:guest", "true");
    renderWithProviders(<AppLayout><p>isi halaman</p></AppLayout>);
    expect(screen.getByText("GulaSadar")).toBeInTheDocument();
    expect(screen.getByText("isi halaman")).toBeInTheDocument();
    expect(screen.getByText(/bukan diagnosis medis/)).toBeInTheDocument();
  });

  it("mengarahkan ke /auth/login jika pengguna belum login dan bukan tamu", () => {
    renderWithProviders(<AppLayout><p>isi</p></AppLayout>);
    expect(push).toHaveBeenCalledWith("/auth/login");
  });

  it("tidak mengarahkan ke /auth/login pada halaman publik /bantuan", () => {
    vi.mocked(usePathname).mockReturnValue("/bantuan");
    renderWithProviders(<AppLayout><p>isi</p></AppLayout>);
    expect(push).not.toHaveBeenCalled();
  });

  it("menyediakan tautan lewati ke konten dan panduan untuk pengguna baru", async () => {
    localStorage.setItem("gulasadar:guest", "true");
    renderWithProviders(<AppLayout><p>isi</p></AppLayout>);
    expect(screen.getByRole("link", { name: "Lewati ke konten" })).toHaveAttribute("href", "#konten");
    expect(await screen.findByText(/Selamat datang/)).toBeInTheDocument();
  });
});