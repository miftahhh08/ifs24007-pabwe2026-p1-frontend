import { useState, type ChangeEvent } from "react";

export function useInput(initial = ""): [string, (e: ChangeEvent<HTMLInputElement>) => void, (v: string) => void] {
  const [value, setValue] = useState(initial);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
  return [value, onChange, setValue];
}
