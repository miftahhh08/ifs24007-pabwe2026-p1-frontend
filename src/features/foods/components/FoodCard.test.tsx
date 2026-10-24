import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Food } from "@/types";
import FoodCard from "./FoodCard";

const base: Food = {
  id: "es-teh-manis",
  name: "Es teh manis",
  portion: "1 gelas",
  sugar_g: 20,
  carbs_g: 21,
  category: "minuman",
  aliases: "",
  light: "merah",
};

describe("FoodCard", () => {
  it.each([
    ["hijau", "Rendah"],
    ["kuning", "Sedang"],
    ["merah", "Tinggi"],
  ] as const)("menampilkan badge %s", (light, label) => {
    render(<ul><FoodCard food={{ ...base, light }} onAdd={vi.fn()} /></ul>);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("memanggil onAdd dengan jumlah porsi yang diubah", async () => {
    const onAdd = vi.fn();
    render(<ul><FoodCard food={base} onAdd={onAdd} /></ul>);
    const input = screen.getByLabelText("Jumlah porsi Es teh manis");
    await userEvent.clear(input);
    await userEvent.type(input, "2");
    await userEvent.click(screen.getByRole("button", { name: "Catat" }));
    expect(onAdd).toHaveBeenCalledWith("es-teh-manis", 2);
  });
});
