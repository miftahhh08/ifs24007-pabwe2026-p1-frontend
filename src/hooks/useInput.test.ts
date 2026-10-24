import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("memakai nilai awal kosong secara default", () => {
    const { result } = renderHook(() => useInput());
    expect(result.current[0]).toBe("");
  });

  it("memperbarui nilai lewat onChange", () => {
    const { result } = renderHook(() => useInput("a"));
    act(() => result.current[1]({ target: { value: "b" } } as ChangeEvent<HTMLInputElement>));
    expect(result.current[0]).toBe("b");
  });

  it("memperbarui nilai lewat setter", () => {
    const { result } = renderHook(() => useInput());
    act(() => result.current[2]("z"));
    expect(result.current[0]).toBe("z");
  });
});
