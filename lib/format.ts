/**
 * Small formatting helpers used in inbox / log / digest rows.
 *
 * Time deltas use short, calm words — "2d", "3w" — matching the
 * "calm enterprise" register the design system commits to.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * "just now" / "12m" / "3h" / "5d" / "3w" / "Apr 12"
 *   - First 30s: "just now"
 *   - Minutes for < 1h
 *   - Hours for < 1d
 *   - Days for < 4w
 *   - Otherwise: short absolute date (Apr 12)
 */
export function timeAgoShort(iso: string, now: Date = new Date()): string {
  const t = new Date(iso).getTime();
  const delta = now.getTime() - t;
  if (delta < 30 * SECOND) return "just now";
  if (delta < HOUR) return `${Math.round(delta / MINUTE)}m`;
  if (delta < DAY) return `${Math.round(delta / HOUR)}h`;
  if (delta < 4 * WEEK) return `${Math.round(delta / DAY)}d`;
  if (delta < 52 * WEEK) return `${Math.round(delta / WEEK)}w`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** "Apr 12, 2026 · 2:34 PM" — full absolute, used in detail panes. */
export function dateLong(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Friendly duration — "2 days", "3 weeks" — used in the digest. */
export function durationHuman(ms: number): string {
  if (ms < HOUR) return `${Math.max(1, Math.round(ms / MINUTE))} min`;
  if (ms < DAY) return `${Math.round(ms / HOUR)} hr`;
  if (ms < 4 * WEEK) return `${Math.round(ms / DAY)} days`;
  return `${Math.round(ms / WEEK)} weeks`;
}

/** True if a thread is older than `days` (default 14) since updatedAt. */
export function isAging(updatedAt: string, days = 14, now: Date = new Date()) {
  return now.getTime() - new Date(updatedAt).getTime() > days * DAY;
}
