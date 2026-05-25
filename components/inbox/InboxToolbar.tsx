"use client";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Hourglass,
  Loader2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ThreadStatus } from "@/lib/types";

/**
 * InboxToolbar — appears (animates in) above the row list when at least
 * one row is selected. Provides one-click bulk-status transitions for
 * the common moves a designer makes during triage.
 */
export interface InboxToolbarProps {
  count: number;
  total: number;
  onSetStatus: (status: ThreadStatus) => void;
  onClear: () => void;
}

const actions: Array<{
  status: ThreadStatus;
  label: string;
  icon: typeof CheckCircle2;
  variant?: "primary" | "secondary" | "danger";
}> = [
  { status: "triaged", label: "Triage", icon: Eye, variant: "secondary" },
  { status: "in_discussion", label: "Discuss", icon: Loader2, variant: "secondary" },
  { status: "new", label: "Re-open", icon: AlertCircle, variant: "secondary" },
  { status: "resolved", label: "Resolve", icon: CheckCircle2, variant: "primary" },
  { status: "wont_do", label: "Won't do", icon: XCircle, variant: "danger" },
];

export function InboxToolbar({
  count,
  total,
  onSetStatus,
  onClear,
}: InboxToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      className="sticky top-12 z-20 -mx-1 px-1"
    >
      <div className="rounded-md border border-border bg-surface shadow-[var(--shadow-sm)] flex flex-wrap items-center gap-2 p-1.5">
        <div className="inline-flex items-center gap-1.5 pl-1.5 pr-2 text-[var(--text-sm)] font-medium text-foreground">
          <Hourglass size={13} className="text-accent" />
          {count} of {total}
          <span className="text-foreground-subtle font-normal">selected</span>
        </div>
        <span className="h-5 w-px bg-border" aria-hidden />
        <div className="flex flex-wrap items-center gap-1">
          {actions.map((a) => (
            <Button
              key={a.status}
              size="sm"
              variant={a.variant ?? "secondary"}
              iconLeft={<a.icon size={13} strokeWidth={1.75} />}
              onClick={() => onSetStatus(a.status)}
            >
              {a.label}
            </Button>
          ))}
        </div>
        <div className="ml-auto">
          <Button
            size="sm"
            variant="ghost"
            iconLeft={<EyeOff size={13} />}
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
