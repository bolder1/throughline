"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Card — the bordered/elevated container used to group related content
 * (inbox row groups, decision-log items, dashboard cells).
 *
 * Variants
 *   surface   solid surface with hairline border — default
 *   raised    same plus a small shadow — used for hover-elevated rows
 *   muted     uses surface-2 fill instead — for inset / nested cards
 *   outline   transparent fill, just a border — used inside dense lists
 *
 * Pad sizes
 *   none / sm / md / lg
 *
 * Pair with CardHeader / CardTitle / CardBody / CardFooter when you want
 * the standard newspaper-cell composition.
 */
const cardVariants = cva(
  "rounded-[var(--radius-lg)] transition-shadow duration-[var(--duration-base)] ease-[var(--ease-standard)]",
  {
    variants: {
      variant: {
        surface: "bg-surface border border-border",
        raised:
          "bg-surface border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        muted: "bg-surface-2 border border-transparent",
        outline: "bg-transparent border border-border",
      },
      pad: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-7",
      },
      interactive: {
        true: "cursor-pointer hover:border-border-strong",
        false: "",
      },
    },
    defaultVariants: {
      variant: "surface",
      pad: "md",
      interactive: false,
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, pad, interactive, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, pad, interactive }), className)}
      {...rest}
    />
  );
});

export function CardHeader({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-start justify-between gap-3 mb-3", className)}
      {...rest}
    />
  );
}

export function CardTitle({
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-[var(--text-md)] font-semibold text-foreground tracking-tight",
        className
      )}
      {...rest}
    />
  );
}

export function CardDescription({
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[var(--text-sm)] text-foreground-muted", className)}
      {...rest}
    />
  );
}

export function CardBody({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-[var(--text-sm)]", className)} {...rest} />;
}

export function CardFooter({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 pt-3 border-t border-border flex items-center justify-end gap-2",
        className
      )}
      {...rest}
    />
  );
}

export { cardVariants };
