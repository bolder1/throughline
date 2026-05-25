"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Button — the primary action primitive.
 *
 * Variants
 *   primary   filled accent, the "do the thing" button
 *   secondary subtle filled, for safe but non-default actions
 *   outline   bordered, no fill — destructive-adjacent or alt CTA
 *   ghost     no fill, no border — toolbar / row actions
 *   danger    destructive — resolve as "won't do," delete, etc.
 *   link      inline text-button, underlines on hover
 *
 * Sizes
 *   sm  28px tall — dense toolbars, table rows
 *   md  36px tall — default
 *   lg  44px tall — page-level CTAs
 *
 * States
 *   default · hover · focus-visible · active · disabled · loading
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "font-medium select-none",
    "rounded-[var(--radius-md)]",
    "transition-[background-color,border-color,color,box-shadow,transform]",
    "duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "active:translate-y-[0.5px]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-accent text-accent-foreground",
          "hover:bg-accent-hover",
          "shadow-[var(--shadow-xs)]",
        ].join(" "),
        secondary: [
          "bg-surface-2 text-foreground border border-border",
          "hover:bg-background hover:border-border-strong",
        ].join(" "),
        outline: [
          "bg-transparent text-foreground border border-border-strong",
          "hover:bg-surface-2",
        ].join(" "),
        ghost: [
          "bg-transparent text-foreground-muted",
          "hover:bg-surface-2 hover:text-foreground",
        ].join(" "),
        danger: [
          "bg-[color:var(--danger)] text-white",
          "hover:brightness-95",
        ].join(" "),
        link: [
          "bg-transparent text-accent underline-offset-4 px-0 h-auto",
          "hover:underline",
        ].join(" "),
      },
      size: {
        sm: "h-7 px-2.5 text-[var(--text-sm)]",
        md: "h-9 px-3.5 text-[var(--text-base)]",
        lg: "h-11 px-5 text-[var(--text-md)]",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      block: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    block,
    loading = false,
    disabled,
    iconLeft,
    iconRight,
    children,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...rest}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" aria-hidden />
      ) : (
        iconLeft && <span className="-ml-0.5 inline-flex">{iconLeft}</span>
      )}
      <span>{children}</span>
      {iconRight && !loading && (
        <span className="-mr-0.5 inline-flex">{iconRight}</span>
      )}
    </button>
  );
});

export { buttonVariants };
