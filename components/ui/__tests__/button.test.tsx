import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";

describe("Button", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("should handle click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled button</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} disabled>
        Disabled button
      </Button>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should apply default variant styles", () => {
    render(<Button>Default button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary");
  });

  it("should apply destructive variant styles", () => {
    render(<Button variant="destructive">Delete</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("should apply outline variant styles", () => {
    render(<Button variant="outline">Outline button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border");
  });

  it("should apply secondary variant styles", () => {
    render(<Button variant="secondary">Secondary</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-secondary");
  });

  it("should apply ghost variant styles", () => {
    render(<Button variant="ghost">Ghost button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-accent");
  });

  it("should apply link variant styles", () => {
    render(<Button variant="link">Link button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("underline-offset-4");
  });

  it("should apply default size styles", () => {
    render(<Button>Default size</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-10");
  });

  it("should apply small size styles", () => {
    render(<Button size="sm">Small button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-9");
  });

  it("should apply large size styles", () => {
    render(<Button size="lg">Large button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-11");
  });

  it("should apply icon size styles", () => {
    render(<Button size="icon">Icon button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-10", "w-10");
  });

  it("should merge custom className", () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should forward ref", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref button</Button>);

    expect(ref).toHaveBeenCalled();
  });

  it("should apply custom style prop", () => {
    render(<Button style={{ color: "red" }}>Styled button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("should render as child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>
    );

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("should have touch-action manipulation style", () => {
    render(<Button>Touch button</Button>);

    const button = screen.getByRole("button");
    // Check that touch-action is set via inline style
    expect(button.style.touchAction).toBe("manipulation");
  });

  it("should have proper accessibility attributes", () => {
    render(<Button aria-label="Close dialog">×</Button>);

    const button = screen.getByRole("button", { name: /close dialog/i });
    expect(button).toBeInTheDocument();
  });

  it("should handle keyboard events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Keyboard button</Button>);

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

