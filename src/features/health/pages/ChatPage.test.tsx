import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { showConfirmDialog, showErrorDialog } from "@/helpers/toolsHelper";
import { renderWithProviders } from "@/test-utils";
import { getChatStatus, sendChat } from "../api/healthApi";
import ChatPage from "./ChatPage";

vi.mock("../api/healthApi", () => ({ sendChat: vi.fn(), getChatStatus: vi.fn() }));
vi.mock("@/helpers/toolsHelper", () => ({ showErrorDialog: vi.fn(), showConfirmDialog: vi.fn() }));

const rules = { mode: "rules" as const, provider: null, suggestions: ["Berapa batas gula sehari?", "Apa gejala diabetes?"] };

describe("ChatPage", () => {
  beforeEach(() => { vi.clearAllMocks(); vi.mocked(getChatStatus).mockResolvedValue(rules); });

  it("menampilkan status mode dasar beserta cara mengaktifkan AI", async () => {
    renderWithProviders(<ChatPage />);
    expect(await screen.findByText(/Mode dasar/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Lihat caranya" })).toHaveAttribute("href", "/bantuan#ai");
  });

  it("menampilkan mode AI dan menyapa pengguna yang login", async () => {
    vi.mocked(getChatStatus).mockResolvedValue({ ...rules, mode: "ai", provider: "gemini" });
    renderWithProviders(<ChatPage />, {
      authUser: { id: 1, name: "Budi Santoso", email: "budi@test.com" },
    });
    expect(await screen.findByText("Mode AI aktif (gemini)")).toBeInTheDocument();
    expect(screen.getByText(/Halo, Budi Santoso!/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Lihat caranya" })).not.toBeInTheDocument();
  });

  it("mengirim pesan, menampilkan balasan, dan memperbarui saran; pesan kosong diabaikan", async () => {
    vi.mocked(sendChat).mockResolvedValue({ reply: "Batas 50 g per hari.", mode: "rules", suggestions: ["Saran baru"] });
    renderWithProviders(<ChatPage />);
    await screen.findByText(/Mode dasar/);
    await userEvent.click(screen.getByRole("button", { name: /Kirim/ }));
    expect(sendChat).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText("Pesan"), "batas gula?");
    await userEvent.click(screen.getByRole("button", { name: /Kirim/ }));
    expect(sendChat).toHaveBeenCalledWith("batas gula?");
    expect(await screen.findByText("Batas 50 g per hari.")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /Saran baru/ })).toBeInTheDocument();
  });

  it("tombol pertanyaan cepat mengirim pesan; balasan tanpa saran mempertahankan chip", async () => {
    vi.mocked(sendChat).mockResolvedValue({ reply: "Jawaban", mode: "rules" });
    renderWithProviders(<ChatPage />);
    await userEvent.click(await screen.findByRole("button", { name: /Apa gejala diabetes\?/ }));
    expect(sendChat).toHaveBeenCalledWith("Apa gejala diabetes?");
    expect(await screen.findByText("Jawaban")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Apa gejala diabetes\?/ })).toBeInTheDocument();
  });

  it("indikator mengetik dan error", async () => {
    let reject!: (e: Error) => void;
    vi.mocked(sendChat).mockReturnValueOnce(new Promise((_, rej) => { reject = rej; }));
    renderWithProviders(<ChatPage />);
    await userEvent.type(screen.getByLabelText("Pesan"), "halo");
    await userEvent.click(screen.getByRole("button", { name: /Kirim/ }));
    expect(screen.getByText(/sedang mengetik/)).toBeInTheDocument();
    reject(new Error("gagal"));
    await vi.waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("gagal"));
  });

  it("gagal memuat status menampilkan error", async () => {
    vi.mocked(getChatStatus).mockRejectedValue(new Error("status gagal"));
    renderWithProviders(<ChatPage />);
    await vi.waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("status gagal"));
  });

  it("hapus percakapan memakai konfirmasi", async () => {
    vi.mocked(sendChat).mockResolvedValue({ reply: "Jawaban", mode: "rules" });
    renderWithProviders(<ChatPage />);
    const clear = screen.getByRole("button", { name: /Hapus percakapan/ });
    await userEvent.click(clear); // belum ada percakapan: tidak melakukan apa pun
    expect(showConfirmDialog).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText("Pesan"), "halo");
    await userEvent.click(screen.getByRole("button", { name: /Kirim/ }));
    await screen.findByText("Jawaban");
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(false);
    await userEvent.click(clear);
    expect(screen.getByText("Jawaban")).toBeInTheDocument();
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    await userEvent.click(clear);
    expect(screen.queryByText("Jawaban")).not.toBeInTheDocument();
  });
});
