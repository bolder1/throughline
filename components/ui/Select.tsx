"use client";

import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Select — native HTML <select> styled to match the Input primitive.
 *
 * Using native select instead of a custom listbox here keeps keyboard,
 * focus, and accessibility correct without a heavy dependency. A future
 * Combobox primitive can layer on top for filter / autocomplete cases.
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "children"> {
  size?: "sm" | "md" | "lg";
  tone?: "default" | "error";
  options: SelectOption[];
  placeholder?: string;
}

const heightBySize = {
  sm: "h-7 pl-2.5 pr-7 text-[var(--text-sm)]",
  md: "h-9 pl-3 pr-8 text-[var(--text-base)]",
  lg: "h-11 pl-3.5 pr-9 text-[var(--text-md)]",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, size = "md", tone = "default", options, placeholder, value, defaultValue, ...rest },
  ref
) {
  return (
    <div className="relative inline-flex w-full items-center">
      <select
        ref={ref}
        value={value}
        defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
        className={cn(
          "w-full appearance-none",
          "bg-surface text-foreground",
          "border rounded-[var(--radius-sm)]",
          "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus-visible:outline-none",
          tone === "default" &&
            "border-border hover:border-border-strong focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_22%,transparent)]",
          tone === "error" &&
            "border-[color:var(--danger)] focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--danger)_22%,transparent)]",
          heightBySize[size],
          className
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={1.75}
        aria-hidden
        className="pointer-events-none absolute right-2.5 text-foreground-subtle"
      />
    </div>
  );
});
