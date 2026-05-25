"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Modal — centered dialog primitive.
 *
 * Use for short, focused interactions: confirms, small forms,
 * keyboard shortcuts cheatsheet. For task-shaped flows that need a wider
 * surface (the Resolve form, item detail), use Sheet instead.
 *
 * Behavior
 *   open               controls visibility
 *   onOpenChange       called with false on overlay click, Escape, × button
 *   dismissible        if false, overlay click and Escape do nothing
 *   size               sm 360 / md 480 / lg 640 / xl 800
 *
 * Composition: <Modal><ModalHeader><ModalTitle/><ModalDescription/></ModalHeader>
 *              <ModalBody/><ModalFooter/></Modal>
 */
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dismissible?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
}

const widthBySize = {
  sm: "max-w-[360px]",
  md: "max-w-[480px]",
  lg: "max-w-[640px]",
  xl: "max-w-[800px]",
};

export function Modal({
  open,
  onOpenChange,
  dismissible = true,
  size = "md",
  children,
}: ModalProps) {
  const close = useCallback(() => {
    if (dismissible) onOpenChange(false);
  }, [dismissible, onOpenChange]);

  // Escape closes; lock body scroll while open.
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

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
            onClick={close}
            className="absolute inset-0 bg-overlay backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className={cn(
              "relative w-full bg-surface text-foreground",
              "border border-border rounded-[var(--radius-lg)]",
              "shadow-[var(--shadow-overlay)]",
              widthBySize[size]
            )}
          >
            {dismissible && (
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-surface-2 hover:text-foreground"
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

export function ModalHeader({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 pt-5 pb-3 pr-12", className)} {...rest} />
  );
}

export function ModalTitle({
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

export function ModalDescription({
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

export function ModalBody({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-2", className)} {...rest} />;
}

export function ModalFooter({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-3 px-5 pb-5 pt-3 border-t border-border flex items-center justify-end gap-2",
        className
      )}
      {...rest}
    />
  );
}

/* Tiny utility: focuses a ref'd element when the modal opens. */
export function useAutoFocus<T extends HTMLElement>(open: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (open) {
      // Wait a tick for the modal to mount.
      const id = window.setTimeout(() => ref.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
  }, [open]);
  return ref;
}
