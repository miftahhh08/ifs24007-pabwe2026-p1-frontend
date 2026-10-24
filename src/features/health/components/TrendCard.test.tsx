import { render, screen } from "@testing-library/react";
import { showErrorDialog } from "@/helpers/toolsHelper";
import { getStats } from "@/features/logs/api/logApi";
import TrendCard from "./TrendCard";

vi.mock("@/features/logs/api/logApi", () => ({ getStats: vi.fn() }));
vi.mock("@/helpers/toolsHelper", () => ({ showErrorDialog: vi.fn() }));

describe("TrendCard", () => {
  it("menampilkan grafik dan rangkaian hari", async () => {
    vi.mocked(getStats).mockResolvedValue({
      limit_g: 50, streak: 2,
      days: [{ day: "2026-10-22", sugar_g: 60 }, { day: "2026-10-23", sugar_g: 0 }],
    });
    render(<TrendCard />);
    expect(await screen.findByText("2 hari berturut-turut")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Grafik gula 7 hari" })).toBeInTheDocument();
  });

  it("menampilkan dialog error bila gagal", async () => {
    vi.mocked(getStats).mockRejectedValue(new Error("gagal"));
    const { container } = render(<TrendCard />);
    await vi.waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("gagal"));
    expect(container).toBeEmptyDOMElement();
  });
});
