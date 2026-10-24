import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import type { TodayData } from "@/types";
import NextSteps from "./NextSteps";

const today = (percent: number, n = 1): TodayData => ({
  total_sugar_g: percent / 2, limit_g: 50, percent,
  logs: Array.from({ length: n }, (_, i) => ({ id: i, name: "x", servings: 1, sugar_g: 1, eaten_at: "2026-10-24 08:00:00" })),
});

describe("NextSteps", () => {
  it("tidak tampil sebelum data hari ini ada", () => {
    const { container } = renderWithProviders(<NextSteps />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    [today(0, 0), "Catat sekarang", "/makanan"],
    [today(120), "Tanya tips ke Sobat Gula", "/sobat-gula"],
    [today(70), "Minta saran Sobat Gula", "/sobat-gula"],
    [today(20), "Cek risiko", "/risiko"],
  ])("saran sesuai kondisi: %#", (data, cta, href) => {
    renderWithProviders(<NextSteps />, { today: data });
    expect(screen.getByRole("link", { name: cta })).toHaveAttribute("href", href);
  });
});
