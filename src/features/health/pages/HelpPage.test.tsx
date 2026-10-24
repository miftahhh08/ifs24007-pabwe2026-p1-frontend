import { render, screen } from "@testing-library/react";
import HelpPage from "./HelpPage";

it("menampilkan panduan, arti warna, FAQ, dan cara mengaktifkan AI", () => {
  const { container } = render(<HelpPage />);
  expect(screen.getByText("Panduan penggunaan")).toBeInTheDocument();
  expect(screen.getByText(/Hijau, rendah/)).toBeInTheDocument();
  expect(screen.getByText("Kenapa batasnya 50 gram?")).toBeInTheDocument();
  expect(screen.getByText(/GEMINI_API_KEY/)).toBeInTheDocument();
  expect(container.querySelector("#ai")).not.toBeNull();
});
