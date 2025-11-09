# Testing Guide

This project uses [Vitest](https://vitest.dev/) for testing, following modern best practices for clean, readable, and maintainable tests.

## Setup

Install dependencies:

```bash
npm install
```

## Running Tests

```bash
# Run tests in watch mode (default)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Test Structure

Tests are co-located with their source files using the `__tests__` directory pattern:

```
lib/
  ├── __tests__/
  │   ├── utils.test.ts
  │   └── validation.test.ts
  └── utils.ts

components/
  └── ui/
      ├── __tests__/
      │   └── button.test.tsx
      └── button.tsx
```

## Writing Tests

### Best Practices

1. **Test Behavior, Not Implementation**

   - Focus on what the code does, not how it does it
   - Tests should remain stable when refactoring internals

2. **Use Descriptive Test Names**

   - Test names should clearly describe what is being tested
   - Use `describe` blocks to group related tests

3. **Follow AAA Pattern**

   - **Arrange**: Set up test data and conditions
   - **Act**: Execute the code being tested
   - **Assert**: Verify the expected outcome

4. **Keep Tests Simple and Focused**

   - Each test should verify one specific behavior
   - Avoid complex setup and teardown

5. **Use Role-Based Queries**
   - Prefer `getByRole`, `getByLabelText`, `getByText` over class/ID selectors
   - Makes tests more resilient to UI changes

### Example: Unit Test

```typescript
import { describe, it, expect } from "vitest";
import { formatTime } from "../utils";

describe("formatTime", () => {
  it("should format positive seconds correctly", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(30)).toBe("0:30");
    expect(formatTime(60)).toBe("1:00");
  });

  it("should format negative seconds correctly", () => {
    expect(formatTime(-30)).toBe("-0:30");
  });
});
```

### Example: Component Test

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";

describe("Button", () => {
  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Test Utilities

Use the test utilities in `lib/__tests__/test-utils.tsx`:

- `createMockCrawlData()` - Creates mock crawl data for testing
- `mockNextRouter()` - Mocks Next.js router for component tests
- `waitForAsync()` - Helper for async operations

## Coverage Goals

- **Critical paths**: 90%+ (encoding/decoding, validation, form submission)
- **Components**: 80%+ (user-facing components)
- **Utilities**: 95%+ (pure functions)
- **Overall**: 75%+ (realistic for production)

## Vitest Features

### Built-in Features

- **Fast execution** - Powered by Vite
- **TypeScript support** - Out of the box
- **Watch mode** - Smart re-running of related tests
- **Coverage** - Built-in coverage reporting
- **Mocking** - Powerful mocking capabilities

### Configuration

See `vitest.config.ts` for configuration options.

## Common Patterns

### Testing Async Functions

```typescript
it("should handle async operations", async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Error Cases

```typescript
it("should throw error for invalid input", () => {
  expect(() => functionWithValidation(invalidInput)).toThrow();
});
```

### Mocking Browser APIs

```typescript
it("should use clipboard API", async () => {
  const mockWriteText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, {
    clipboard: { writeText: mockWriteText },
  });

  await copyToClipboard("test");
  expect(mockWriteText).toHaveBeenCalledWith("test");
});
```

### Testing Form Interactions

```typescript
it("should submit form with valid data", async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn();

  render(<Form onSubmit={handleSubmit} />);

  await user.type(screen.getByLabelText(/email/i), "test@example.com");
  await user.click(screen.getByRole("button", { name: /submit/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    email: "test@example.com",
  });
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro/)
