import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { searchFoods } from "../api/foodApi";
import { addLog, getToday } from "@/features/logs/api/logApi";
import type { Food } from "@/types";
import FoodsPage from "./FoodsPage";

vi.mock("../api/foodApi", () => ({ searchFoods: vi.fn() }));
vi.mock("@/features/logs/api/logApi", () => ({ addLog: vi.fn(), getToday: vi.fn(), deleteLog: vi.fn() }));
vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showUndoToast: vi.fn(),
  showConfirmDialog: vi.fn(),
  formatTime: vi.fn(),
}));

const food: Food = {
  id: "es-teh-manis",
  name: "Es teh manis",
  portion: "1 gelas",
  sugar_g: 20,
  carbs_g: 21,
  category: "minuman",
  aliases: "",
  light: "merah",
};

describe("FoodsPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memuat daftar makanan dan mencatat konsumsi", async () => {
    vi.mocked(searchFoods).mockResolvedValue([food]);
    vi.mocked(addLog).mockResolvedValue({ id: 1, food: "Es teh manis", servings: 1, sugar_g: 20 });
    vi.mocked(getToday).mockResolvedValue({ total_sugar_g: 20, limit_g: 50, percent: 40, logs: [] });

    renderWithProviders(<FoodsPage />);
    expect(await screen.findByText("Es teh manis")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Catat" }));
    await waitFor(() => expect(addLog).toHaveBeenCalledWith("es-teh-manis", 1));
  });

  it("mengetik pada kolom cari memicu pencarian baru", async () => {
    vi.mocked(searchFoods).mockResolvedValue([]);
    renderWithProviders(<FoodsPage />);
    await userEvent.type(screen.getByLabelText("Cari makanan"), "teh");
    await waitFor(() => expect(searchFoods).toHaveBeenLastCalledWith("teh"));
    expect(await screen.findByText("Makanan tidak ditemukan.")).toBeInTheDocument();
  });

  it("menampilkan status mencari saat memuat", () => {
    vi.mocked(searchFoods).mockReturnValue(new Promise(() => {}));
    renderWithProviders(<FoodsPage />, { isFoods: true });
    expect(screen.getByText("Mencari...")).toBeInTheDocument();
  });

  it("tombol / memfokuskan kolom pencarian, kecuali saat sedang mengetik", async () => {
    vi.mocked(searchFoods).mockResolvedValue([food]);
    renderWithProviders(<FoodsPage />);
    await screen.findByText("Es teh manis");
    const input = screen.getByLabelText("Cari makanan");
    await userEvent.keyboard("/");
    expect(input).toHaveFocus();
    expect(input).toHaveValue("");
    await userEvent.keyboard("a");
    await userEvent.keyboard("/");
    expect(input).toHaveValue("a/");
  });

  it("dapat memilih ide pencarian cepat", async () => {
    vi.mocked(searchFoods).mockResolvedValue([food]);
    renderWithProviders(<FoodsPage />);

    const sodaBtn = screen.getByRole("button", { name: "soda" });
    await userEvent.click(sodaBtn);
    expect(screen.getByLabelText("Cari makanan")).toHaveValue("soda");
  });
});
