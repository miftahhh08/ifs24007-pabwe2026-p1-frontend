import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore, type RootState } from "@/store";

export function renderWithProviders(ui: React.ReactElement, preloadedState?: Partial<RootState>) {
  const store = makeStore(preloadedState);
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  const result = render(ui, { wrapper: Wrapper });
  return {
    store,
    ...result,
    rerender: (rerenderUi: React.ReactElement) => result.rerender(<Wrapper>{rerenderUi}</Wrapper>),
  };
}
