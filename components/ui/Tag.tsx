"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Tag — a small labeled chip. Used for status, source, priority, project,
 * filters. Two flavors:
 *   <Tag>…</Tag>         non-interactive label
 *   <Tag onRemove={…}>…  removable chip with an × button
 *
 * Tone maps to semantic state. Use `tone="neutral"` for source/project
 * labels and the colored tones for status/priority.
 */
const tagVariants = cva(
  [
    "inline-flex items-center gap-1",
    "rounded-[var(--radius-full)]",
    "font-medium leading-none",
    "border",
    "transition-colors duration-[var(--duration-fast)]",
  ].join(" "),
  {
    variants: {
      tone: {
        neutral:
          "bg-surface-2 text-foreground-muted border-border",
        accent:
          "bg-accent-soft text-accent border-transparent dark:text-[color:var(--accent-hover)]",
        success:
          "bg-success-soft text-[color:var(--success)] border-transparent",
        warning:
          "bg-warning-soft text-[color:var(--warning)] border-transparent",
        danger:
          "bg-danger-soft text-[color:var(--danger)] border-transparent",
        ghost:
          "bg-transparent text-foreground-muted border-border",
      },
      size: {
        sm: "h-5 px-2 text-[10.5px] tracking-[0.04em]",
        md: "h-6 px-2.5 text-[11px] tracking-[0.04em]",
        lg: "h-7 px-3 text-[12px] tracking-[0.03em]",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "md",
    },
  }
);

export interface TagProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "onClick">,
    VariantProps<typeof tagVariants> {
  icon?: ReactNode;
  /** Render a small × button with the given handler. */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  removeLabel?: string;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { className, tone, size, icon, onRemove, removeLabel = "Remove", children, ...rest },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(tagVariants({ tone, size }), className)}
      {...rest}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span className="truncate uppercase">{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="-mr-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/15"
        >
          <X size={10} strokeWidth={2.25} />
        </button>
      )}
    </span>
  );
});

/**
 * StatusDot — paired with Tag in inboxes / list rows. Tiny dot indicating
 * a status; same tone vocabulary as Tag.
 */
export interface StatusDotProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}

const dotColor: Record<NonNullable<StatusDotProps["tone"]>, string> = {
  neutral: "bg-foreground-subtle",
  accent: "bg-accent",
  success: "bg-[color:var(--success)]",
  warning: "bg-[color:var(--warning)]",
  danger: "bg-[color:var(--danger)]",
};

export function StatusDot({
  tone = "neutral",
  className,
  ...rest
}: StatusDotProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        dotColor[tone],
        className
      )}
      {...rest}
    />
  );
}

/** Pressable tag — used for filter chips. */
export interface PressableTagProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tagVariants> {
  pressed?: boolean;
  icon?: ReactNode;
}

export const PressableTag = forwardRef<HTMLButtonElement, PressableTagProps>(
  function PressableTag(
    { className, tone, size, pressed, icon, children, ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={pressed}
        data-pressed={pressed || undefined}
        className={cn(
          tagVariants({ tone, size }),
          "cursor-pointer hover:border-border-strong",
          pressed && "bg-foreground text-background border-foreground hover:border-foreground",
          className
        )}
        {...rest}
      >
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        <span className="truncate uppercase">{children}</span>
      </button>
    );
  }
);

export { tagVariants };
