import type {
  Decision,
  DiscussionNote,
  FeedbackItem,
  Person,
  Project,
  Screen,
  Thread,
  WorldState,
} from "@/lib/types";
import { CURRENT_SCHEMA_VERSION } from "@/lib/types";

/**
 * Throughline seed — the fixture every demo of the app runs on.
 *
 * Composition target:
 *   4 projects · 4-6 screens each · 6 people · ~30 threads · ~40
 *   feedback items · ~20 discussion notes · 12 decisions.
 *
 * Realism principles:
 *   - The voice on every item sounds like real product critique. Never
 *     "user is sad about button" generic.
 *   - At least one example of every (source × status × priority)
 *     combination that matters, so the inbox renders representative
 *     data.
 *   - Decisions carry a real "what we considered and rejected" line —
 *     that's the product insight; the seed has to show it.
 */

/* ─────────── People ─────────── */

const people: Person[] = [
  {
    id: "p-1",
    name: "Priya Shah",
    role: "designer",
    initials: "PS",
    bio: "Lead designer, IAM team. Started Throughline because she was tired of losing decisions.",
  },
  {
    id: "p-2",
    name: "Marcus Olafsson",
    role: "engineer",
    initials: "MO",
    bio: "Staff engineer, frontend platform.",
  },
  {
    id: "p-3",
    name: "Rina Banerjee",
    role: "pm",
    initials: "RB",
    bio: "Group PM, growth & onboarding.",
  },
  {
    id: "p-4",
    name: "Jonas Weiss",
    role: "researcher",
    initials: "JW",
    bio: "Senior research partner. Runs usability and longitudinal studies.",
  },
  {
    id: "p-5",
    name: "Aisha Patel",
    role: "stakeholder",
    initials: "AP",
    bio: "VP Engineering — surfaces architectural concerns.",
  },
  {
    id: "p-6",
    name: "Dario Costa",
    role: "designer",
    initials: "DC",
    bio: "Designer on the analytics surface.",
  },
];

/* ─────────── Projects ─────────── */

const projects: Project[] = [
  {
    id: "pr-1",
    slug: "web",
    name: "Marketing Web",
    summary:
      "Public-facing site — home, pricing, docs landing, sign-up funnel.",
    accent: "#2563eb",
    stage: "ship",
    ownerId: "p-1",
  },
  {
    id: "pr-2",
    slug: "onboarding",
    name: "Onboarding Flow",
    summary:
      "First-run experience inside the app. Connects sources, sets up the first inbox.",
    accent: "#10b981",
    stage: "build",
    ownerId: "p-3",
  },
  {
    id: "pr-3",
    slug: "inbox",
    name: "Triage Inbox",
    summary:
      "The product's heart — the unified feedback list and resolve flow.",
    accent: "#f59e0b",
    stage: "design",
    ownerId: "p-1",
  },
  {
    id: "pr-4",
    slug: "ds",
    name: "Design System v2",
    summary:
      "Token migration, density rework, dark-theme rollout across surfaces.",
    accent: "#8b5cf6",
    stage: "design",
    ownerId: "p-6",
  },
];

/* ─────────── Screens ─────────── */

const screens: Screen[] = [
  // Marketing Web
  { id: "s-1", projectId: "pr-1", name: "Home — Hero", path: "marketing/home/hero" },
  { id: "s-2", projectId: "pr-1", name: "Home — Lifecycle section", path: "marketing/home/lifecycle" },
  { id: "s-3", projectId: "pr-1", name: "Pricing", path: "marketing/pricing" },
  { id: "s-4", projectId: "pr-1", name: "Sign-up funnel", path: "marketing/signup" },

  // Onboarding
  { id: "s-5", projectId: "pr-2", name: "Connect sources", path: "app/onboarding/sources" },
  { id: "s-6", projectId: "pr-2", name: "First triage", path: "app/onboarding/first-triage" },
  { id: "s-7", projectId: "pr-2", name: "Invite team", path: "app/onboarding/invite" },
  { id: "s-8", projectId: "pr-2", name: "Empty state — no feedback yet", path: "app/onboarding/empty" },

  // Triage Inbox
  { id: "s-9", projectId: "pr-3", name: "Inbox list", path: "app/inbox" },
  { id: "s-10", projectId: "pr-3", name: "Item detail (Sheet)", path: "app/inbox/detail" },
  { id: "s-11", projectId: "pr-3", name: "Resolve form", path: "app/inbox/resolve" },
  { id: "s-12", projectId: "pr-3", name: "Filters & saved views", path: "app/inbox/filters" },
  { id: "s-13", projectId: "pr-3", name: "Command palette", path: "app/inbox/cmdk" },

  // Design System
  { id: "s-14", projectId: "pr-4", name: "Tokens reference", path: "ds/tokens" },
  { id: "s-15", projectId: "pr-4", name: "Inbox row density", path: "ds/density" },
  { id: "s-16", projectId: "pr-4", name: "Dark theme audit", path: "ds/dark" },
];

