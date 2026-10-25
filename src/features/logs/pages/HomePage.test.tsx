import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { showConfirmDialog } from "@/helpers/toolsHelper";
import { deleteLog, getToday } from "../api/logApi";
import HomePage, { barColor } from "./HomePage";
import type { TodayData } from "@/types";

vi.mock("../api/logApi", () => ({ getToday: vi.fn(), addLog: vi.fn(), deleteLog: vi.fn() }));
vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
  formatTime: (v: string) => v.slice(11, 16),
}));

const data = (percent: number, withLogs = true): TodayData => ({
  total_sugar_g: 20,
  limit_g: 50,
  percent,
  logs: withLogs ? [{ id: 9, name: "Es teh manis", servings: 1, sugar_g: 20, eaten_at: "2026-10-23 16:15:00" }] : [],
});

describe("barColor", () => {
  it("memilih warna sesuai persentase", () => {
    expect(barColor(10)).toBe("bg-emerald-500");
    expect(barColor(70)).toBe("bg-amber-500");
    expect(barColor(120)).toBe("bg-red-500");
  });
});

describe("HomePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan total gula dan catatan", async () => {
    vi.mocked(getToday).mockResolvedValue(data(40));
    renderWithProviders(<HomePage />);
    expect(await screen.findByText("Es teh manis")).toBeInTheDocument();
    expect(screen.getByText("40% dari batas anjuran harian terpakai.")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
  });

  it("menampilkan pesan jika batas terlampaui dan membatasi bar di 100", async () => {
    vi.mocked(getToday).mockResolvedValue({
      total_sugar_g: 55,
      limit_g: 50,
      percent: 130,
      logs: [],
    });
    renderWithProviders(<HomePage />);
    expect(await screen.findByText("Batas anjuran hari ini sudah terlampaui.")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByText("Kamu sudah mencapai atau melewati acuan hari ini")).toBeInTheDocument();
  });

  it("menampilkan warna kuning ketika persentase di atas 60%", async () => {
    vi.mocked(getToday).mockResolvedValue(data(70));
    renderWithProviders(<HomePage />);
    expect(await screen.findByText("70%")).toHaveClass("text-amber-700");
  });

  it("menampilkan keadaan kosong", async () => {
    vi.mocked(getToday).mockResolvedValue(data(0, false));
    renderWithProviders(<HomePage />);
    expect(await screen.findByText(/Belum ada catatan/)).toBeInTheDocument();
  });

  it("menampilkan status memuat", () => {
    vi.mocked(getToday).mockReturnValue(new Promise(() => {}));
    renderWithProviders(<HomePage />);
    expect(screen.getByText("Memuat data...")).toBeInTheDocument();
  });

  it("menampilkan tombol coba lagi saat gagal memuat", async () => {
    vi.mocked(getToday).mockRejectedValueOnce(new Error("mati")).mockResolvedValueOnce(data(10));
    renderWithProviders(<HomePage />);
    await userEvent.click(await screen.findByRole("button", { name: "Coba lagi" }));
    expect(await screen.findByText("Es teh manis")).toBeInTheDocument();
  });

  it("menghapus catatan setelah konfirmasi", async () => {
    vi.mocked(getToday).mockResolvedValue(data(40));
    vi.mocked(showConfirmDialog).mockResolvedValue(true);
    vi.mocked(deleteLog).mockResolvedValue({ deleted: true });
    renderWithProviders(<HomePage />);
    await userEvent.click(await screen.findByRole("button", { name: "Hapus Es teh manis" }));
    await waitFor(() => expect(deleteLog).toHaveBeenCalledWith(9));
  });
});
