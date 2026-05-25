"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Input — text input primitive.
 *
 * Variants
 *   size      sm 28px / md 36px / lg 44px
 *   tone      default | error
 *
 * Composition slots — iconLeft and iconRight wire small icons inside the
 * input chrome without breaking padding. The Field wrapper below pairs an
 * input with a label + helper / error text.
 */
const inputVariants = cva(
  [
    "w-full",
    "bg-surface text-foreground",
    "border rounded-[var(--radius-sm)]",
    "transition-[border-color,box-shadow,background-color]",
    "duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
    "placeholder:text-foreground-subtle",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "focus:outline-none focus-visible:outline-none",
    "focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_22%,transparent)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-7 px-2.5 text-[var(--text-sm)]",
        md: "h-9 px-3 text-[var(--text-base)]",
        lg: "h-11 px-3.5 text-[var(--text-md)]",
      },
      tone: {
        default: "border-border hover:border-border-strong",
        error:
          "border-[color:var(--danger)] focus:border-[color:var(--danger)] focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--danger)_22%,transparent)]",
      },
      hasIconLeft: { true: "", false: "" },
      hasIconRight: { true: "", false: "" },
    },
    compoundVariants: [
      { size: "sm", hasIconLeft: true, class: "pl-7" },
      { size: "md", hasIconLeft: true, class: "pl-9" },
      { size: "lg", hasIconLeft: true, class: "pl-10" },
      { size: "sm", hasIconRight: true, class: "pr-7" },
      { size: "md", hasIconRight: true, class: "pr-9" },
      { size: "lg", hasIconRight: true, class: "pr-10" },
    ],
    defaultVariants: {
      size: "md",
      tone: "default",
      hasIconLeft: false,
      hasIconRight: false,
    },
  }
);

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

export interface InputProps
  extends BaseInputProps,
    Pick<VariantProps<typeof inputVariants>, "size" | "tone"> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, tone, iconLeft, iconRight, ...rest },
  ref
) {
  if (!iconLeft && !iconRight) {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ size, tone }), className)}
        {...rest}
      />
    );
  }

  return (
    <div className="relative inline-flex w-full items-center">
      {iconLeft && (
        <span
          className="pointer-events-none absolute left-2.5 inline-flex text-foreground-subtle"
          aria-hidden
        >
          {iconLeft}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          inputVariants({
            size,
            tone,
            hasIconLeft: Boolean(iconLeft),
            hasIconRight: Boolean(iconRight),
          }),
          className
        )}
        {...rest}
      />
      {iconRight && (
        <span
          className="pointer-events-none absolute right-2.5 inline-flex text-foreground-subtle"
          aria-hidden
        >
          {iconRight}
        </span>
      )}
    </div>
  );
});

/* ──────────────────────────────────────────────────────────────────
   Textarea — same surface vocabulary as Input.
   ────────────────────────────────────────────────────────────── */
export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  tone?: "default" | "error";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, tone = "default", ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[88px] py-2 px-3 text-[var(--text-base)]",
          "bg-surface text-foreground",
          "border rounded-[var(--radius-sm)]",
          "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          "placeholder:text-foreground-subtle",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus-visible:outline-none",
          tone === "default" &&
            "border-border hover:border-border-strong focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_22%,transparent)]",
          tone === "error" &&
            "border-[color:var(--danger)] focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--danger)_22%,transparent)]",
          className
        )}
        {...rest}
      />
    );
  }
);

/* ──────────────────────────────────────────────────────────────────
   Field — label + helper / error wrapper. Pairs with Input, Textarea,
   Select.
   ────────────────────────────────────────────────────────────── */
export interface FieldProps {
  id?: string;
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({
  id,
  label,
  helper,
  error,
  required,
  children,
  className,
}: FieldProps) {
  const descriptionId = id ? `${id}-description` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-[var(--text-sm)] font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-0.5 text-[color:var(--danger)]">*</span>}
        </label>
      )}
      {children}
      {(helper || error) && (
        <p
          id={descriptionId}
          className={cn(
            "text-[var(--text-xs)]",
            error ? "text-[color:var(--danger)]" : "text-foreground-muted"
          )}
        >
          {error ?? helper}
        </p>
      )}
    </div>
  );
}

export { inputVariants };