/* ─────────── Threads ─────────── */

/* Shorthand for ISO dates. */
const T = (d: string) => new Date(d).toISOString();

const threads: Thread[] = [
  // --- Active / new / triaged threads on Marketing Web ---
  {
    id: "t-1",
    title: "Hero CTA copy reads generic — “Get started” doesn't signal the product",
    status: "in_discussion",
    priority: "P1",
    projectId: "pr-1",
    screenId: "s-1",
    assigneeId: "p-1",
    createdAt: T("2026-04-22T09:14:00Z"),
    updatedAt: T("2026-05-09T16:02:00Z"),
    tags: ["copy", "hero"],
  },
  {
    id: "t-2",
    title: "Lifecycle diagram on home page is too dense at mobile widths",
    status: "triaged",
    priority: "P2",
    projectId: "pr-1",
    screenId: "s-2",
    assigneeId: "p-1",
    createdAt: T("2026-04-28T11:00:00Z"),
    updatedAt: T("2026-05-02T08:11:00Z"),
    tags: ["responsive"],
  },
  {
    id: "t-3",
    title: "Pricing tier names — “Team” vs “Studio” keeps tripping up readers",
    status: "new",
    priority: "P2",
    projectId: "pr-1",
    screenId: "s-3",
    createdAt: T("2026-05-11T10:24:00Z"),
    updatedAt: T("2026-05-11T10:24:00Z"),
    tags: ["copy", "naming"],
  },
  {
    id: "t-4",
    title: "Sign-up funnel: SSO option is hidden below the email field on mobile",
    status: "triaged",
    priority: "P1",
    projectId: "pr-1",
    screenId: "s-4",
    assigneeId: "p-1",
    createdAt: T("2026-04-30T13:48:00Z"),
    updatedAt: T("2026-05-08T15:30:00Z"),
    tags: ["funnel", "mobile"],
  },

  // --- Onboarding ---
  {
    id: "t-5",
    title: "Connecting Figma takes three clicks more than connecting Slack",
    status: "in_discussion",
    priority: "P1",
    projectId: "pr-2",
    screenId: "s-5",
    assigneeId: "p-3",
    createdAt: T("2026-04-19T07:30:00Z"),
    updatedAt: T("2026-05-10T11:15:00Z"),
    tags: ["friction"],
  },
  {
    id: "t-6",
    title: "First-triage tutorial overlay blocks the very rows it's explaining",
    status: "triaged",
    priority: "P0",
    projectId: "pr-2",
    screenId: "s-6",
    assigneeId: "p-3",
    createdAt: T("2026-04-25T14:12:00Z"),
    updatedAt: T("2026-05-09T09:00:00Z"),
    tags: ["a11y", "tutorial"],
  },
  {
    id: "t-7",
    title: "Empty state for “no feedback yet” feels like a broken state",
    status: "new",
    priority: "P2",
    projectId: "pr-2",
    screenId: "s-8",
    createdAt: T("2026-05-12T09:00:00Z"),
    updatedAt: T("2026-05-12T09:00:00Z"),
    tags: ["empty-state"],
  },
  {
    id: "t-8",
    title: "Invite-team step should let me skip and come back",
    status: "in_discussion",
    priority: "P2",
    projectId: "pr-2",
    screenId: "s-7",
    assigneeId: "p-3",
    createdAt: T("2026-05-02T16:40:00Z"),
    updatedAt: T("2026-05-11T08:22:00Z"),
    tags: ["flow"],
  },

  // --- Triage Inbox ---
  {
    id: "t-9",
    title: "Keyboard triage: J/K should move row selection; today only ↓/↑ work",
    status: "triaged",
    priority: "P1",
    projectId: "pr-3",
    screenId: "s-9",
    assigneeId: "p-2",
    createdAt: T("2026-04-26T10:08:00Z"),
    updatedAt: T("2026-05-07T14:30:00Z"),
    tags: ["keyboard"],
  },
  {
    id: "t-10",
    title: "Bulk-status menu is gated behind a dropdown — too many clicks for triage",
    status: "in_discussion",
    priority: "P1",
    projectId: "pr-3",
    screenId: "s-9",
    assigneeId: "p-1",
    createdAt: T("2026-04-27T13:55:00Z"),
    updatedAt: T("2026-05-12T10:20:00Z"),
    tags: ["bulk-actions"],
  },
  {
    id: "t-11",
    title: "Resolve form is too long — designers won't fill 5 fields per item",
    status: "in_discussion",
    priority: "P0",
    projectId: "pr-3",
    screenId: "s-11",
    assigneeId: "p-1",
    createdAt: T("2026-04-18T08:00:00Z"),
    updatedAt: T("2026-05-13T11:00:00Z"),
    tags: ["friction", "resolve"],
  },
  {
    id: "t-12",
    title: "Filter chips wrap weirdly on the 1280-wide range",
    status: "new",
    priority: "P3",
    projectId: "pr-3",
    screenId: "s-12",
    createdAt: T("2026-05-13T12:45:00Z"),
    updatedAt: T("2026-05-13T12:45:00Z"),
    tags: ["layout"],
  },
  {
    id: "t-13",
    title: "Command palette: ⌘K should also work for navigation, not just actions",
    status: "triaged",
    priority: "P2",
    projectId: "pr-3",
    screenId: "s-13",
    assigneeId: "p-2",
    createdAt: T("2026-05-04T15:00:00Z"),
    updatedAt: T("2026-05-10T13:45:00Z"),
    tags: ["cmdk", "keyboard"],
  },

  // --- Design System v2 ---
  {
    id: "t-14",
    title: "Dark-theme: focus rings disappear on the surface-2 background",
    status: "in_discussion",
    priority: "P1",
    projectId: "pr-4",
    screenId: "s-16",
    assigneeId: "p-6",
    createdAt: T("2026-05-01T11:20:00Z"),
    updatedAt: T("2026-05-09T14:10:00Z"),
    tags: ["a11y", "dark-theme"],
  },
  {
    id: "t-15",
    title: "Inbox row at default density wastes 14px vertically — should we tighten?",
    status: "new",
    priority: "P2",
    projectId: "pr-4",
    screenId: "s-15",
    createdAt: T("2026-05-12T16:30:00Z"),
    updatedAt: T("2026-05-12T16:30:00Z"),
    tags: ["density"],
  },

  // --- Already resolved (these feed the Decision Log) ---
  {
    id: "t-16",
    title: "Source filter chips should be uppercase like other meta",
    status: "resolved",
    priority: "P3",
    projectId: "pr-3",
    screenId: "s-12",
    assigneeId: "p-1",
    createdAt: T("2026-04-10T09:00:00Z"),
    updatedAt: T("2026-04-12T11:20:00Z"),
    resolvedAt: T("2026-04-12T11:20:00Z"),
    decisionId: "d-1",
    tags: ["typography"],
  },
  {
    id: "t-17",
    title: "Resolve form should auto-save drafts so a refresh doesn't lose work",
    status: "resolved",
    priority: "P1",
    projectId: "pr-3",
    screenId: "s-11",
    assigneeId: "p-2",
    createdAt: T("2026-04-09T08:45:00Z"),
    updatedAt: T("2026-04-15T14:00:00Z"),
    resolvedAt: T("2026-04-15T14:00:00Z"),
    decisionId: "d-2",
    tags: ["resolve", "persistence"],
  },
  {
    id: "t-18",
    title: "Aging threads (> 14 days) need a visual indicator in the inbox",
    status: "resolved",
    priority: "P2",
    projectId: "pr-3",
    screenId: "s-9",
    assigneeId: "p-1",
    createdAt: T("2026-04-05T12:00:00Z"),
    updatedAt: T("2026-04-18T10:00:00Z"),
    resolvedAt: T("2026-04-18T10:00:00Z"),
    decisionId: "d-3",
    tags: ["aging", "indicator"],
  },
  {
    id: "t-19",
    title: "Should we let people delete decisions from the log?",
    status: "wont_do",
    priority: "P1",
    projectId: "pr-3",
    assigneeId: "p-1",
    createdAt: T("2026-04-02T10:15:00Z"),
    updatedAt: T("2026-04-08T16:30:00Z"),
    resolvedAt: T("2026-04-08T16:30:00Z"),
    decisionId: "d-4",
    tags: ["log", "policy"],
  },
  {
    id: "t-20",
    title: "Hero illustration should be the cube — same vocabulary as the brand",
    status: "wont_do",
    priority: "P2",
    projectId: "pr-1",
    screenId: "s-1",
    assigneeId: "p-1",
    createdAt: T("2026-04-11T13:00:00Z"),
    updatedAt: T("2026-04-19T09:45:00Z"),
    resolvedAt: T("2026-04-19T09:45:00Z"),
    decisionId: "d-5",
    tags: ["brand", "hero"],
  },
  {
    id: "t-21",
    title: "Onboarding: connect-sources should default-select Figma + Slack",
    status: "resolved",
    priority: "P2",
    projectId: "pr-2",
    screenId: "s-5",
    assigneeId: "p-3",
    createdAt: T("2026-04-08T08:00:00Z"),
    updatedAt: T("2026-04-14T12:30:00Z"),
    resolvedAt: T("2026-04-14T12:30:00Z"),
    decisionId: "d-6",
    tags: ["defaults", "onboarding"],
  },
  {
    id: "t-22",
    title: "Inbox row: show project as a colored dot, not a chip",
    status: "resolved",
    priority: "P3",
    projectId: "pr-3",
    screenId: "s-9",
    assigneeId: "p-1",
    createdAt: T("2026-04-12T15:20:00Z"),
    updatedAt: T("2026-04-16T11:00:00Z"),
    resolvedAt: T("2026-04-16T11:00:00Z"),
    decisionId: "d-7",
    tags: ["density", "visual"],
  },
  {
    id: "t-23",
    title: "Tutorial overlay should be dismissible with Esc",
    status: "resolved",
    priority: "P1",
    projectId: "pr-2",
    screenId: "s-6",
    assigneeId: "p-3",
    createdAt: T("2026-03-30T11:00:00Z"),
    updatedAt: T("2026-04-03T09:00:00Z"),
    resolvedAt: T("2026-04-03T09:00:00Z"),
    decisionId: "d-8",
    tags: ["tutorial", "keyboard"],
  },
  {
    id: "t-24",
    title: "Pricing table — should we show annual or monthly prices first?",
    status: "resolved",
    priority: "P2",
    projectId: "pr-1",
    screenId: "s-3",
    assigneeId: "p-3",
    createdAt: T("2026-03-25T10:00:00Z"),
    updatedAt: T("2026-04-01T13:20:00Z"),
    resolvedAt: T("2026-04-01T13:20:00Z"),
    decisionId: "d-9",
    tags: ["pricing", "default"],
  },
  {
    id: "t-25",
    title: "Decision detail page — link back to the originating Thread",
    status: "resolved",
    priority: "P2",
    projectId: "pr-3",
    assigneeId: "p-2",
    createdAt: T("2026-04-01T09:30:00Z"),
    updatedAt: T("2026-04-06T14:00:00Z"),
    resolvedAt: T("2026-04-06T14:00:00Z"),
    decisionId: "d-10",
    tags: ["navigation"],
  },
  {
    id: "t-26",
    title: "Add a second accent color for the success state?",
    status: "wont_do",
    priority: "P3",
    projectId: "pr-4",
    assigneeId: "p-6",
    createdAt: T("2026-04-14T11:00:00Z"),
    updatedAt: T("2026-04-22T15:00:00Z"),
    resolvedAt: T("2026-04-22T15:00:00Z"),
    decisionId: "d-11",
    tags: ["color", "tokens"],
  },
  {
    id: "t-27",
    title: "Use sentence case across the whole UI, even in nav",
    status: "resolved",
    priority: "P2",
    projectId: "pr-4",
    assigneeId: "p-1",
    createdAt: T("2026-03-20T09:00:00Z"),
    updatedAt: T("2026-03-28T16:00:00Z"),
    resolvedAt: T("2026-03-28T16:00:00Z"),
    decisionId: "d-12",
    tags: ["copy", "case"],
  },

  // A few more "new" ones to balance the inbox volume
  {
    id: "t-28",
    title: "Slack source: long messages get truncated at 240 chars — show more?",
    status: "new",
    priority: "P3",
    projectId: "pr-3",
    screenId: "s-9",
    createdAt: T("2026-05-13T08:10:00Z"),
    updatedAt: T("2026-05-13T08:10:00Z"),
    tags: ["truncation"],
  },
  {
    id: "t-29",
    title: "Decision Log: filter by author returns wrong results for resolved-by",
    status: "triaged",
    priority: "P0",
    projectId: "pr-3",
    assigneeId: "p-2",
    createdAt: T("2026-05-09T14:00:00Z"),
    updatedAt: T("2026-05-12T10:30:00Z"),
    tags: ["bug", "filter"],
  },
  {
    id: "t-30",
    title: "Mobile: command palette doesn't render — feature-detect or hide it?",
    status: "new",
    priority: "P2",
    projectId: "pr-3",
    screenId: "s-13",
    createdAt: T("2026-05-13T16:55:00Z"),
    updatedAt: T("2026-05-13T16:55:00Z"),
    tags: ["mobile", "cmdk"],
  },
];

