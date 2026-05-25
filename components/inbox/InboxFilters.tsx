"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { PressableTag } from "@/components/ui/Tag";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  FEEDBACK_SOURCE_LABEL,
  PRIORITY_LABEL,
  THREAD_STATUS_LABEL,
  type FeedbackSource,
  type Priority,
  type Project,
  type ThreadStatus,
} from "@/lib/types";
import { cn } from "@/lib/cn";

export type StatusFilter = ThreadStatus | "all" | "open";
export type GroupBy = "none" | "status" | "project" | "priority";

const STATUS_FILTER_ORDER: StatusFilter[] = [
  "open",
  "all",
  "new",
  "triaged",
  "in_discussion",
  "resolved",
  "wont_do",
];

const statusFilterLabel: Record<StatusFilter, string> = {
  open: "Open",
  all: "All",
  new: THREAD_STATUS_LABEL.new,
  triaged: THREAD_STATUS_LABEL.triaged,
  in_discussion: THREAD_STATUS_LABEL.in_discussion,
  resolved: THREAD_STATUS_LABEL.resolved,
  wont_do: THREAD_STATUS_LABEL.wont_do,
};

export interface InboxFiltersState {
  query: string;
  statusFilter: StatusFilter;
  sourceFilter: FeedbackSource | "all";
  projectFilter: Project["id"] | "all";
  priorityFilter: Priority | "all";
  groupBy: GroupBy;
}

export interface InboxFiltersProps {
  state: InboxFiltersState;
  setState: (next: InboxFiltersState) => void;
  projects: Project[];
  /** Count per status filter — shown in the chip label. */
  statusCounts: Record<StatusFilter, number>;
}

export function InboxFilters({
  state,
  setState,
  projects,
  statusCounts,
}: InboxFiltersProps) {
  const isDirty =
    state.query.length > 0 ||
    state.statusFilter !== "open" ||
    state.sourceFilter !== "all" ||
    state.projectFilter !== "all" ||
    state.priorityFilter !== "all" ||
    state.groupBy !== "none";

  return (
    <div className="flex flex-col gap-3">
      {/* Status chip row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUS_FILTER_ORDER.map((s) => (
          <PressableTag
            key={s}
            size="sm"
            pressed={state.statusFilter === s}
            onClick={() => setState({ ...state, statusFilter: s })}
          >
            <span>{statusFilterLabel[s]}</span>
            <span
              className={cn(
                "ml-1 inline-block min-w-[14px] text-center text-[10px] tabular-nums",
                state.statusFilter === s
                  ? "text-background/70"
                  : "text-foreground-subtle"
              )}
            >
              {statusCounts[s]}
            </span>
          </PressableTag>
        ))}
      </div>

      {/* Search + meta filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          size="sm"
          placeholder="Search threads…  (press / to focus)"
          iconLeft={<Search size={13} />}
          value={state.query}
          onChange={(e) => setState({ ...state, query: e.target.value })}
          className="max-w-xs"
          data-inbox-search
        />

        <Select
          size="sm"
          options={[
            { value: "all", label: "All sources" },
            ...(Object.keys(FEEDBACK_SOURCE_LABEL) as FeedbackSource[]).map(
              (k) => ({
                value: k,
                label: FEEDBACK_SOURCE_LABEL[k],
              })
            ),
          ]}
          value={state.sourceFilter}
          onChange={(e) =>
            setState({
              ...state,
              sourceFilter: e.target.value as FeedbackSource | "all",
            })
          }
          className="max-w-[160px]"
        />

        <Select
          size="sm"
          options={[
            { value: "all", label: "All projects" },
            ...projects.map((p) => ({ value: p.id, label: p.name })),
          ]}
          value={state.projectFilter}
          onChange={(e) =>
            setState({
              ...state,
              projectFilter: e.target.value as Project["id"] | "all",
            })
          }
          className="max-w-[200px]"
        />

        <Select
          size="sm"
          options={[
            { value: "all", label: "All priorities" },
            ...(Object.keys(PRIORITY_LABEL) as Priority[]).map((k) => ({
              value: k,
              label: PRIORITY_LABEL[k],
            })),
          ]}
          value={state.priorityFilter}
          onChange={(e) =>
            setState({
              ...state,
              priorityFilter: e.target.value as Priority | "all",
            })
          }
          className="max-w-[170px]"
        />

        <div className="mx-1 h-5 w-px bg-border" aria-hidden />

        <span className="inline-flex items-center gap-1.5 text-[var(--text-xs)] text-foreground-muted">
          <SlidersHorizontal size={12} />
          Group
        </span>
        <Select
          size="sm"
          options={[
            { value: "none", label: "Flat list" },
            { value: "status", label: "by Status" },
            { value: "project", label: "by Project" },
            { value: "priority", label: "by Priority" },
          ]}
          value={state.groupBy}
          onChange={(e) =>
            setState({ ...state, groupBy: e.target.value as GroupBy })
          }
          className="max-w-[140px]"
        />

        {isDirty && (
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<X size={12} />}
            onClick={() =>
              setState({
                query: "",
                statusFilter: "open",
                sourceFilter: "all",
                projectFilter: "all",
                priorityFilter: "all",
                groupBy: "none",
              })
            }
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
