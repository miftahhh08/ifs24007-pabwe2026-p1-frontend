import { apiRequest } from "@/helpers/apiHelper";
import { searchFoods } from "./foodApi";

vi.mock("@/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

it("searchFoods memanggil GET /api/foods dengan query q", async () => {
  vi.mocked(apiRequest).mockResolvedValue([]);
  await searchFoods("teh");
  expect(apiRequest).toHaveBeenCalledWith("/api/foods", { query: { q: "teh" } });
});
