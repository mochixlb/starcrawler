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
        ? "text-crawl-cyan"
        : "text-crawl-yellow";
    const borderColorClass =
      labelColor === "cyan"
        ? "border-crawl-cyan/30 focus:border-crawl-cyan focus:ring-crawl-cyan/50"
        : "border-crawl-yellow/30 focus:border-crawl-yellow focus:ring-crawl-yellow/50";

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

