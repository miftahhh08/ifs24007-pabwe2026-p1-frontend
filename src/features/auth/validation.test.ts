import { describe, expect, it } from "vitest";
import { validateAuthForm } from "./validation";

const valid = { name: "Budi", email: "budi@mail.com", password: "rahasia1" };

describe("validateAuthForm", () => {
  it("menerima data login dan daftar yang valid", () => {
    expect(validateAuthForm("login", valid)).toBeNull();
    expect(validateAuthForm("register", valid)).toBeNull();
  });

  it("menolak email tidak valid", () => {
    expect(validateAuthForm("login", { ...valid, email: "salah" })).toBe("Format email tidak valid");
    expect(validateAuthForm("login", { ...valid, email: "  " })).toBe("Format email tidak valid");
  });

  it("menolak kata sandi pendek", () => {
    expect(validateAuthForm("login", { ...valid, password: "123" })).toBe("Kata sandi minimal 6 karakter");
  });

  it("memeriksa nama hanya saat daftar", () => {
    expect(validateAuthForm("login", { ...valid, name: "" })).toBeNull();
    expect(validateAuthForm("register", { ...valid, name: "A" })).toBe("Nama lengkap wajib diisi (2-100 karakter)");
    expect(validateAuthForm("register", { ...valid, name: "x".repeat(101) })).toBe("Nama lengkap wajib diisi (2-100 karakter)");
  });
});
