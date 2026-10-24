import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { showErrorDialog } from "@/helpers/toolsHelper";
import { renderWithProviders } from "@/test-utils";
import { identifyPhoto } from "../api/healthApi";
import PhotoIdentify, { trafficLightBadge } from "./PhotoIdentify";

vi.mock("../api/healthApi", () => ({ identifyPhoto: vi.fn() }));
vi.mock("@/helpers/toolsHelper", () => ({ showErrorDialog: vi.fn() }));

// Mock URL.createObjectURL & revokeObjectURL
if (!globalThis.URL.createObjectURL) {
  globalThis.URL.createObjectURL = vi.fn(() => "blob:mock-url");
  globalThis.URL.revokeObjectURL = vi.fn();
} else {
  vi.spyOn(globalThis.URL, "createObjectURL").mockReturnValue("blob:mock-url");
  vi.spyOn(globalThis.URL, "revokeObjectURL").mockImplementation(() => {});
}

const uploadInput = () => screen.getByLabelText("Unggah foto makanan");
const pngFile = (name = "a.png", size = 100) => {
  const f = new File(["x".repeat(size)], name, { type: "image/png" });
  return f;
};

describe("PhotoIdentify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("trafficLightBadge", () => {
    it("memberikan badge hijau untuk gula <= 5g", () => {
      const b = trafficLightBadge(4);
      expect(b.text).toContain("Rendah");
      expect(b.className).toContain("bg-emerald-100");
    });

    it("memberikan badge kuning untuk gula > 5g dan <= 15g", () => {
      const b = trafficLightBadge(10);
      expect(b.text).toContain("Sedang");
      expect(b.className).toContain("bg-amber-100");
    });

    it("memberikan badge merah untuk gula > 15g", () => {
      const b = trafficLightBadge(25);
      expect(b.text).toContain("Tinggi");
      expect(b.className).toContain("bg-red-100");
    });
  });

  it("dapat toggle panduan cara kerja", async () => {
    renderWithProviders(<PhotoIdentify />);
    const helpBtn = screen.getByRole("button", { name: /Cara Kerja/i });
    expect(screen.queryByText(/Panduan Evaluasi Heuristik/i)).not.toBeInTheDocument();

    await userEvent.click(helpBtn);
    expect(screen.getByText(/Panduan Evaluasi Heuristik/i)).toBeInTheDocument();

    await userEvent.click(helpBtn);
    expect(screen.queryByText(/Panduan Evaluasi Heuristik/i)).not.toBeInTheDocument();
  });

  it("menolak format file selain jpg, png, webp, dan mengabaikan jika kosong", async () => {
    const { fireEvent } = await import("@testing-library/react");
    renderWithProviders(<PhotoIdentify />);
    const invalidFile = new File(["pdf"], "doc.pdf", { type: "application/pdf" });
    fireEvent.change(uploadInput(), { target: { files: [invalidFile] } });

    expect(showErrorDialog).toHaveBeenCalledWith("Format gambar harus JPEG, PNG, atau WebP");

    fireEvent.change(uploadInput(), { target: { files: [] } });
    expect(showErrorDialog).toHaveBeenCalledTimes(1);
  });

  it("menolak ukuran file lebih dari 5 MB", async () => {
    renderWithProviders(<PhotoIdentify />);
    const bigFile = new File(["a"], "big.png", { type: "image/png" });
    Object.defineProperty(bigFile, "size", { value: 6 * 1024 * 1024 });

    await userEvent.upload(uploadInput(), bigFile);
    expect(showErrorDialog).toHaveBeenCalledWith("Ukuran gambar maksimal 5 MB");
  });

  it("dapat mengunggah foto, memberi petunjuk, lalu mengklik Lihat Hasil Analisis", async () => {
    vi.mocked(identifyPhoto).mockResolvedValue({
      unknown: [],
      foods: [
        {
          id: "soda",
          name: "Minuman Soda Kaleng",
          portion: "1 kaleng (330ml)",
          category: "Minuman Kemasan",
          servings: 0,
          sugar_total_g: 35,
          sugar_g: 35,
        } as never,
      ],
    });

    renderWithProviders(<PhotoIdentify />);
    await userEvent.upload(uploadInput(), pngFile("soda.png"));

    expect(screen.getByText("soda.png")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Lihat Hasil Analisis/i })).toBeInTheDocument();

    // Beri petunjuk opsional
    const hintInput = screen.getByPlaceholderText(/Beri petunjuk/i);
    await userEvent.type(hintInput, "soda dingin");

    // Klik tombol analisis
    await userEvent.click(screen.getByRole("button", { name: /Lihat Hasil Analisis/i }));

    await vi.waitFor(() => {
      expect(identifyPhoto).toHaveBeenCalledWith(
        expect.any(String),
        "image/png",
        "soda.png",
        "soda dingin"
      );
    });

    // Hasil analisis muncul
    expect(await screen.findByText("Minuman Soda Kaleng")).toBeInTheDocument();
    expect(screen.getByText("35 g")).toBeInTheDocument();

    // Stepper porsi
    const plusBtn = screen.getByTitle("Tambah porsi");
    await userEvent.click(plusBtn);
    expect(screen.getByText("1.5 porsi")).toBeInTheDocument();

    const minusBtn = screen.getByTitle("Kurangi porsi");
    await userEvent.click(minusBtn);
    expect(screen.getByText("1 porsi")).toBeInTheDocument();
    await userEvent.click(minusBtn);
    expect(screen.getByText("0.5 porsi")).toBeInTheDocument();
    expect(minusBtn).toBeDisabled();

    // Catat ke log
    const catatBtn = screen.getByRole("button", { name: /Catat Hari Ini/i });
    await userEvent.click(catatBtn);
    expect(await screen.findByText("Tercatat")).toBeInTheDocument();

    // Analisis ulang
    const reAnalyzeBtn = screen.getByRole("button", { name: /Analisis Ulang/i });
    await userEvent.click(reAnalyzeBtn);
    await vi.waitFor(() => {
      expect(identifyPhoto).toHaveBeenCalledTimes(2);
    });
  });

  it("dapat mereset/mengganti foto yang telah dipilih", async () => {
    renderWithProviders(<PhotoIdentify />);
    await userEvent.upload(uploadInput(), pngFile("sample.png"));
    expect(screen.getByText("sample.png")).toBeInTheDocument();

    const gantiBtn = screen.getByTitle("Hapus / Ganti Foto");
    await userEvent.click(gantiBtn);

    expect(screen.queryByText("sample.png")).not.toBeInTheDocument();
    expect(screen.getByText("Klik atau Tarik Foto Makanan ke Sini")).toBeInTheDocument();
  });

  it("menangani kasus foto belum dikenali otomatis dan menyediakan petunjuk cepat", async () => {
    vi.mocked(identifyPhoto).mockResolvedValue({ foods: [], unknown: [] });

    renderWithProviders(<PhotoIdentify />);
    await userEvent.upload(uploadInput(), pngFile("Screenshot_123.png"));
    await userEvent.click(screen.getByRole("button", { name: /Lihat Hasil Analisis/i }));

    expect(await screen.findByText(/Foto Belum Dikenali Otomatis/i)).toBeInTheDocument();

    // Klik salah satu chip petunjuk cepat
    const esTehChip = screen.getByRole("button", { name: /\+ Es Teh Manis/i });
    await userEvent.click(esTehChip);

    expect(identifyPhoto).toHaveBeenCalledWith(
      expect.any(String),
      "image/png",
      "Screenshot_123.png",
      "es teh"
    );
  });

  it("menangani error layanan saat analisis", async () => {
    vi.mocked(identifyPhoto).mockRejectedValue(new Error("Layanan AI sedang sibuk"));

    renderWithProviders(<PhotoIdentify />);
    await userEvent.upload(uploadInput(), pngFile("foto.png"));
    await userEvent.click(screen.getByRole("button", { name: /Lihat Hasil Analisis/i }));

    await vi.waitFor(() => {
      expect(showErrorDialog).toHaveBeenCalledWith("Layanan AI sedang sibuk");
    });
  });

  it("menangani error jika FileReader gagal membaca gambar", async () => {
    const orig = globalThis.FileReader;
    class BadReader {
      onerror: (() => void) | null = null;
      onload: (() => void) | null = null;
      readAsDataURL() {
        this.onerror?.();
      }
    }
    vi.stubGlobal("FileReader", BadReader);

    renderWithProviders(<PhotoIdentify />);
    await userEvent.upload(uploadInput(), pngFile("corrupt.png"));
    await userEvent.click(screen.getByRole("button", { name: /Lihat Hasil Analisis/i }));

    await vi.waitFor(() => {
      expect(showErrorDialog).toHaveBeenCalledWith("Gagal membaca gambar");
    });

    vi.stubGlobal("FileReader", orig);
  });

  it("menangani FileReader dengan result tanpa koma", async () => {
    const orig = globalThis.FileReader;
    class PlainReader {
      onload: (() => void) | null = null;
      result = "plain-string";
      readAsDataURL() {
        this.onload?.();
      }
    }
    vi.stubGlobal("FileReader", PlainReader);
    vi.mocked(identifyPhoto).mockResolvedValueOnce({ foods: [], unknown: [] });

    renderWithProviders(<PhotoIdentify />);
    await userEvent.upload(uploadInput(), pngFile("plain.png"));
    await userEvent.click(screen.getByRole("button", { name: /Lihat Hasil Analisis/i }));

    await vi.waitFor(() => {
      expect(identifyPhoto).toHaveBeenCalledWith("", "image/png", "plain.png", "");
    });
    vi.stubGlobal("FileReader", orig);
  });

  it("dapat mengubah porsi, mencatat makanan ke log harian, dan menganalisis ulang", async () => {
    vi.mocked(identifyPhoto).mockResolvedValueOnce({
      foods: [
        {
          id: "food-1",
          name: "Kopi Susu Gula Aren",
          category: "Minuman",
          sugar_g: 22,
          serving_size: "1 gelas",
          glycemic_index: 60,
          servings: 1,
        },
      ],
      unknown: [],
    });

    renderWithProviders(<PhotoIdentify />);
    await userEvent.upload(uploadInput(), pngFile("kopi.png"));
    await userEvent.click(screen.getByRole("button", { name: /Lihat Hasil Analisis/i }));

    await vi.waitFor(() => {
      expect(screen.getByText("Kopi Susu Gula Aren")).toBeInTheDocument();
    });

    // Tambah dan kurangi porsi
    const plusBtn = screen.getByTitle("Tambah porsi");
    const minusBtn = screen.getByTitle("Kurangi porsi");

    await userEvent.click(plusBtn); // 1 -> 1.5
    expect(screen.getByText("1.5 porsi")).toBeInTheDocument();

    await userEvent.click(minusBtn); // 1.5 -> 1
    expect(screen.getByText("1 porsi")).toBeInTheDocument();

    await userEvent.click(minusBtn); // 1 -> 0.5
    expect(screen.getByText("0.5 porsi")).toBeInTheDocument();
    expect(minusBtn).toBeDisabled();

    // Catat makanan
    const recordBtn = screen.getByRole("button", { name: /Catat Hari Ini/i });
    await userEvent.click(recordBtn);

    await vi.waitFor(() => {
      expect(screen.getByText("Tercatat")).toBeInTheDocument();
    });

    // Analisis ulang
    const reanalyzeBtn = screen.getByRole("button", { name: /Analisis Ulang/i });
    await userEvent.click(reanalyzeBtn);
    await vi.waitFor(() => {
      expect(identifyPhoto).toHaveBeenCalledTimes(2);
    });
  });

  it("dapat memilih chip makanan cepat saat foto tidak dikenali", async () => {
    vi.mocked(identifyPhoto).mockResolvedValue({
      foods: [],
      unknown: ["minuman misterius"],
    });

    renderWithProviders(<PhotoIdentify />);
    await userEvent.upload(uploadInput(), pngFile("mystery.png"));
    await userEvent.click(screen.getByRole("button", { name: /Lihat Hasil Analisis/i }));

    await vi.waitFor(() => {
      expect(screen.getByText("Foto Belum Dikenali Otomatis")).toBeInTheDocument();
    });

    // Klik salah satu chip rekomendasi
    const hintBtn = screen.getByRole("button", { name: /\+ Es Teh Manis/i });
    await userEvent.click(hintBtn);

    await vi.waitFor(() => {
      expect(identifyPhoto).toHaveBeenCalledTimes(2);
    });
  });
});

