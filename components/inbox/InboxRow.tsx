"use client";

import { forwardRef, type KeyboardEvent, type MouseEvent } from "react";
import {
  Calendar,
  Headphones,
  LifeBuoy,
  Mail,
  MessageSquare,
  PenTool,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { isAging, timeAgoShort } from "@/lib/format";
import {
  THREAD_STATUS_LABEL,
  THREAD_STATUS_TONE,
  type FeedbackSource,
  type Project,
  type Screen,
  type Thread,
} from "@/lib/types";
import { StatusDot, Tag } from "@/components/ui/Tag";

const sourceIcon: Record<FeedbackSource, LucideIcon> = {
  figma: PenTool,
  slack: MessageSquare,
  email: Mail,
  usability: Headphones,
  call: Calendar,
  support: LifeBuoy,
};

const sourceLabel: Record<FeedbackSource, string> = {
  figma: "Figma",
  slack: "Slack",
  email: "Email",
  usability: "Usability",
  call: "Call",
  support: "Support",
};

export interface InboxRowProps {
  thread: Thread;
  project: Project | undefined;
  screen: Screen | undefined;
  /** Most recent feedback source on this thread, for the row chip. */
  primarySource?: FeedbackSource;
  /** Total feedback inputs aggregated into this thread. */
  feedbackCount: number;
  /** Selection state for bulk actions. */
  selected: boolean;
  onToggleSelected: (e: MouseEvent | KeyboardEvent) => void;
  /** Active focus / keyboard cursor. */
  focused: boolean;
  onFocus: () => void;
  onOpen: () => void;
  index: number;
}

export const InboxRow = forwardRef<HTMLDivElement, InboxRowProps>(
  function InboxRow(
    {
      thread,
      project,
      screen,
      primarySource,
      feedbackCount,
      selected,
      onToggleSelected,
      focused,
      onFocus,
      onOpen,
      index,
    },
    ref
  ) {
    const SourceIcon = primarySource ? sourceIcon[primarySource] : Sparkles;
    const sourceText = primarySource ? sourceLabel[primarySource] : "—";
    const aging = isAging(thread.updatedAt);
    const tone = THREAD_STATUS_TONE[thread.status];

    return (
      <div
        ref={ref}
        role="row"
        aria-selected={selected}
        data-thread-id={thread.id}
        data-focused={focused || undefined}
        tabIndex={focused ? 0 : -1}
        onFocus={onFocus}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onOpen();
          }
        }}
        className={cn(
          "group relative flex items-center gap-3 px-4 py-2.5 cursor-pointer",
          "border-b border-border transition-colors duration-[var(--duration-fast)]",
          "hover:bg-surface-2",
          focused && "bg-surface-2",
          selected && "bg-accent-soft/60 hover:bg-accent-soft/80"
        )}
      >
        {/* Focus-indicator stripe */}
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-0 h-full w-[3px] transition-colors",
            focused ? "bg-accent" : "bg-transparent"
          )}
        />

        {/* Selection checkbox — appears on hover or when row has selection */}
        <button
          type="button"
          aria-label={selected ? "Deselect row" : "Select row"}
          aria-pressed={selected}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelected(e);
          }}
          className={cn(
            "shrink-0 inline-flex h-4 w-4 items-center justify-center rounded-[3px] border",
            "transition-colors",
            selected
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border-strong bg-surface text-transparent group-hover:border-foreground-muted"
          )}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5.2 4.2 7.4 8.4 3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Status dot + project dot */}
        <span className="shrink-0 flex items-center gap-1.5">
          <StatusDot tone={tone} title={THREAD_STATUS_LABEL[thread.status]} />
          {project && (
            <span
              aria-hidden
              title={project.name}
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: project.accent }}
            />
          )}
        </span>

        {/* Priority — narrow chip on the left */}
        <span
          className={cn(
            "shrink-0 w-7 text-[10px] font-mono uppercase tracking-[0.05em] tabular-nums",
            thread.priority === "P0" && "text-[color:var(--danger)]",
            thread.priority === "P1" && "text-foreground",
            thread.priority === "P2" && "text-foreground-muted",
            thread.priority === "P3" && "text-foreground-subtle"
          )}
        >
          {thread.priority}
        </span>

        {/* Title — the headline. */}
        <span
          className={cn(
            "flex-1 min-w-0 truncate text-[var(--text-sm)]",
            thread.status === "resolved" || thread.status === "wont_do"
              ? "text-foreground-muted"
              : "text-foreground",
            (thread.status === "resolved" || thread.status === "wont_do") &&
              "line-through decoration-foreground-subtle/40 decoration-[1px]"
          )}
        >
          {thread.title}
        </span>

        {/* Project + screen — terse, muted */}
        {project && (
          <span className="hidden md:inline text-[var(--text-xs)] text-foreground-subtle truncate max-w-[180px]">
            {project.name}
            {screen && <span className="text-foreground-subtle"> · {screen.name}</span>}
          </span>
        )}

        {/* Source chip — primary input source for this thread */}
        <Tag
          tone="ghost"
          size="sm"
          icon={<SourceIcon size={10} strokeWidth={1.75} />}
          className="hidden sm:inline-flex"
        >
          {feedbackCount > 1 ? `${sourceText} +${feedbackCount - 1}` : sourceText}
        </Tag>

        {/* Updated-at — the age indicator. Aging rows get a warning hue. */}
        <span
          className={cn(
            "shrink-0 w-12 text-right text-[var(--text-xs)] tabular-nums",
            aging ? "text-[color:var(--warning)]" : "text-foreground-subtle"
          )}
          title={`Updated ${new Date(thread.updatedAt).toLocaleString()}`}
        >
          {timeAgoShort(thread.updatedAt)}
        </span>

        {/* Row number — keyboard reference (1-indexed; small, only at lg+) */}
        <span
          aria-hidden
          className="hidden lg:inline shrink-0 w-6 text-right text-[10px] font-mono text-foreground-subtle/60 tabular-nums"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    );
  }
);
