"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import {
  useCallback,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Sheet — a side-anchored panel that slides in from an edge.
 *
 * Used for: item detail (right), filter / settings (right), navigation
 * on mobile (left). For centered dialogs, use Modal.
 *
 * Behavior matches Modal — open / onOpenChange / dismissible / Escape /
 * body-scroll lock.
 */
export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dismissible?: boolean;
  side?: "left" | "right";
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
}

const widthBySize = {
  sm: "w-full max-w-[360px]",
  md: "w-full max-w-[480px]",
  lg: "w-full max-w-[640px]",
  xl: "w-full max-w-[800px]",
};

export function Sheet({
  open,
  onOpenChange,
  dismissible = true,
  side = "right",
  size = "md",
  children,
}: SheetProps) {
  const close = useCallback(() => {
    if (dismissible) onOpenChange(false);
  }, [dismissible, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const isRight = side === "right";

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
            onClick={close}
            className="absolute inset-0 bg-overlay"
          />
          <motion.div
            initial={{ x: isRight ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRight ? "100%" : "-100%" }}
            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            className={cn(
              "absolute top-0 bottom-0 flex flex-col",
              "bg-surface text-foreground",
              "shadow-[var(--shadow-overlay)]",
              isRight ? "right-0 border-l" : "left-0 border-r",
              "border-border",
              widthBySize[size]
            )}
          >
            {dismissible && (
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-surface-2 hover:text-foreground"
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function SheetHeader({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 pt-5 pb-4 pr-12 border-b border-border",
        className
      )}
      {...rest}
    />
  );
}

export function SheetTitle({
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-[var(--text-lg)] font-semibold tracking-tight",
        className
      )}
      {...rest}
    />
  );
}

export function SheetDescription({
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-1 text-[var(--text-sm)] text-foreground-muted",
        className
      )}
      {...rest}
    />
  );
}

export function SheetBody({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-5 py-4 scrollbar-thin", className)}
      {...rest}
    />
  );
}

export function SheetFooter({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-4 border-t border-border flex items-center justify-end gap-2",
        className
      )}
      {...rest}
    />
  );
}
