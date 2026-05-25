"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/cn";

/** Small, square icon button that flips between light and dark. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md",
        "border border-border bg-surface text-foreground-muted",
        "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        "hover:bg-surface-2 hover:text-foreground",
        className
      )}
    >
      <Icon size={16} strokeWidth={1.75} />
    </button>
  );
}
