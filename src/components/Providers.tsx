"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppDispatch } from "@/hooks/redux";
import { asyncCheckAuth } from "@/features/auth/states/action";

function AuthBootstrap() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(asyncCheckAuth());
  }, [dispatch]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
}
