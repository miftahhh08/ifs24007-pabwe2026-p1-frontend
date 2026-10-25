import { getErrorMessage } from "./errorHelper";

describe("getErrorMessage", () => {
  it("mengambil pesan dari Error", () => {
    expect(getErrorMessage(new Error("gagal"))).toBe("gagal");
  });

  it("menerima string", () => {
    expect(getErrorMessage("pesan")).toBe("pesan");
  });

  it("memakai fallback untuk nilai lain", () => {
    expect(getErrorMessage(undefined)).toBe("Terjadi kesalahan");
    expect(getErrorMessage(null, "Cadangan")).toBe("Cadangan");
    expect(getErrorMessage(new Error(""))).toBe("Terjadi kesalahan");
  });
});
