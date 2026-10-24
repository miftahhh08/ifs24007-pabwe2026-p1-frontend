import Swal from "sweetalert2";

export function showSuccessDialog(message: string) {
  return Swal.fire({
    icon: "success",
    title: message,
    toast: true,
    position: "top-end",
    timer: 2000,
    showConfirmButton: false,
  });
}

/** Toast dengan tombol "Urungkan" (heuristik 3: kontrol & kebebasan pengguna). */
export async function showUndoToast(message: string): Promise<boolean> {
  const result = await Swal.fire({
    icon: "success",
    title: message,
    toast: true,
    position: "top-end",
    timer: 6000,
    timerProgressBar: true,
    showConfirmButton: true,
    confirmButtonText: "Urungkan",
  });
  return result.isConfirmed;
}

export function showErrorDialog(message: string) {
  return Swal.fire({ icon: "error", title: "Gagal", text: message });
}

export function showWarningDialog(message: string) {
  return Swal.fire({ icon: "warning", title: "Perhatian", text: message });
}

export async function showConfirmDialog(title: string, text: string): Promise<boolean> {
  const result = await Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });
  return result.isConfirmed;
}

/** Format "2026-10-23 16:15:00" menjadi "16.15". */
export function formatTime(value: string): string {
  const time = value.split(" ")[1] ?? value;
  return time.slice(0, 5).replace(":", ".");
}