/* ─────────── Feedback items (raw input) ─────────── */

const feedback: FeedbackItem[] = [
  // t-1 — hero CTA: Slack + Figma + email
  {
    id: "f-1",
    threadId: "t-1",
    source: "slack",
    body:
      "“Get started” is what every SaaS hero says. We've built a real point of view — the hero should reflect that.",
    raisedById: "p-3",
    capturedAt: T("2026-04-22T09:14:00Z"),
    sourceUrl: "https://slack.com/archives/Cxx/p1681000000000000",
  },
  {
    id: "f-2",
    threadId: "t-1",
    source: "figma",
    body:
      "Note on the hero frame: copy here is the weakest part. Voice should be sharper.",
    raisedById: "p-1",
    capturedAt: T("2026-04-23T11:20:00Z"),
    sourceUrl: "https://figma.com/file/xxxx?node-id=12-34",
  },
  {
    id: "f-3",
    threadId: "t-1",
    source: "email",
    body:
      "From AP: we keep using generic phrasing because nobody's owned the voice. Can someone resolve this?",
    raisedById: "p-5",
    capturedAt: T("2026-04-24T08:00:00Z"),
  },

  // t-2 — lifecycle dense on mobile
  {
    id: "f-4",
    threadId: "t-2",
    source: "usability",
    body:
      "Three of five participants scrolled past the lifecycle section on mobile without reading. Two said it looked like a chart, not a story.",
    raisedById: "p-4",
    capturedAt: T("2026-04-28T11:00:00Z"),
  },

  // t-3 — pricing tier naming
  {
    id: "f-5",
    threadId: "t-3",
    source: "support",
    body:
      "Three different incoming tickets this week asking 'is Team the higher one or Studio'.",
    raisedById: "p-3",
    capturedAt: T("2026-05-11T10:24:00Z"),
  },

  // t-4 — sign-up SSO hidden
  {
    id: "f-6",
    threadId: "t-4",
    source: "call",
    body:
      "Demo with Acme — they asked for SSO and we said it was there, but they couldn't find it on the mobile sign-up. Email field is on top.",
    raisedById: "p-3",
    capturedAt: T("2026-04-30T13:48:00Z"),
  },

  // t-5 — Figma connect friction
  {
    id: "f-7",
    threadId: "t-5",
    source: "slack",
    body:
      "Did the time-to-connect comparison: Slack 18s, Figma 47s. Three extra clicks. We're losing people here.",
    raisedById: "p-2",
    capturedAt: T("2026-04-19T07:30:00Z"),
    sourceUrl: "https://slack.com/archives/Cxx/p1681010000000",
  },

  // t-6 — tutorial overlay blocks rows
  {
    id: "f-8",
    threadId: "t-6",
    source: "usability",
    body:
      "Participant tried to click the row the tooltip was describing. Tooltip was on top of it. They gave up.",
    raisedById: "p-4",
    capturedAt: T("2026-04-25T14:12:00Z"),
  },

  // t-7 — empty state looks broken
  {
    id: "f-9",
    threadId: "t-7",
    source: "support",
    body:
      "User logged a ticket asking 'is the app down?' — turned out they just had no feedback yet. The empty state failed them.",
    raisedById: "p-3",
    capturedAt: T("2026-05-12T09:00:00Z"),
  },

  // t-8 — invite skip
  {
    id: "f-10",
    threadId: "t-8",
    source: "figma",
    body:
      "Sticky note on the invite step: solo designers shouldn't have to fake invites just to proceed. Add a skip.",
    raisedById: "p-1",
    capturedAt: T("2026-05-02T16:40:00Z"),
    sourceUrl: "https://figma.com/file/xxxx?node-id=88-2",
  },

  // t-9 — J/K keyboard
  {
    id: "f-11",
    threadId: "t-9",
    source: "slack",
    body:
      "Power users keep asking for J/K. It's the inbox convention — Linear, Gmail, Superhuman. Should be free to add.",
    raisedById: "p-2",
    capturedAt: T("2026-04-26T10:08:00Z"),
  },

  // t-10 — bulk-status dropdown clicks
  {
    id: "f-12",
    threadId: "t-10",
    source: "usability",
    body:
      "Watched two designers triage 12 items each. Both clicked the dropdown for every single bulk action. That's 24 extra clicks for nothing.",
    raisedById: "p-4",
    capturedAt: T("2026-04-27T13:55:00Z"),
  },

  // t-11 — resolve form too long
  {
    id: "f-13",
    threadId: "t-11",
    source: "call",
    body:
      "From the design-team interview: 'I'd rather not document at all than fill five fields per item. Make it two.'",
    raisedById: "p-1",
    capturedAt: T("2026-04-18T08:00:00Z"),
  },
  {
    id: "f-14",
    threadId: "t-11",
    source: "slack",
    body:
      "Adding to the resolve-friction thread: I literally close the form half the time and come back. That's a bad sign.",
    raisedById: "p-6",
    capturedAt: T("2026-04-19T15:30:00Z"),
  },

  // t-12 — filter chip wrap
  {
    id: "f-15",
    threadId: "t-12",
    source: "figma",
    body:
      "Annotation on the inbox filter row: at 1280-wide the chips break into an ugly two-row stack with the last chip alone.",
    raisedById: "p-1",
    capturedAt: T("2026-05-13T12:45:00Z"),
  },

  // t-13 — cmdk navigation
  {
    id: "f-16",
    threadId: "t-13",
    source: "slack",
    body:
      "If ⌘K had nav too I'd never use the sidebar. Reduce the chrome.",
    raisedById: "p-1",
    capturedAt: T("2026-05-04T15:00:00Z"),
  },

  // t-14 — dark focus rings
  {
    id: "f-17",
    threadId: "t-14",
    source: "figma",
    body:
      "Audit comment on dark mode: focus ring is the same color as surface-2 hover. Indistinguishable on resolved rows.",
    raisedById: "p-6",
    capturedAt: T("2026-05-01T11:20:00Z"),
  },

  // t-15 — density
  {
    id: "f-18",
    threadId: "t-15",
    source: "slack",
    body:
      "Eyeballing the inbox at 1440 — we could fit 3 more rows above the fold if we tightened density. Is that worth doing?",
    raisedById: "p-6",
    capturedAt: T("2026-05-12T16:30:00Z"),
  },

  // Resolved-thread feedbacks (so the log has provenance to click through to)
  {
    id: "f-19",
    threadId: "t-16",
    source: "figma",
    body: "Source chips should match the meta-eyebrow case — uppercase, mono.",
    raisedById: "p-1",
    capturedAt: T("2026-04-10T09:00:00Z"),
  },
  {
    id: "f-20",
    threadId: "t-17",
    source: "slack",
    body:
      "Lost a paragraph of rationale to a refresh today. Genuinely demoralizing. Drafts please.",
    raisedById: "p-1",
    capturedAt: T("2026-04-09T08:45:00Z"),
  },
  {
    id: "f-21",
    threadId: "t-18",
    source: "usability",
    body:
      "Participants who'd been using the inbox for a week couldn't tell which threads were stale. Needs a visual.",
    raisedById: "p-4",
    capturedAt: T("2026-04-05T12:00:00Z"),
  },
  {
    id: "f-22",
    threadId: "t-19",
    source: "email",
    body: "Suggestion from AP — let admins delete decisions. Sometimes we get them wrong.",
    raisedById: "p-5",
    capturedAt: T("2026-04-02T10:15:00Z"),
  },
  {
    id: "f-23",
    threadId: "t-20",
    source: "slack",
    body: "What if the hero illustration was the cube? Anchors the brand.",
    raisedById: "p-6",
    capturedAt: T("2026-04-11T13:00:00Z"),
  },
  {
    id: "f-24",
    threadId: "t-21",
    source: "support",
    body: "New users keep missing the connect step. Pre-checking the two most common sources would help.",
    raisedById: "p-3",
    capturedAt: T("2026-04-08T08:00:00Z"),
  },
  {
    id: "f-25",
    threadId: "t-22",
    source: "figma",
    body: "Project chip is doing too much visually. A dot would do the job.",
    raisedById: "p-1",
    capturedAt: T("2026-04-12T15:20:00Z"),
  },
  {
    id: "f-26",
    threadId: "t-23",
    source: "usability",
    body:
      "Two of three participants tried Esc to close the tutorial. Only one realized you had to click X.",
    raisedById: "p-4",
    capturedAt: T("2026-03-30T11:00:00Z"),
  },
  {
    id: "f-27",
    threadId: "t-24",
    source: "call",
    body:
      "Sales says prospects expect annual pricing — it makes us look cheaper. Engineering says we should be honest about the toggle.",
    raisedById: "p-3",
    capturedAt: T("2026-03-25T10:00:00Z"),
  },
  {
    id: "f-28",
    threadId: "t-25",
    source: "slack",
    body:
      "When I'm on a decision and want to see the original feedback I have to search. Just link it.",
    raisedById: "p-1",
    capturedAt: T("2026-04-01T09:30:00Z"),
  },
  {
    id: "f-29",
    threadId: "t-26",
    source: "figma",
    body: "Could we have a second accent for success states? Green felt right in the mocks.",
    raisedById: "p-6",
    capturedAt: T("2026-04-14T11:00:00Z"),
  },
  {
    id: "f-30",
    threadId: "t-27",
    source: "slack",
    body: "We have Title Case in nav but sentence everywhere else. Pick one — sentence reads warmer.",
    raisedById: "p-1",
    capturedAt: T("2026-03-20T09:00:00Z"),
  },

  // The fresh "new" items
  {
    id: "f-31",
    threadId: "t-28",
    source: "slack",
    body:
      "I have a long Slack thread in the inbox and only the first line shows. Sometimes the gist is in line 4.",
    raisedById: "p-3",
    capturedAt: T("2026-05-13T08:10:00Z"),
  },
  {
    id: "f-32",
    threadId: "t-29",
    source: "figma",
    body:
      "Quick bug — filter Decision Log by author shows decisions where the author was *consulted*, not decider.",
    raisedById: "p-2",
    capturedAt: T("2026-05-09T14:00:00Z"),
  },
  {
    id: "f-33",
    threadId: "t-30",
    source: "support",
    body: "Customer on iPhone says ⌘K does nothing. (Expected — but at minimum we should hide the hint.)",
    raisedById: "p-3",
    capturedAt: T("2026-05-13T16:55:00Z"),
  },
];

