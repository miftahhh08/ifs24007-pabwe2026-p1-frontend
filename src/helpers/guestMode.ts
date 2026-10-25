const GUEST_KEY = "gulasadar:guest";

export function enableGuestMode(): void {
  try {
    localStorage.setItem(GUEST_KEY, "true");
  } catch {
    /* penyimpanan tidak tersedia */
  }
}

export function disableGuestMode(): void {
  try {
    localStorage.removeItem(GUEST_KEY);
  } catch {
    /* penyimpanan tidak tersedia */
  }
}
