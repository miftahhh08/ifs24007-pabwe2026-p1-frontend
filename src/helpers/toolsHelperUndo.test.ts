import Swal from "sweetalert2";
import { showUndoToast } from "./toolsHelper";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

describe("showUndoToast", () => {
  it("mengembalikan true saat Urungkan ditekan, false saat tidak", async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true } as never);
    expect(await showUndoToast("ok")).toBe(true);
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: false } as never);
    expect(await showUndoToast("ok")).toBe(false);
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ confirmButtonText: "Urungkan", toast: true }));
  });
});
