import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { showErrorDialog } from "@/helpers/toolsHelper";
import { calcLabel } from "../api/healthApi";
import LabelPage from "./LabelPage";

vi.mock("../api/healthApi", () => ({ calcLabel: vi.fn() }));
vi.mock("@/helpers/toolsHelper", () => ({ showErrorDialog: vi.fn() }));

const res = (light: "hijau" | "kuning" | "merah", pct: number) =>
  ({ total_sugar_g: 20, pack_sugar_g: 30, spoons: 1.6, percent_of_limit: pct, light });

async function submit(sugar = "10") {
  await userEvent.type(screen.getByLabelText("Gula per sajian"), sugar);
  await userEvent.click(screen.getByRole("button", { name: "Hitung" }));
}

describe("LabelPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menghitung dan menampilkan hasil dengan kategori", async () => {
    vi.mocked(calcLabel).mockResolvedValue(res("merah", 120));
    renderWithProviders(<LabelPage />);
    await userEvent.clear(screen.getByLabelText("Sajian per kemasan"));
    await userEvent.type(screen.getByLabelText("Sajian per kemasan"), "3");
    await userEvent.clear(screen.getByLabelText("Sajian dikonsumsi"));
    await userEvent.type(screen.getByLabelText("Sajian dikonsumsi"), "2");
    await submit();
    expect(calcLabel).toHaveBeenCalledWith(10, 3, 2);
    expect(await screen.findByText("20 g gula")).toBeInTheDocument();
    expect(screen.getByText("Kategori gula: Tinggi")).toBeInTheDocument();
  });

  it.each([["hijau", 10, "Rendah"], ["kuning", 70, "Sedang"]] as const)("kategori %s", async (light, pct, label) => {
    vi.mocked(calcLabel).mockResolvedValue(res(light, pct));
    renderWithProviders(<LabelPage />);
    await submit();
    expect(await screen.findByText(`Kategori gula: ${label}`)).toBeInTheDocument();
  });

  it("validasi inline: tidak memanggil API dan hilang saat diperbaiki", async () => {
    renderWithProviders(<LabelPage />);
    await userEvent.click(screen.getByRole("button", { name: "Hitung" }));
    expect(screen.getByText("Gula per sajian wajib diisi dengan angka.")).toBeInTheDocument();
    expect(calcLabel).not.toHaveBeenCalled();
    vi.mocked(calcLabel).mockResolvedValue(res("hijau", 5));
    await userEvent.type(screen.getByLabelText("Gula per sajian"), "5");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("tombol Kosongkan mengembalikan form", async () => {
    vi.mocked(calcLabel).mockResolvedValue(res("hijau", 5));
    renderWithProviders(<LabelPage />);
    await submit("5");
    await screen.findByText("20 g gula");
    await userEvent.click(screen.getByRole("button", { name: /Kosongkan/ }));
    expect(screen.queryByText("20 g gula")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Gula per sajian")).toHaveValue(null);
  });

  it("menampilkan error dari server", async () => {
    vi.mocked(calcLabel).mockRejectedValue(new Error("Data label tidak valid"));
    renderWithProviders(<LabelPage />);
    await submit("1");
    await vi.waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Data label tidak valid"));
  });
});
