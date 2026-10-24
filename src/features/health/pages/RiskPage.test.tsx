import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { showErrorDialog } from "@/helpers/toolsHelper";
import { assessRisk } from "../api/healthApi";
import RiskPage from "./RiskPage";

vi.mock("../api/healthApi", () => ({ assessRisk: vi.fn() }));
vi.mock("@/helpers/toolsHelper", () => ({ showErrorDialog: vi.fn() }));

async function fill() {
  await userEvent.type(screen.getByLabelText("Umur"), "50");
  await userEvent.selectOptions(screen.getByLabelText("Jenis kelamin"), "wanita");
  await userEvent.type(screen.getByLabelText("Tinggi badan"), "160");
  await userEvent.type(screen.getByLabelText("Berat badan"), "70");
  await userEvent.type(screen.getByLabelText("Lingkar pinggang"), "90");
  await userEvent.selectOptions(screen.getByLabelText("Riwayat keluarga"), "orangtua");
  await userEvent.click(screen.getByLabelText(/Aktif bergerak/));
}

const result = (level: string) => ({ score: 12, level, bmi: 27.3, advice: "Periksa gula darah.", disclaimer: "Bukan diagnosis." });

describe("RiskPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("mengirim data dan menampilkan hasil", async () => {
    vi.mocked(assessRisk).mockResolvedValue(result("tinggi"));
    render(<RiskPage />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Lihat hasil" }));
    expect(assessRisk).toHaveBeenCalledWith(expect.objectContaining({ age: 50, sex: "wanita", familyHistory: "orangtua", active: true, heightCm: 160 }));
    expect(await screen.findByText("Risiko tinggi")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tanya Sobat Gula/ })).toHaveAttribute("href", "/sobat-gula");
  });

  it("level tak dikenal memakai gaya bawaan", async () => {
    vi.mocked(assessRisk).mockResolvedValue(result("aneh"));
    render(<RiskPage />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Lihat hasil" }));
    expect(await screen.findByText("Risiko aneh")).toBeInTheDocument();
  });

  it("validasi inline mencegah pengiriman form kosong", async () => {
    render(<RiskPage />);
    await userEvent.click(screen.getByRole("button", { name: "Lihat hasil" }));
    expect(screen.getAllByRole("alert").length).toBe(4);
    expect(assessRisk).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText("Umur"), "17");
    expect(screen.getByText("Umur harus antara 18 dan 120 tahun.")).toBeInTheDocument();
  });

  it("Kosongkan mereset form dan hasil", async () => {
    vi.mocked(assessRisk).mockResolvedValue(result("rendah"));
    render(<RiskPage />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Lihat hasil" }));
    await screen.findByText("Risiko rendah");
    await userEvent.click(screen.getByRole("button", { name: /Kosongkan/ }));
    expect(screen.queryByText("Risiko rendah")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Umur")).toHaveValue(null);
  });

  it("menampilkan error dari server", async () => {
    vi.mocked(assessRisk).mockRejectedValue(new Error("gagal server"));
    render(<RiskPage />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Lihat hasil" }));
    await vi.waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("gagal server"));
  });
});
