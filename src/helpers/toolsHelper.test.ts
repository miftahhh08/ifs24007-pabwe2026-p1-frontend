import Swal from "sweetalert2";
import {
  formatTime,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  showWarningDialog,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

describe("toolsHelper", () => {
  beforeEach(() => vi.mocked(Swal.fire).mockReset());

  it("showSuccessDialog menampilkan toast sukses", async () => {
    await showSuccessDialog("Berhasil");
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "success", title: "Berhasil", toast: true }));
  });

  it("showErrorDialog menampilkan dialog error", async () => {
    await showErrorDialog("Rusak");
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error", text: "Rusak" }));
  });

  it("showWarningDialog menampilkan dialog peringatan", async () => {
    await showWarningDialog("Hati-hati");
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "warning", text: "Hati-hati" }));
  });

  it("showConfirmDialog mengembalikan true jika dikonfirmasi", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as never);
    expect(await showConfirmDialog("Judul", "Teks")).toBe(true);
  });

  it("showConfirmDialog mengembalikan false jika dibatalkan", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: false } as never);
    expect(await showConfirmDialog("Judul", "Teks")).toBe(false);
  });

  it("formatTime mengambil jam dan menit", () => {
    expect(formatTime("2026-10-23 16:15:42")).toBe("16.15");
  });

  it("formatTime tetap bekerja untuk teks tanpa tanggal", () => {
    expect(formatTime("09:05:00")).toBe("09.05");
  });
});
