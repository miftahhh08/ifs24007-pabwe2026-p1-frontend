import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";

// Tipe dispatch untuk thunk (sengaja tidak mengimpor store agar tidak sirkular).
export type ThunkAppDispatch = ThunkDispatch<unknown, unknown, UnknownAction>;
