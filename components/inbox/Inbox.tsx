"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { InboxFilters, type InboxFiltersState } from "@/components/inbox/InboxFilters";
import { InboxToolbar } from "@/components/inbox/InboxToolbar";
import { InboxRow } from "@/components/inbox/InboxRow";
import { InboxEmpty } from "@/components/inbox/InboxEmpty";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import {
  PRIORITY_LABEL,
  THREAD_STATUS_LABEL,
  type FeedbackSource,
  type Thread,
  type ThreadStatus,
} from "@/lib/types";

/**
 * Inbox — the product's center of gravity.
 *
 * Responsibilities owned here:
 *   - Read threads + projects + feedback from the store.
 *   - Apply filters (status, source, project, priority, search query)
 *     to derive the visible list.
 *   - Group the visible list (none / status / project / priority).
 *   - Track the "focused" row (keyboard cursor) and selected rows.
 *   - Wire keyboard shortcuts:
 *       ↓ / j → next row     ↑ / k → previous row
 *       x      → toggle row selection
 *       a      → select / deselect all visible
 *       /      → focus search
 *       Esc    → clear selection, blur search
 *       Enter  → open focused row (placeholder until Step 3)
 *   - Hand bulk-status changes to the store.
 *
 * Rendering / row composition is delegated to InboxRow; chrome to
 * InboxFilters and InboxToolbar; empty states to InboxEmpty.
 */