/* ─────────── Discussion notes ─────────── */

const notes: DiscussionNote[] = [
  // t-1 hero CTA
  {
    id: "n-1",
    threadId: "t-1",
    authorId: "p-1",
    body: "Try 'Make complex feel calm' — it's already our principle.",
    at: T("2026-04-23T16:42:00Z"),
  },
  {
    id: "n-2",
    threadId: "t-1",
    authorId: "p-3",
    body: "Like it. Want to A/B it against 'See your feedback as one stream.' next sprint.",
    at: T("2026-04-29T10:15:00Z"),
  },

  // t-5 figma connect friction
  {
    id: "n-3",
    threadId: "t-5",
    authorId: "p-3",
    body:
      "The extra clicks come from the OAuth grant step + workspace picker. We could pre-select the most-recent workspace.",
    at: T("2026-04-20T11:00:00Z"),
  },
  {
    id: "n-4",
    threadId: "t-5",
    authorId: "p-2",
    body: "Can do the recent-workspace default this week. Won't fix the OAuth grant step; that's Figma's.",
    at: T("2026-05-08T14:30:00Z"),
  },

  // t-10 bulk-status
  {
    id: "n-5",
    threadId: "t-10",
    authorId: "p-1",
    body: "Pulling the menu out into the toolbar — visible by default when 2+ rows selected.",
    at: T("2026-05-09T11:00:00Z"),
  },

  // t-11 resolve form length
  {
    id: "n-6",
    threadId: "t-11",
    authorId: "p-1",
    body:
      "Two required fields: title + rationale. Everything else folds into 'more detail'. We measure: avg fields filled, avg time to resolve.",
    at: T("2026-04-20T09:30:00Z"),
  },
  {
    id: "n-7",
    threadId: "t-11",
    authorId: "p-3",
    body:
      "Agree. The product insight is that capture is the price of admission; documentation should be the byproduct, not the work.",
    at: T("2026-04-21T13:15:00Z"),
  },

  // t-14 focus rings dark
  {
    id: "n-8",
    threadId: "t-14",
    authorId: "p-6",
    body:
      "Bumping the focus ring to a brighter accent variant in dark only. Adding a contrast check to the lint.",
    at: T("2026-05-05T10:00:00Z"),
  },

  // t-29 bug
  {
    id: "n-9",
    threadId: "t-29",
    authorId: "p-2",
    body: "Filter joins on decisions.consultedIds when it should be decisions.decidedById. One-line fix.",
    at: T("2026-05-12T10:30:00Z"),
  },
];

