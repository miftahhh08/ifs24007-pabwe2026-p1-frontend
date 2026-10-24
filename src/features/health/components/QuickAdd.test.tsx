import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { searchFoods } from "@/features/foods/api/foodApi";
import { addLog, getToday } from "@/features/logs/api/logApi";
import QuickAdd from "./QuickAdd";

vi.mock("@/features/foods/api/foodApi", () => ({ searchFoods: vi.fn() }));
vi.mock("@/features/logs/api/logApi", () => ({ addLog: vi.fn(), getToday: vi.fn(), deleteLog: vi.fn() }));
vi.mock("@/helpers/toolsHelper", () => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn(), showUndoToast: vi.fn() }));

const food = (id: string) => ({ id, name: `Nama ${id}`, portion: "1 gelas", sugar_g: 20, carbs_g: 1, category: "x", aliases: "", light: "merah" as const });

describe("QuickAdd", () => {
  it("menampilkan makanan populer dan mencatat 1 porsi saat ditekan", async () => {
    vi.mocked(searchFoods).mockResolvedValue([food("es-teh-manis"), food("bakso"), food("tidak-populer")]);
    vi.mocked(addLog).mockResolvedValue({ id: 1, food: "Es teh", servings: 1, sugar_g: 20 });
    vi.mocked(getToday).mockResolvedValue({ total_sugar_g: 20, limit_g: 50, percent: 40, logs: [] });
    renderWithProviders(<QuickAdd />);
    await userEvent.click(await screen.findByRole("button", { name: "Catat cepat Nama es-teh-manis" }));
    await vi.waitFor(() => expect(addLog).toHaveBeenCalledWith("es-teh-manis", 1));
    expect(screen.queryByText("Nama tidak-populer")).not.toBeInTheDocument();
  });

  it("tidak menampilkan apa pun bila gagal memuat", async () => {
    vi.mocked(searchFoods).mockRejectedValue(new Error("x"));
    const { container } = renderWithProviders(<QuickAdd />);
    await vi.waitFor(() => expect(searchFoods).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});
