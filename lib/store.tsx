"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SEED } from "@/lib/seed";
import {
  CURRENT_SCHEMA_VERSION,
  type Decision,
  type DiscussionNote,
  type Person,
  type Thread,
  type ThreadStatus,
  type WorldState,
} from "@/lib/types";

/**
 * Storage layer for the prototype.
 *
 * - Source of truth lives in memory inside a React context.
 * - Every mutation writes the next state through to localStorage so the
 *   tab can be closed and reopened without losing work.
 * - On boot we hydrate from localStorage if present + same schemaVersion;
 *   otherwise we use SEED and write it through.
 * - The "current user" is the resolver for any Decision the demo creates;
 *   defaults to Priya (p-1) — that's the design-team owner in the seed.
 *
 * Why not Zustand / Jotai / Redux? At this scope (~30 threads, no server,
 * no time-travel) a context + reducer is enough, ships less JS, and
 * matches the rest of the codebase's "no framework on top of the
 * framework" posture. Easy to swap later.
 */

const STORAGE_KEY = "throughline.world.v1";
const CURRENT_USER_ID: Person["id"] = "p-1";

/* ─────────── Public API ─────────── */

export interface StoreApi {
  state: WorldState;
  currentUserId: Person["id"];
  /** Patch a Thread's status; auto-stamps updatedAt / resolvedAt. */
  setThreadStatus: (
    id: Thread["id"],
    status: ThreadStatus
  ) => void;
  /** Bulk version of setThreadStatus — one localStorage write. */
  setManyThreadStatus: (
    ids: Thread["id"][],
    status: ThreadStatus
  ) => void;
  /** Update arbitrary thread fields (priority, assignee, tags, …). */
  patchThread: (id: Thread["id"], patch: Partial<Thread>) => void;
  /** Resolve a Thread — moves it terminal AND writes a Decision. */
  resolveThread: (
    id: Thread["id"],
    decision: {
      outcome: "resolved" | "wont_do";
      title: string;
      rationale: string;
      consultedIds?: Person["id"][];
    }
  ) => Decision;
  /** Add a discussion note to a Thread. */
  addNote: (threadId: Thread["id"], body: string) => DiscussionNote;
  /** Replace everything with the seed — escape hatch for the demo. */
  reset: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used inside <StoreProvider>");
  }
  return ctx;
}

/* ─────────── Provider ─────────── */

function readFromStorage(): WorldState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WorldState;
    if (parsed?.schemaVersion !== CURRENT_SCHEMA_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeToStorage(state: WorldState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Quota or private-mode failure — fine, in-memory state still works. */
  }
}

let idCounter = 1000;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  // SSR: render with seed; hydrate from localStorage on mount.
  const [state, setState] = useState<WorldState>(SEED);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const persisted = readFromStorage();
    if (persisted) {
      setState(persisted);
    } else {
      writeToStorage(SEED);
    }
  }, []);

  /** Wrap any mutator so it auto-persists. */
  const commit = useCallback((next: WorldState) => {
    setState(next);
    writeToStorage(next);
  }, []);

  /* ─── Mutators ─── */

  const setThreadStatus = useCallback<StoreApi["setThreadStatus"]>(
    (id, status) => {
      setState((prev) => {
        const now = new Date().toISOString();
        const isTerminal = status === "resolved" || status === "wont_do";
        const next: WorldState = {
          ...prev,
          threads: prev.threads.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status,
                  updatedAt: now,
                  resolvedAt: isTerminal ? now : undefined,
                }
              : t
          ),
        };
        writeToStorage(next);
        return next;
      });
    },
    []
  );

  const setManyThreadStatus = useCallback<StoreApi["setManyThreadStatus"]>(
    (ids, status) => {
      setState((prev) => {
        const set = new Set(ids);
        const now = new Date().toISOString();
        const isTerminal = status === "resolved" || status === "wont_do";
        const next: WorldState = {
          ...prev,
          threads: prev.threads.map((t) =>
            set.has(t.id)
              ? {
                  ...t,
                  status,
                  updatedAt: now,
                  resolvedAt: isTerminal ? now : t.resolvedAt,
                }
              : t
          ),
        };
        writeToStorage(next);
        return next;
      });
    },
    []
  );

  const patchThread = useCallback<StoreApi["patchThread"]>((id, patch) => {
    setState((prev) => {
      const now = new Date().toISOString();
      const next: WorldState = {
        ...prev,
        threads: prev.threads.map((t) =>
          t.id === id ? { ...t, ...patch, updatedAt: now } : t
        ),
      };
      writeToStorage(next);
      return next;
    });
  }, []);

  const resolveThread = useCallback<StoreApi["resolveThread"]>(
    (id, input) => {
      const decision: Decision = {
        id: nextId("d"),
        threadId: id,
        outcome: input.outcome,
        title: input.title,
        rationale: input.rationale,
        decidedById: CURRENT_USER_ID,
        decidedAt: new Date().toISOString(),
        consultedIds: input.consultedIds,
      };
      setState((prev) => {
        const now = new Date().toISOString();
        const status: ThreadStatus = input.outcome;
        const next: WorldState = {
          ...prev,
          threads: prev.threads.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status,
                  updatedAt: now,
                  resolvedAt: now,
                  decisionId: decision.id,
                }
              : t
          ),
          decisions: [...prev.decisions, decision],
        };
        writeToStorage(next);
        return next;
      });
      return decision;
    },
    []
  );

  const addNote = useCallback<StoreApi["addNote"]>((threadId, body) => {
    const note: DiscussionNote = {
      id: nextId("n"),
      threadId,
      authorId: CURRENT_USER_ID,
      body,
      at: new Date().toISOString(),
    };
    setState((prev) => {
      const next: WorldState = {
        ...prev,
        notes: [...prev.notes, note],
        threads: prev.threads.map((t) =>
          t.id === threadId ? { ...t, updatedAt: note.at } : t
        ),
      };
      writeToStorage(next);
      return next;
    });
    return note;
  }, []);

  const reset = useCallback<StoreApi["reset"]>(() => {
    commit(SEED);
  }, [commit]);

  const value = useMemo<StoreApi>(
    () => ({
      state,
      currentUserId: CURRENT_USER_ID,
      setThreadStatus,
      setManyThreadStatus,
      patchThread,
      resolveThread,
      addNote,
      reset,
    }),
    [
      state,
      setThreadStatus,
      setManyThreadStatus,
      patchThread,
      resolveThread,
      addNote,
      reset,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
