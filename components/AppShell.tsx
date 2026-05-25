"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Library, ScrollText } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/cn";

/**
 * AppShell — the chrome around every screen.
 *
 * Sticky header with the wordmark on the left and the route tabs +
 * theme toggle on the right. Sized for keyboard-first triage — the
 * shell never grabs focus, never gets in the way.
 *
 * Routes added incrementally as the build progresses; placeholders that
 * don't exist yet are still rendered so the IA is visible early.
 */
const tabs = [
  { href: "/", label: "Inbox", icon: Inbox },
  { href: "/decisions", label: "Decisions", icon: ScrollText },
  { href: "/design-system", label: "Design system", icon: Library },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}

function Header() {
  const pathname = usePathname() ?? "/";
  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        "border-b border-border bg-background/90 backdrop-blur-[6px]"
      )}
    >
      <div className="mx-auto flex h-12 max-w-[1280px] items-center justify-between px-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground"
          aria-label="Throughline home"
        >
          <Wordmark />
          <span className="font-display text-[var(--text-md)] font-semibold tracking-tight">
            Throughline
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {tabs.map((tab) => {
            const active =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5",
                  "text-[var(--text-sm)] font-medium",
                  "transition-colors duration-[var(--duration-fast)]",
                  active
                    ? "bg-surface-2 text-foreground"
                    : "text-foreground-muted hover:bg-surface-2 hover:text-foreground"
                )}
              >
                <tab.icon size={14} strokeWidth={1.75} />
                {tab.label}
              </Link>
            );
          })}
          <span className="mx-2 h-5 w-px bg-border" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

/** The lifecycle-loop wordmark — small inline SVG. */
function Wordmark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="text-accent"
    >
      <path
        d="M5 6.5C5 4.5 6.5 3 8.5 3h3C13.5 3 15 4.5 15 6.5v0c0 2-1.5 3.5-3.5 3.5h-3C6.5 10 5 11.5 5 13.5v0C5 15.5 6.5 17 8.5 17h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="15" cy="13.5" r="1.6" fill="currentColor" />
    </svg>
  );
}
