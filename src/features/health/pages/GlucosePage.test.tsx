import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { showConfirmDialog, showErrorDialog } from "@/helpers/toolsHelper";
import { addGlucose, deleteGlucose, getGlucose } from "../api/healthApi";
import GlucosePage from "./GlucosePage";

vi.mock("../api/healthApi", () => ({ addGlucose: vi.fn(), getGlucose: vi.fn(), deleteGlucose: vi.fn() }));
vi.mock("@/helpers/toolsHelper", () => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn(), showConfirmDialog: vi.fn() }));

const log = { id: 1, value: 110, context: "sesudah_makan" as const, category: "normal", measured_at: "2026-10-23 08:00:00" };

describe("GlucosePage", () => {
  beforeEach(() => { vi.clearAllMocks(); vi.mocked(getGlucose).mockResolvedValue([]); });

  it("menampilkan kosong, lalu mencatat nilai", async () => {
    vi.mocked(addGlucose).mockResolvedValue({ id: 1, value: 110, context: "sewaktu", category: "normal", note: "Dalam rentang normal." });
    render(<GlucosePage />);
    expect(await screen.findByText(/Belum ada catatan/)).toBeInTheDocument();
    vi.mocked(getGlucose).mockResolvedValue([log]);
    await userEvent.type(screen.getByLabelText("Nilai gula darah"), "110");
    await userEvent.selectOptions(screen.getByLabelText("Waktu pengukuran"), "sewaktu");
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    expect(addGlucose).toHaveBeenCalledWith(110, "sewaktu");
    expect(await screen.findByText(/Dalam rentang normal\./)).toBeInTheDocument();
    expect(await screen.findByText("110 mg/dL")).toBeInTheDocument();
  });

  it("gagal mencatat dan gagal memuat", async () => {
    vi.mocked(getGlucose).mockRejectedValue(new Error("muat gagal"));
    vi.mocked(addGlucose).mockRejectedValue(new Error("simpan gagal"));
    render(<GlucosePage />);
    await vi.waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("muat gagal"));
    await userEvent.type(screen.getByLabelText("Nilai gula darah"), "95");
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await vi.waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("simpan gagal"));
  });

  it("gagal memuat ulang setelah mencatat sukses", async () => {
    vi.mocked(getGlucose).mockResolvedValueOnce([]);
    render(<GlucosePage />);
    expect(await screen.findByText(/Belum ada catatan/)).toBeInTheDocument();

    vi.mocked(addGlucose).mockResolvedValueOnce({ id: 1, value: 95, context: "sewaktu", category: "normal", note: "Ok" });
    vi.mocked(getGlucose).mockRejectedValueOnce(new Error("load ulang gagal"));

    await userEvent.type(screen.getByLabelText("Nilai gula darah"), "95");
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await vi.waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("load ulang gagal"));
  });

  it("menghapus catatan setelah konfirmasi, dan membatalkan", async () => {
    vi.mocked(getGlucose).mockResolvedValue([log]);
    vi.mocked(deleteGlucose).mockResolvedValue({ deleted: true });
    render(<GlucosePage />);
    const btn = await screen.findByLabelText("Hapus catatan 1");
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(false);
    await userEvent.click(btn);
    expect(deleteGlucose).not.toHaveBeenCalled();
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    await userEvent.click(btn);
    await vi.waitFor(() => expect(deleteGlucose).toHaveBeenCalledWith(1));
  });

  it("error saat menghapus", async () => {
    vi.mocked(getGlucose).mockResolvedValue([log]);
    vi.mocked(deleteGlucose).mockRejectedValue(new Error("hapus gagal"));
    vi.mocked(showConfirmDialog).mockResolvedValue(true);
    render(<GlucosePage />);
    await userEvent.click(await screen.findByLabelText("Hapus catatan 1"));
    await vi.waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("hapus gagal"));
  });

  it("validasi inline: nilai kosong atau di luar rentang tidak dikirim", async () => {
    render(<GlucosePage />);
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    expect(screen.getByText("Nilai gula darah wajib diisi dengan angka.")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Nilai gula darah"), "5");
    expect(screen.getByText(/harus antara 20 dan 600 mg\/dL/)).toBeInTheDocument();
    expect(addGlucose).not.toHaveBeenCalled();
  });

  it("menampilkan lencana kategori dan label konteks tak dikenal", async () => {
    vi.mocked(getGlucose).mockResolvedValue([{ ...log, id: 2, category: "aneh", context: "lain" as never }]);
    render(<GlucosePage />);
    expect(await screen.findByText("aneh")).toBeInTheDocument();
    expect(screen.getByText(/lain/)).toBeInTheDocument();

    vi.mocked(addGlucose).mockResolvedValueOnce({ id: 9, value: 110, context: "sewaktu", category: "khusus", note: "Catatan khusus" });
    await userEvent.type(screen.getByLabelText("Nilai gula darah"), "110");
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    expect(await screen.findByText(/KHUSUS:/)).toBeInTheDocument();
  });
});
