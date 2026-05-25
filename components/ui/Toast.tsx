"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Toast — transient status notifier.
 *
 * Tone vocabulary (mirrors Tag): neutral · accent · success · warning · danger.
 * Mount one <ToastViewport /> at the layout root, then call toast(…) from
 * anywhere via useToast(). Toasts auto-dismiss after `duration` ms unless
 * persistent.
 */
export type ToastTone = "neutral" | "accent" | "success" | "warning" | "danger";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  /** ms — 0 to keep until dismissed. Default 4500. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let counter = 0;
function nextId() {
  counter += 1;
  return `t-${Date.now()}-${counter}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      window.clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback<ToastContextValue["push"]>(
    (input) => {
      const id = input.id ?? nextId();
      const item: ToastItem = {
        tone: "neutral",
        duration: 4500,
        ...input,
        id,
      };
      setToasts((prev) => [...prev, item]);
      if (item.duration && item.duration > 0) {
        const handle = window.setTimeout(() => dismiss(id), item.duration);
        timers.current.set(id, handle);
      }
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({ toasts, push, dismiss }),
    [toasts, push, dismiss]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

const toneStyles: Record<ToastTone, { wrap: string; icon: ReactNode }> = {
  neutral: {
    wrap: "border-border",
    icon: <Info size={16} strokeWidth={1.75} />,
  },
  accent: {
    wrap: "border-border",
    icon: <Info size={16} strokeWidth={1.75} className="text-accent" />,
  },
  success: {
    wrap: "border-border",
    icon: (
      <CheckCircle2
        size={16}
        strokeWidth={1.75}
        className="text-[color:var(--success)]"
      />
    ),
  },
  warning: {
    wrap: "border-border",
    icon: (
      <AlertTriangle
        size={16}
        strokeWidth={1.75}
        className="text-[color:var(--warning)]"
      />
    ),
  },
  danger: {
    wrap: "border-border",
    icon: (
      <AlertCircle
        size={16}
        strokeWidth={1.75}
        className="text-[color:var(--danger)]"
      />
    ),
  },
};

/**
 * ToastViewport — the actual stack. Mount once near the root.
 * Default position: bottom-right with safe inset.
 */
export function ToastViewport({
  position = "bottom-right",
}: {
  position?: "bottom-right" | "bottom-center" | "top-right";
}) {
  const { toasts, dismiss } = useToast();

  const positionClass = {
    "bottom-right": "bottom-4 right-4 items-end",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
    "top-right": "top-4 right-4 items-end",
  }[position];

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[100] flex flex-col gap-2 max-w-[360px] w-[calc(100vw-2rem)]",
        positionClass
      )}
      aria-live="polite"
      aria-atomic
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const styles = toneStyles[t.tone ?? "neutral"];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
              className={cn(
                "pointer-events-auto w-full",
                "bg-surface text-foreground",
                "border rounded-[var(--radius-md)]",
                "shadow-[var(--shadow-lg)]",
                "flex items-start gap-3 p-3 pr-2",
                styles.wrap
              )}
              role="status"
            >
              <span className="mt-0.5 inline-flex shrink-0">{styles.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--text-sm)] font-medium text-foreground">
                  {t.title}
                </p>
                {t.description && (
                  <p className="mt-0.5 text-[var(--text-xs)] text-foreground-muted">
                    {t.description}
                  </p>
                )}
                {t.action && (
                  <button
                    type="button"
                    onClick={() => {
                      t.action?.onClick();
                      dismiss(t.id);
                    }}
                    className="mt-2 text-[var(--text-xs)] font-medium text-accent hover:underline"
                  >
                    {t.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
                className="inline-flex h-6 w-6 items-center justify-center rounded text-foreground-muted hover:bg-surface-2 hover:text-foreground"
              >
                <X size={14} strokeWidth={1.75} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
