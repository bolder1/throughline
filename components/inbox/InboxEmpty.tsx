"use client";

import { Inbox, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * InboxEmpty — two shapes:
 *   - "filtered":  filters return zero — offer Reset.
 *   - "everything-done":  truly no open threads — celebrate calmly.
 */
export function InboxEmpty({
  variant,
  onReset,
}: {
  variant: "filtered" | "everything-done";
  onReset?: () => void;
}) {
  if (variant === "filtered") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-8">
        <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-foreground-muted">
          <SearchX size={18} strokeWidth={1.75} />
        </span>
        <p className="font-display text-[var(--text-lg)] font-medium">
          No threads match these filters.
        </p>
        <p className="mt-1 max-w-[42ch] text-[var(--text-sm)] text-foreground-muted">
          Try widening the status filter, or reset everything to the open list.
        </p>
        {onReset && (
          <Button className="mt-4" variant="secondary" size="sm" onClick={onReset}>
            Reset filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-8">
      <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-success-soft text-[color:var(--success)]">
        <Inbox size={18} strokeWidth={1.75} />
      </span>
      <p className="font-display text-[var(--text-lg)] font-medium">
        Inbox zero.
      </p>
      <p className="mt-1 max-w-[42ch] text-[var(--text-sm)] text-foreground-muted">
        Every open thread is resolved or moved on. Your decision log carries
        the memory — head over and skim what changed.
      </p>
    </div>
  );
}
