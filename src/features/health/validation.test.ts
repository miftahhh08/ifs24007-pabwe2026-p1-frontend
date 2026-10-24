import { validateGlucose, validateLabel, validateRisk } from "./validation";

describe("validation", () => {
  it("label", () => {
    expect(validateLabel("10", "1", "1")).toEqual({});
    expect(Object.keys(validateLabel("", "0", "0"))).toEqual(["sugar", "pack", "eaten"]);
    expect(validateLabel("501", "1", "1").sugar).toContain("antara 0 dan 500 g");
  });
  it("glukosa", () => {
    expect(validateGlucose("100")).toEqual({});
    expect(validateGlucose("abc").value).toContain("wajib");
    expect(validateGlucose("700").value).toContain("antara 20 dan 600 mg/dL");
  });
  it("risiko", () => {
    expect(validateRisk({ age: "30", heightCm: "160", weightKg: "55", waistCm: "70" })).toEqual({});
    expect(Object.keys(validateRisk({ age: "10", heightCm: "", weightKg: "1", waistCm: "999" }))).toHaveLength(4);
  });
});
