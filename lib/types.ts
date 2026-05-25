/**
 * Throughline — core domain types.
 *
 * The lifecycle: a piece of feedback is captured from some source, lives
 * in a Thread (the unit of discussion), and is closed by a Decision. The
 * Decision is the durable artifact — what we'd write up in a decision
 * log six months from now.
 *
 *   Feedback (input)  →  Thread (work)  →  Decision (output)
 *
 * Projects and Screens give surface-level scope. People are who said
 * what and decided what.
 */

/* ─────────── Source taxonomy ─────────── */

export type FeedbackSource =
  | "figma"
  | "slack"
  | "email"
  | "usability"
  | "call"
  | "support";

export const FEEDBACK_SOURCE_LABEL: Record<FeedbackSource, string> = {
  figma: "Figma",
  slack: "Slack",
  email: "Email",
  usability: "Usability",
  call: "Call",
  support: "Support",
};

/* ─────────── Status & priority ─────────── */

/** Status flows: new → triaged → in_discussion → (resolved | wont_do). */
export type ThreadStatus =
  | "new"
  | "triaged"
  | "in_discussion"
  | "resolved"
  | "wont_do";

export const THREAD_STATUS_LABEL: Record<ThreadStatus, string> = {
  new: "New",
  triaged: "Triaged",
  in_discussion: "In discussion",
  resolved: "Resolved",
  wont_do: "Won't do",
};

/** Map to Tag tone for consistent visual treatment. */
export const THREAD_STATUS_TONE: Record<
  ThreadStatus,
  "neutral" | "accent" | "success" | "warning" | "danger"
> = {
  new: "neutral",
  triaged: "warning",
  in_discussion: "accent",
  resolved: "success",
  wont_do: "danger",
};

/** Resolved + wont_do are terminal — they generate a Decision. */
export const TERMINAL_STATUSES: ReadonlySet<ThreadStatus> = new Set([
  "resolved",
  "wont_do",
]);

export type Priority = "P0" | "P1" | "P2" | "P3";

export const PRIORITY_LABEL: Record<Priority, string> = {
  P0: "P0 · Critical",
  P1: "P1 · High",
  P2: "P2 · Medium",
  P3: "P3 · Low",
};

/* ─────────── People, Projects, Screens ─────────── */

export type PersonRole =
  | "designer"
  | "engineer"
  | "pm"
  | "researcher"
  | "stakeholder"
  | "user";

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  /** Two-letter initials for the avatar chip. */
  initials: string;
  /** Optional one-line context — e.g. "Lead designer, IAM team". */
  bio?: string;
}

export interface Project {
  id: string;
  /** URL-friendly identifier. */
  slug: string;
  name: string;
  summary: string;
  /** Tailwind/CSS color used for the dot/chip on this project. */
  accent: string;
  /** Stages of work: explore → design → build → ship. */
  stage: "explore" | "design" | "build" | "ship";
  ownerId: Person["id"];
}

export interface Screen {
  id: string;
  projectId: Project["id"];
  /** Friendly name — "Hero", "Onboarding step 3", "Empty state". */
  name: string;
  /** Lineage — "marketing/home", "app/settings/notifications". */
  path: string;
}

/* ─────────── Feedback, Threads, Decisions ─────────── */

/**
 * One raw piece of feedback. Multiple Feedbacks can belong to one Thread
 * (e.g. the same hero-CTA complaint showed up in Slack AND a usability
 * test — both captured, one Thread to discuss). The Thread is the unit
 * of triage and resolution, not the individual Feedback.
 */
export interface FeedbackItem {
  id: string;
  threadId: Thread["id"];
  source: FeedbackSource;
  /** Free-text capture from the source — sometimes raw, sometimes paraphrased. */
  body: string;
  raisedById: Person["id"];
  /** ISO date string — when it was captured, not when it was said. */
  capturedAt: string;
  /** Optional deep-link back to the source (Figma URL, Slack permalink, …). */
  sourceUrl?: string;
}

/**
 * Discussion notes attached to a Thread. Light-touch — this isn't a chat
 * app; it's enough to record the argument so the Decision rationale
 * isn't reconstructed from memory.
 */
export interface DiscussionNote {
  id: string;
  threadId: Thread["id"];
  authorId: Person["id"];
  body: string;
  at: string;
}

/**
 * Thread — the unit of work. One Thread per question/issue, regardless
 * of how many Feedbacks fed into it. A Thread carries the triage state
 * and links to the Decision once it's resolved.
 */
export interface Thread {
  id: string;
  /** Sentence-case headline; how it shows in the inbox row. */
  title: string;
  status: ThreadStatus;
  priority: Priority;
  projectId: Project["id"];
  screenId?: Screen["id"];
  /** Optional — set when the Thread is assigned a driver. */
  assigneeId?: Person["id"];
  /** Lifecycle timestamps. */
  createdAt: string;
  updatedAt: string;
  /** Set when status moves to a terminal state. */
  resolvedAt?: string;
  decisionId?: Decision["id"];
  /** Free-form tags layered on top of source/priority. */
  tags?: string[];
}

/**
 * Decision — the durable artifact. Written when a Thread terminates;
 * lives forever in the log even if the Thread is archived.
 */
export interface Decision {
  id: string;
  threadId: Thread["id"];
  /** Outcome: did we do the thing or not? */
  outcome: "resolved" | "wont_do";
  /** Short, sentence-case — the "what we decided". */
  title: string;
  /** The "why" — what we considered and rejected, who decided. */
  rationale: string;
  /** Person who pressed the resolve button. */
  decidedById: Person["id"];
  decidedAt: string;
  /** People consulted; surfaces in the log so a new hire knows who weighed in. */
  consultedIds?: Person["id"][];
}

/* ─────────── Helpful aggregate views ─────────── */

/** A Thread plus its associated Feedbacks, notes, and Decision (if any). */
export interface ThreadDetail {
  thread: Thread;
  feedback: FeedbackItem[];
  notes: DiscussionNote[];
  decision?: Decision;
}

/** The whole world — what gets persisted to localStorage. */
export interface WorldState {
  people: Person[];
  projects: Project[];
  screens: Screen[];
  threads: Thread[];
  feedback: FeedbackItem[];
  notes: DiscussionNote[];
  decisions: Decision[];
  /** Bumped when seed shape changes; lets us migrate localStorage forward. */
  schemaVersion: number;
}

export const CURRENT_SCHEMA_VERSION = 1;
