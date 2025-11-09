import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";

describe("Button", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled button</Button>);

    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
  });

  it("should not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        Disabled button
      </Button>
    );

    const button = screen.getByRole("button", { name: /disabled button/i });
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should apply custom className", () => {
    render(<Button className="custom-class">Button</Button>);

    const button = screen.getByRole("button", { name: /button/i });
    expect(button).toHaveClass("custom-class");
  });

  it("should render as different element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>
    );

    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("should support different variants", () => {
    const { rerender } = render(<Button variant="default">Button</Button>);
    let button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    rerender(<Button variant="destructive">Button</Button>);
    button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    rerender(<Button variant="outline">Button</Button>);
    button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should support different sizes", () => {
    const { rerender } = render(<Button size="default">Button</Button>);
    let button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    rerender(<Button size="sm">Button</Button>);
    button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    rerender(<Button size="lg">Button</Button>);
    button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});

