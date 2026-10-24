import { render, screen } from "@testing-library/react";
import SobatGulaAvatar from "./SobatGulaAvatar";
import UserAvatar from "./UserAvatar";

describe("SobatGulaAvatar", () => {
  it("merender avatar maskot dengan ukuran default dan badge opsional", () => {
    const { container, rerender } = render(<SobatGulaAvatar showBadge={true} />);
    expect(screen.getByLabelText("Avatar Sobat Gula")).toBeInTheDocument();
    expect(screen.getByTitle("Sobat Gula Aktif")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();

    rerender(<SobatGulaAvatar size="sm" isTyping={true} showBadge={false} />);
    expect(screen.queryByTitle("Sobat Gula Aktif")).not.toBeInTheDocument();

    rerender(<SobatGulaAvatar size="lg" />);
    rerender(<SobatGulaAvatar size="xl" />);
    expect(screen.getByLabelText("Avatar Sobat Gula")).toBeInTheDocument();
  });
});

describe("UserAvatar", () => {
  it("merender avatar pengguna dengan inisial atau icon default", () => {
    const { rerender } = render(<UserAvatar name="Budi Santoso" />);
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByLabelText("Avatar Budi Santoso")).toBeInTheDocument();

    rerender(<UserAvatar size="sm" name="" />);
    expect(screen.getByLabelText("Avatar Pengguna")).toBeInTheDocument();

    rerender(<UserAvatar />);
    expect(screen.getByLabelText("Avatar Pengguna")).toBeInTheDocument();
  });
});