/* ─────────── Decisions (Decision Log content) ─────────── */

const decisions: Decision[] = [
  {
    id: "d-1",
    threadId: "t-16",
    outcome: "resolved",
    title: "Uppercase source chips, mono font, 11px.",
    rationale:
      "Source chips were Title Case sans, the rest of the meta layer is uppercase mono. Mixed cases were reading as separate vocabularies. Considered: keeping sentence case for friendliness — rejected because we already use the eyebrow vocabulary for source. One style, one job.",
    decidedById: "p-1",
    decidedAt: T("2026-04-12T11:20:00Z"),
    consultedIds: ["p-6"],
  },
  {
    id: "d-2",
    threadId: "t-17",
    outcome: "resolved",
    title: "Auto-save Resolve drafts to localStorage every 1500ms.",
    rationale:
      "Lost rationale is the single most-cited reason designers said they'd stop using the tool. Considered: server-side draft persistence — rejected because we'd need an account model the prototype doesn't have, and localStorage handles the actual loss case (refresh / tab close). Trade-off: lose drafts across devices. Acceptable; revisit when accounts ship.",
    decidedById: "p-2",
    decidedAt: T("2026-04-15T14:00:00Z"),
    consultedIds: ["p-1"],
  },
  {
    id: "d-3",
    threadId: "t-18",
    outcome: "resolved",
    title: "Show a 14-day aging dot on inbox rows; flip to warning tone at 30.",
    rationale:
      "Tested two designs: a dot at >14 days, a row-tint at >14 days. The dot won every usability session — readable at a glance, doesn't compete with the row's other meta. Threshold of 14 came from the median in-progress duration on the seeded dataset; older-than-median is by definition aging.",
    decidedById: "p-1",
    decidedAt: T("2026-04-18T10:00:00Z"),
    consultedIds: ["p-4"],
  },
  {
    id: "d-4",
    threadId: "t-19",
    outcome: "wont_do",
    title: "Decisions in the log are immutable. Hide-but-don't-delete.",
    rationale:
      "The whole product premise is that the log is institutional memory. Letting people delete decisions makes the memory unreliable, and the failure mode (wrong decision) is fixable with a follow-up decision that supersedes the first. We added a 'supersede' affordance instead — every superseded decision still appears, linked to the one that replaced it.",
    decidedById: "p-1",
    decidedAt: T("2026-04-08T16:30:00Z"),
    consultedIds: ["p-5", "p-3"],
  },
  {
    id: "d-5",
    threadId: "t-20",
    outcome: "wont_do",
    title: "Hero illustration stays abstract; not the cube.",
    rationale:
      "Cube is the visual vocabulary of the case study we ported from, not Throughline's vocabulary. Throughline's anchor is the lifecycle loop — that's what the hero should illustrate. Keeping the cube would be borrowed equity; the brand has to earn its own.",
    decidedById: "p-1",
    decidedAt: T("2026-04-19T09:45:00Z"),
  },
  {
    id: "d-6",
    threadId: "t-21",
    outcome: "resolved",
    title: "Default-select Figma + Slack on the connect-sources step.",
    rationale:
      "73% of beta users connect both in week one. Pre-selecting them removes two clicks from the modal path most users take. Considered: pre-selecting based on detected installs (Figma plugin / Slack workspace) — rejected as too much detection for too little gain at this stage; revisit when we have a real distribution.",
    decidedById: "p-3",
    decidedAt: T("2026-04-14T12:30:00Z"),
    consultedIds: ["p-2"],
  },
  {
    id: "d-7",
    threadId: "t-22",
    outcome: "resolved",
    title: "Project shown as a 6px colored dot in the inbox row.",
    rationale:
      "A chip-per-row was adding 80-110px of horizontal weight without earning attention. The project is meta, not content — a dot communicates it at a glance and keeps the row's typography readable. Hover reveals the project name for the moment someone needs it.",
    decidedById: "p-1",
    decidedAt: T("2026-04-16T11:00:00Z"),
  },
  {
    id: "d-8",
    threadId: "t-23",
    outcome: "resolved",
    title: "Tutorial overlay is dismissible with Esc and outside-click.",
    rationale:
      "Two of three participants tried Esc; one tried clicking the dimmed area outside. We were already trapping focus, so wiring both dismissals was cheap. Considered: only-Esc — rejected because outside-click is the convention for non-modal overlays.",
    decidedById: "p-3",
    decidedAt: T("2026-04-03T09:00:00Z"),
    consultedIds: ["p-4"],
  },
  {
    id: "d-9",
    threadId: "t-24",
    outcome: "resolved",
    title: "Show annual pricing by default, with a clear monthly toggle.",
    rationale:
      "Annual is the price most prospects compare against. We're not hiding monthly — the toggle is in the header of the table at body-text weight, not buried — but the default is the price 80% of buyers actually pay. Sales pushed for annual-only; we rejected that because the toggle is a trust signal.",
    decidedById: "p-3",
    decidedAt: T("2026-04-01T13:20:00Z"),
    consultedIds: ["p-5"],
  },
  {
    id: "d-10",
    threadId: "t-25",
    outcome: "resolved",
    title: "Decision detail page links back to the originating thread + all feedback.",
    rationale:
      "Provenance is non-negotiable: if you can't get from a decision back to the input that triggered it, the log loses trust. Engineering pushed back on schema complexity — we kept the link as a denormalized field (threadId) on Decision, not a join, so the read path is cheap.",
    decidedById: "p-2",
    decidedAt: T("2026-04-06T14:00:00Z"),
    consultedIds: ["p-1"],
  },
  {
    id: "d-11",
    threadId: "t-26",
    outcome: "wont_do",
    title: "No second accent color. Reuse semantic tones.",
    rationale:
      "Adding a second accent dilutes the vocabulary. We already have success/warning/danger as semantic tones; success in the system reads exactly as 'a positive accent.' If we add a generic 'success accent' we end up with two colors for the same meaning and a lint-rule we can't enforce.",
    decidedById: "p-6",
    decidedAt: T("2026-04-22T15:00:00Z"),
    consultedIds: ["p-1"],
  },
  {
    id: "d-12",
    threadId: "t-27",
    outcome: "resolved",
    title: "Sentence case across the whole UI, no exceptions.",
    rationale:
      "Title Case in nav was a holdover from the marketing copy. Sentence case reads warmer, scans no slower in tests, and removes a per-string decision designers were re-litigating weekly. Considered: Title Case for nav + sentence elsewhere — rejected because the inconsistency was costing more in arguments than it earned in distinctiveness.",
    decidedById: "p-1",
    decidedAt: T("2026-03-28T16:00:00Z"),
    consultedIds: ["p-3", "p-6"],
  },
];

/* ─────────── Export ─────────── */

export const SEED: WorldState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  people,
  projects,
  screens,
  threads,
  feedback,
  notes,
  decisions,
};

/**
 * Counts, exposed for the dashboard/digest hero numbers and for
 * sanity-checking the seed.
 */
export const SEED_COUNTS = {
  people: people.length,
  projects: projects.length,
  screens: screens.length,
  threads: threads.length,
  feedback: feedback.length,
  notes: notes.length,
  decisions: decisions.length,
} as const;
