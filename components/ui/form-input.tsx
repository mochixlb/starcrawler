import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelColor?: "cyan" | "yellow";
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, labelColor = "yellow", className, id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const labelColorClass =
      labelColor === "cyan"
        ? "text-starwars-cyan"
        : "text-starwars-yellow";
    const borderColorClass =
      labelColor === "cyan"
        ? "border-starwars-cyan/30 focus:border-starwars-cyan focus:ring-starwars-cyan/50"
        : "border-starwars-yellow/30 focus:border-starwars-yellow focus:ring-starwars-yellow/50";

    return (
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className={cn(
            "text-xs font-medium sm:text-sm",
            labelColorClass
          )}
        >
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-md border bg-black px-3 py-1.5 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2",
            borderColorClass,
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export { FormInput };