export function Inbox() {
  const { state, setManyThreadStatus } = useStore();
  const { push } = useToast();

  const [filters, setFilters] = useState<InboxFiltersState>({
    query: "",
    statusFilter: "open",
    sourceFilter: "all",
    projectFilter: "all",
    priorityFilter: "all",
    groupBy: "none",
  });
  const [selected, setSelected] = useState<Set<Thread["id"]>>(new Set());
  const [focusIndex, setFocusIndex] = useState(0);

  /* ─── Derived: counts per status filter, for the chip badges ─── */
  const statusCounts = useMemo(() => {
    const counts = {
      open: 0,
      all: state.threads.length,
      new: 0,
      triaged: 0,
      in_discussion: 0,
      resolved: 0,
      wont_do: 0,
    } as Record<InboxFiltersState["statusFilter"], number>;
    for (const t of state.threads) {
      counts[t.status] += 1;
      if (t.status !== "resolved" && t.status !== "wont_do") counts.open += 1;
    }
    return counts;
  }, [state.threads]);

  /* ─── Derived: the filtered thread list ─── */
  const filteredThreads = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return state.threads.filter((t) => {
      if (filters.statusFilter === "open") {
        if (t.status === "resolved" || t.status === "wont_do") return false;
      } else if (filters.statusFilter !== "all" && t.status !== filters.statusFilter) {
        return false;
      }
      if (filters.projectFilter !== "all" && t.projectId !== filters.projectFilter)
        return false;
      if (filters.priorityFilter !== "all" && t.priority !== filters.priorityFilter)
        return false;
      if (q.length > 0) {
        const match = t.title.toLowerCase().includes(q) ||
          (t.tags?.some((tg) => tg.toLowerCase().includes(q)) ?? false);
        if (!match) return false;
      }
      if (filters.sourceFilter !== "all") {
        const inputs = state.feedback.filter((f) => f.threadId === t.id);
        if (!inputs.some((f) => f.source === filters.sourceFilter)) return false;
      }
      return true;
    });
  }, [filters, state.threads, state.feedback]);

  /* ─── Derived: feedback + project + screen lookup tables ─── */
  const projectById = useMemo(() => {
    const m = new Map<string, (typeof state.projects)[number]>();
    state.projects.forEach((p) => m.set(p.id, p));
    return m;
  }, [state.projects]);
  const screenById = useMemo(() => {
    const m = new Map<string, (typeof state.screens)[number]>();
    state.screens.forEach((s) => m.set(s.id, s));
    return m;
  }, [state.screens]);

  const feedbackByThread = useMemo(() => {
    const m = new Map<string, { source: FeedbackSource; capturedAt: string }[]>();
    for (const f of state.feedback) {
      const arr = m.get(f.threadId) ?? [];
      arr.push({ source: f.source, capturedAt: f.capturedAt });
      m.set(f.threadId, arr);
    }
    return m;
  }, [state.feedback]);

  /* ─── Derived: grouped, then flattened for keyboard navigation ─── */
  const groupedSections = useMemo(() => {
    if (filters.groupBy === "none") {
      return [{ label: null as string | null, threads: filteredThreads }];
    }
    type Section = { label: string; sortKey: string; threads: Thread[] };
    const buckets = new Map<string, Section>();
    for (const t of filteredThreads) {
      let key = "";
      let label = "";
      let sortKey = "";
      if (filters.groupBy === "status") {
        key = t.status;
        label = THREAD_STATUS_LABEL[t.status];
        sortKey = STATUS_ORDER[t.status];
      } else if (filters.groupBy === "project") {
        key = t.projectId;
        const p = projectById.get(t.projectId);
        label = p?.name ?? "Unknown project";
        sortKey = label;
      } else {
        key = t.priority;
        label = PRIORITY_LABEL[t.priority];
        sortKey = t.priority;
      }
      const existing = buckets.get(key);
      if (existing) existing.threads.push(t);
      else buckets.set(key, { label, sortKey, threads: [t] });
    }
    return Array.from(buckets.values()).sort((a, b) =>
      a.sortKey.localeCompare(b.sortKey)
    );
  }, [filters.groupBy, filteredThreads, projectById]);

  /** Flat list in display order — what J/K traverses. */
  const flatThreads = useMemo(
    () => groupedSections.flatMap((s) => s.threads),
    [groupedSections]
  );

  /* Keep focusIndex in range when the list shrinks. */
  useEffect(() => {
    if (focusIndex >= flatThreads.length) {
      setFocusIndex(Math.max(0, flatThreads.length - 1));
    }
  }, [flatThreads.length, focusIndex]);

  /* ─── Selection helpers ─── */
  const toggleOne = useCallback((id: Thread["id"]) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAllVisible = useCallback(() => {
    setSelected((prev) => {
      const ids = flatThreads.map((t) => t.id);
      const allSelected = ids.every((id) => prev.has(id));
      if (allSelected) {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...prev, ...ids]);
    });
  }, [flatThreads]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  /* ─── Bulk-action handler ─── */
  const onBulkStatus = useCallback(
    (status: ThreadStatus) => {
      const ids = Array.from(selected);
      if (ids.length === 0) return;
      setManyThreadStatus(ids, status);
      push({
        tone:
          status === "resolved"
            ? "success"
            : status === "wont_do"
              ? "danger"
              : "neutral",
        title: `${ids.length} ${ids.length === 1 ? "thread" : "threads"} → ${THREAD_STATUS_LABEL[status]}`,
        description:
          status === "resolved"
            ? "Add rationale individually to complete the decision."
            : undefined,
      });
      clearSelection();
    },
    [selected, setManyThreadStatus, push, clearSelection]
  );

  /* ─── Keyboard shortcuts ─── */
  const rootRef = useRef<HTMLDivElement>(null);
  const onRootKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      // Don't hijack while typing in an input/textarea unless Escape.
      const target = e.target as HTMLElement | null;
      const isField =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;

      if (isField) {
        if (e.key === "Escape") {
          (target as HTMLInputElement).blur();
        }
        return;
      }

      switch (e.key) {
        case "j":
        case "ArrowDown":
          e.preventDefault();
          setFocusIndex((i) => Math.min(flatThreads.length - 1, i + 1));
          break;
        case "k":
        case "ArrowUp":
          e.preventDefault();
          setFocusIndex((i) => Math.max(0, i - 1));
          break;
        case "x":
        case " ":
          if (flatThreads[focusIndex]) {
            e.preventDefault();
            toggleOne(flatThreads[focusIndex].id);
          }
          break;
        case "a":
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            selectAllVisible();
          }
          break;
        case "/":
          e.preventDefault();
          (document.querySelector("[data-inbox-search]") as HTMLInputElement)?.focus();
          break;
        case "Escape":
          if (selected.size > 0) {
            e.preventDefault();
            clearSelection();
          }
          break;
      }
    },
    [flatThreads, focusIndex, selected.size, toggleOne, selectAllVisible, clearSelection]
  );

  /* Scroll the focused row into view when focusIndex changes. */
  useEffect(() => {
    const node = rootRef.current?.querySelector<HTMLDivElement>(
      `[data-thread-id="${flatThreads[focusIndex]?.id}"]`
    );
    node?.scrollIntoView({ block: "nearest" });
    node?.focus({ preventScroll: true });
  }, [focusIndex, flatThreads]);

  /* ─── Render ─── */
  const total = filteredThreads.length;
  const isEmpty = total === 0;
  const isFiltered =
    filters.query.length > 0 ||
    filters.statusFilter !== "open" ||
    filters.sourceFilter !== "all" ||
    filters.projectFilter !== "all" ||
    filters.priorityFilter !== "all";

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      onKeyDown={onRootKeyDown}
      className="mx-auto w-full max-w-[1280px] px-4 py-6 outline-none"
    >
      <header className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="font-display text-[var(--text-2xl)] font-semibold tracking-tight">
            Triage Inbox
          </h1>
          <p className="text-[var(--text-sm)] text-foreground-muted">
            {statusCounts.open} open · {statusCounts.all} total ·{" "}
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-surface-2 border border-border rounded-[3px] text-foreground-muted">
              j
            </kbd>
            <span className="mx-0.5 text-foreground-subtle">/</span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-surface-2 border border-border rounded-[3px] text-foreground-muted">
              k
            </kbd>{" "}
            to move ·{" "}
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-surface-2 border border-border rounded-[3px] text-foreground-muted">
              x
            </kbd>{" "}
            to select ·{" "}
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-surface-2 border border-border rounded-[3px] text-foreground-muted">
              /
            </kbd>{" "}
            to search
          </p>
        </div>
      </header>

      <InboxFilters
        state={filters}
        setState={setFilters}
        projects={state.projects}
        statusCounts={statusCounts}
      />

      <div className="mt-4 flex flex-col gap-2">
        {selected.size > 0 && (
          <InboxToolbar
            count={selected.size}
            total={total}
            onSetStatus={onBulkStatus}
            onClear={clearSelection}
          />
        )}

        {isEmpty ? (
          <div className="rounded-md border border-border bg-surface">
            <InboxEmpty
              variant={isFiltered ? "filtered" : "everything-done"}
              onReset={
                isFiltered
                  ? () =>
                      setFilters({
                        query: "",
                        statusFilter: "open",
                        sourceFilter: "all",
                        projectFilter: "all",
                        priorityFilter: "all",
                        groupBy: "none",
                      })
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="rounded-md border border-border bg-surface overflow-hidden">
            {groupedSections.map((section, sIdx) => {
              const offset = groupedSections
                .slice(0, sIdx)
                .reduce((sum, s) => sum + s.threads.length, 0);
              return (
                <div key={sIdx}>
                  {section.label && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-2 text-[var(--text-2xs)] font-mono uppercase tracking-[0.16em] text-foreground-subtle border-b border-border">
                      {section.label}
                      <span className="text-foreground-subtle/70">
                        · {section.threads.length}
                      </span>
                    </div>
                  )}
                  {section.threads.map((t, i) => {
                    const inputs = feedbackByThread.get(t.id) ?? [];
                    const sorted = [...inputs].sort((a, b) =>
                      b.capturedAt.localeCompare(a.capturedAt)
                    );
                    const flatIndex = offset + i;
                    return (
                      <InboxRow
                        key={t.id}
                        thread={t}
                        project={projectById.get(t.projectId)}
                        screen={t.screenId ? screenById.get(t.screenId) : undefined}
                        primarySource={sorted[0]?.source}
                        feedbackCount={inputs.length}
                        selected={selected.has(t.id)}
                        onToggleSelected={() => toggleOne(t.id)}
                        focused={flatIndex === focusIndex}
                        onFocus={() => setFocusIndex(flatIndex)}
                        onOpen={() => {
                          // Step 3 wires the detail Sheet. For now, a toast preview.
                          push({
                            tone: "neutral",
                            title: "Item detail — Step 3",
                            description: t.title,
                          });
                        }}
                        index={flatIndex}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* For group-by-status sort order — keeps the lifecycle in narrative sequence. */
const STATUS_ORDER: Record<ThreadStatus, string> = {
  new: "0",
  triaged: "1",
  in_discussion: "2",
  resolved: "3",
  wont_do: "4",
};
