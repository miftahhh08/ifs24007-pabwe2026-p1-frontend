import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HelpBanner, { getServerSnapshot } from "./HelpBanner";

describe("HelpBanner", () => {
  beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

  it("tampil untuk pengguna baru dan hilang permanen setelah ditutup", async () => {
    const { unmount } = render(<HelpBanner />);
    expect(await screen.findByText(/Selamat datang/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Mengerti" }));
    expect(screen.queryByText(/Selamat datang/)).not.toBeInTheDocument();
    unmount();
    render(<HelpBanner />);
    expect(screen.queryByText(/Selamat datang/)).not.toBeInTheDocument();
    expect(getServerSnapshot()).toBe(false);
  });

  it("tombol X dan tautan panduan juga menutup", async () => {
    render(<HelpBanner />);
    await userEvent.click(await screen.findByRole("button", { name: "Tutup panduan" }));
    expect(screen.queryByText(/Selamat datang/)).not.toBeInTheDocument();
  });

  it("tautan panduan lengkap menutup banner", async () => {
    render(<HelpBanner />);
    const link = await screen.findByRole("link", { name: "Lihat panduan lengkap" });
    expect(link).toHaveAttribute("href", "/bantuan");
    await userEvent.click(link);
    expect(localStorage.getItem("gulasadar:onboarded")).toBe("1");
  });

  it("tetap berfungsi bila localStorage tidak tersedia", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    render(<HelpBanner />);
    await userEvent.click(await screen.findByRole("button", { name: "Mengerti" }));
    expect(screen.queryByText(/Selamat datang/)).not.toBeInTheDocument();
  });
});
