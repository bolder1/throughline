import type {
  Decision,
  DiscussionNote,
  FeedbackItem,
  Person,
  Project,
  Screen,
  Thread,
  ThreadDetail,
  WorldState,
} from "@/lib/types";

/**
 * Read-side helpers — every UI screen runs through these so we can
 * change storage (mock seed today, localStorage later) without
 * touching screen code.
 */

export function getPerson(state: WorldState, id: Person["id"]) {
  return state.people.find((p) => p.id === id);
}

export function getProject(state: WorldState, id: Project["id"]) {
  return state.projects.find((p) => p.id === id);
}

export function getScreen(state: WorldState, id: Screen["id"]) {
  return state.screens.find((s) => s.id === id);
}

export function getThread(state: WorldState, id: Thread["id"]) {
  return state.threads.find((t) => t.id === id);
}

export function getDecision(state: WorldState, id: Decision["id"]) {
  return state.decisions.find((d) => d.id === id);
}

export function feedbackForThread(
  state: WorldState,
  threadId: Thread["id"]
): FeedbackItem[] {
  return state.feedback
    .filter((f) => f.threadId === threadId)
    .sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
}

export function notesForThread(
  state: WorldState,
  threadId: Thread["id"]
): DiscussionNote[] {
  return state.notes
    .filter((n) => n.threadId === threadId)
    .sort((a, b) => a.at.localeCompare(b.at));
}

/** Hydrate one Thread with its feedback, notes, and (if any) decision. */
export function threadDetail(
  state: WorldState,
  threadId: Thread["id"]
): ThreadDetail | undefined {
  const thread = getThread(state, threadId);
  if (!thread) return undefined;
  return {
    thread,
    feedback: feedbackForThread(state, threadId),
    notes: notesForThread(state, threadId),
    decision: thread.decisionId
      ? getDecision(state, thread.decisionId)
      : undefined,
  };
}

/** All threads on a given project. */
export function threadsForProject(
  state: WorldState,
  projectId: Project["id"]
) {
  return state.threads.filter((t) => t.projectId === projectId);
}

/** All decisions on a given project (via thread linkage). */
export function decisionsForProject(
  state: WorldState,
  projectId: Project["id"]
) {
  const threadIds = new Set(
    state.threads
      .filter((t) => t.projectId === projectId)
      .map((t) => t.id)
  );
  return state.decisions.filter((d) => threadIds.has(d.threadId));
}

/* ─────────── Dashboard / digest aggregates ─────────── */

/** Open = anything not in a terminal status. */
export function openThreads(state: WorldState) {
  return state.threads.filter(
    (t) => t.status !== "resolved" && t.status !== "wont_do"
  );
}

/** Threads older than `days` since last update. */
export function agingThreads(state: WorldState, days = 14) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return openThreads(state).filter(
    (t) => new Date(t.updatedAt).getTime() < cutoff
  );
}

/** Decisions written in the last `days`. */
export function recentDecisions(state: WorldState, days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return state.decisions.filter(
    (d) => new Date(d.decidedAt).getTime() >= cutoff
  );
}

/** Median resolution time (ms) across resolved threads. Used by the digest. */
export function medianResolutionMs(state: WorldState) {
  const times = state.threads
    .filter((t) => t.resolvedAt)
    .map((t) => new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime())
    .sort((a, b) => a - b);
  if (times.length === 0) return 0;
  const mid = Math.floor(times.length / 2);
  return times.length % 2 === 0
    ? (times[mid - 1] + times[mid]) / 2
    : times[mid];
}
