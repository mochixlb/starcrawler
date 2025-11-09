import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { FormInput } from "../form-input";

describe("FormInput", () => {
  it("should render with label", () => {
    render(<FormInput label="Episode Number" />);

    expect(screen.getByLabelText(/episode number/i)).toBeInTheDocument();
  });

  it("should render input element", () => {
    render(<FormInput label="Test Input" />);

    const input = screen.getByLabelText(/test input/i);
    expect(input).toBeInstanceOf(HTMLInputElement);
  });

  it("should associate label with input using id", () => {
    render(<FormInput label="Test Input" id="custom-id" />);

    const input = screen.getByLabelText(/test input/i);
    expect(input).toHaveAttribute("id", "custom-id");
  });

  it("should generate id from label when id is not provided", () => {
    render(<FormInput label="Episode Number" />);

    const input = screen.getByLabelText(/episode number/i);
    const label = screen.getByText(/episode number/i);

    expect(input).toHaveAttribute("id");
    expect(label).toHaveAttribute("for", input.id);
    expect(input.id).toContain("episode-number");
  });

  it("should handle input value changes", async () => {
    const user = userEvent.setup();
    render(<FormInput label="Test Input" />);

    const input = screen.getByLabelText(/test input/i) as HTMLInputElement;
    await user.type(input, "test value");

    expect(input.value).toBe("test value");
  });

  it("should apply yellow label color by default", () => {
    render(<FormInput label="Test Input" />);

    const label = screen.getByText(/test input/i);
    expect(label).toHaveClass("text-crawl-yellow");
  });

  it("should apply cyan label color when specified", () => {
    render(<FormInput label="Test Input" labelColor="cyan" />);

    const label = screen.getByText(/test input/i);
    expect(label).toHaveClass("text-crawl-cyan");
  });

  it("should apply yellow border color by default", () => {
    render(<FormInput label="Test Input" />);

    const input = screen.getByLabelText(/test input/i);
    expect(input).toHaveClass("border-crawl-yellow/30");
  });

  it("should apply cyan border color when labelColor is cyan", () => {
    render(<FormInput label="Test Input" labelColor="cyan" />);

    const input = screen.getByLabelText(/test input/i);
    expect(input).toHaveClass("border-crawl-cyan/30");
  });

  it("should apply error border color when error is true", () => {
    render(<FormInput label="Test Input" error />);

    const input = screen.getByLabelText(/test input/i);
    expect(input).toHaveClass("border-red-500/50");
  });

  it("should display error message when error and errorMessage are provided", () => {
    render(
      <FormInput label="Test Input" error errorMessage="This field is required" />
    );

    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it("should not display error message when error is false", () => {
    render(
      <FormInput
        label="Test Input"
        error={false}
        errorMessage="This field is required"
      />
    );

    expect(
      screen.queryByText(/this field is required/i)
    ).not.toBeInTheDocument();
  });

  it("should not display error message when errorMessage is not provided", () => {
    render(<FormInput label="Test Input" error />);

    const input = screen.getByLabelText(/test input/i);
    const errorId = `${input.id}-error`;
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(document.getElementById(errorId)).not.toBeInTheDocument();
  });

  it("should set aria-invalid when error is true", () => {
    render(<FormInput label="Test Input" error />);

    const input = screen.getByLabelText(/test input/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("should not set aria-invalid when error is false", () => {
    render(<FormInput label="Test Input" error={false} />);

    const input = screen.getByLabelText(/test input/i);
    expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  it("should set aria-describedby when error and errorMessage are provided", () => {
    render(
      <FormInput label="Test Input" error errorMessage="Error message" />
    );

    const input = screen.getByLabelText(/test input/i);
    const errorId = `${input.id}-error`;
    expect(input).toHaveAttribute("aria-describedby", errorId);
  });

  it("should have role='alert' on error message", () => {
    render(
      <FormInput label="Test Input" error errorMessage="Error message" />
    );

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Error message");
  });

  it("should have aria-live='polite' on error message", () => {
    render(
      <FormInput label="Test Input" error errorMessage="Error message" />
    );

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveAttribute("aria-live", "polite");
  });

  it("should forward ref", () => {
    const ref = vi.fn();
    render(<FormInput label="Test Input" ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it("should merge custom className", () => {
    render(<FormInput label="Test Input" className="custom-class" />);

    const input = screen.getByLabelText(/test input/i);
    expect(input).toHaveClass("custom-class");
  });

  it("should pass through input props", () => {
    render(
      <FormInput
        label="Test Input"
        type="email"
        placeholder="Enter email"
        required
      />
    );

    const input = screen.getByLabelText(/test input/i);
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "Enter email");
    expect(input).toBeRequired();
  });

  it("should handle controlled input", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <FormInput label="Test Input" value="initial" onChange={handleChange} />
    );

    const input = screen.getByLabelText(/test input/i) as HTMLInputElement;
    expect(input.value).toBe("initial");

    await user.clear(input);
    await user.type(input, "new value");

    expect(handleChange).toHaveBeenCalled();
  });

  it("should handle disabled state", () => {
    render(<FormInput label="Test Input" disabled />);

    const input = screen.getByLabelText(/test input/i);
    expect(input).toBeDisabled();
  });

  it("should generate ids from label text", () => {
    render(<FormInput label="Episode Number" />);

    const input = screen.getByLabelText(/episode number/i);
    expect(input.id).toContain("episode-number");
  });

  it("should handle multiple inputs with different labels", () => {
    render(
      <>
        <FormInput label="Episode Number" />
        <FormInput label="Episode Subtitle" />
      </>
    );

    const episodeNumberInput = screen.getByLabelText(/episode number/i);
    const episodeSubtitleInput = screen.getByLabelText(/episode subtitle/i);

    expect(episodeNumberInput.id).not.toBe(episodeSubtitleInput.id);
  });

  it("should apply clip-path style", () => {
    render(<FormInput label="Test Input" />);

    const input = screen.getByLabelText(/test input/i);
    expect(input).toHaveStyle({
      clipPath:
        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
    });
  });
});

