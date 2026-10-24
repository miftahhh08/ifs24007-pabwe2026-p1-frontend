import { apiRequest } from "@/helpers/apiHelper";
import type { Food } from "@/types";

export function searchFoods(q: string) {
  return apiRequest<Food[]>("/api/foods", { query: { q } });
}
