"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Component,
  Filter,
  MessageSquare,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Input";
import {
  Modal,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import {
  Sheet,
  SheetBody,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import { PressableTag, StatusDot, Tag } from "@/components/ui/Tag";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/components/ui/Toast";

/**
 * Showcase — the home page IS the design-system documentation.
 *
 * Each section presents one primitive with all its variants/states.
 * This screen exists to (a) let me catch regressions visually and
 * (b) double as the source of truth for "how to use the primitives"
 * when I start building the Triage Inbox and the rest of the app.
 */
export function Showcase() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-12">
      <Header />

      <Section
        id="button"
        title="Button"
        description="Variants for hierarchy, sizes for density, states for clarity. Loading + icon slots included."
      >
        <ButtonGroup />
      </Section>

      <Section
        id="tag"
        title="Tag"
        description="Status, source, priority, project. Tones map to semantic state; non-interactive and removable variants."
      >
        <TagGroup />
      </Section>

      <Section
        id="input"
        title="Input"
        description="Text input with optional icons, sizes, and an error tone. Field wrapper adds label + helper / error."
      >
        <InputGroup />
      </Section>

      <Section
        id="select"
        title="Select"
        description="Native select styled to match Input — accessibility and keyboard come for free."
      >
        <SelectGroup />
      </Section>

      <Section
        id="card"
        title="Card"
        description="Surface, raised, muted, outline. The newspaper-cell container for grouped content."
      >
        <CardGroup />
      </Section>

      <Section
        id="overlays"
        title="Modal · Sheet · Toast"
        description="Three overlay primitives covering focused dialogs, full-task panels, and transient status."
      >
        <OverlayGroup />
      </Section>

      <Footer />
    </main>
  );
}

/* ─────────── Sections ─────────── */

function Header() {
  return (
    <header className="mb-12 flex items-start justify-between gap-6">
      <div>
        <p className="text-[var(--text-2xs)] font-medium uppercase tracking-[0.18em] text-foreground-muted">
          Throughline · Design System
        </p>
        <h1 className="font-display mt-2 text-[var(--text-3xl)] font-semibold leading-tight text-foreground">
          The primitive library.
        </h1>
        <p className="mt-3 max-w-[60ch] text-[var(--text-md)] text-foreground-muted">
          Eight primitives, each documented with their full variant matrix.
          Built on a CSS-variable token layer so light, dark, and future
          themes share one source of truth. The app screens get built on top
          of these — not in parallel with them.
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-t border-border py-10 first-of-type:border-t-0"
    >
      <div className="mb-6 flex items-baseline justify-between gap-6">
        <div>
          <h2 className="font-display text-[var(--text-2xl)] font-semibold tracking-tight">
            {title}
          </h2>
          <p className="mt-1 max-w-[60ch] text-[var(--text-sm)] text-foreground-muted">
            {description}
          </p>
        </div>
        <a
          href={`#${id}`}
          className="text-[var(--text-2xs)] font-mono uppercase tracking-[0.18em] text-foreground-subtle hover:text-foreground"
        >
          #{id}
        </a>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Demo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[var(--text-2xs)] font-mono uppercase tracking-[0.16em] text-foreground-subtle">
        {label}
      </p>
      <Card variant="outline" pad="md" className="flex flex-wrap items-center gap-3">
        {children}
      </Card>
    </div>
  );
}

/* ─────────── Button ─────────── */

function ButtonGroup() {
  return (
    <>
      <Demo label="Variants">
        <Button variant="primary">Resolve</Button>
        <Button variant="secondary">Discuss</Button>
        <Button variant="outline">Edit</Button>
        <Button variant="ghost">Skip</Button>
        <Button variant="danger" iconLeft={<Trash2 size={14} />}>
          Won&apos;t do
        </Button>
        <Button variant="link">View decision log</Button>
      </Demo>
      <Demo label="Sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Demo>
      <Demo label="States">
        <Button>Default</Button>
        <Button loading>Resolving…</Button>
        <Button disabled>Disabled</Button>
        <Button iconLeft={<Plus size={14} />}>New thread</Button>
        <Button iconRight={<ArrowRight size={14} />}>Next item</Button>
        <Button block variant="secondary">
          Block / full width
        </Button>
      </Demo>
    </>
  );
}

/* ─────────── Tag ─────────── */

function TagGroup() {
  const [active, setActive] = useState("All");
  const filters = ["All", "Figma", "Slack", "Email", "Calls"];
  return (
    <>
      <Demo label="Tones">
        <Tag tone="neutral">Figma</Tag>
        <Tag tone="accent">In discussion</Tag>
        <Tag tone="success">Resolved</Tag>
        <Tag tone="warning">Triaged</Tag>
        <Tag tone="danger">Won&apos;t do</Tag>
        <Tag tone="ghost">P3</Tag>
      </Demo>
      <Demo label="Sizes + removable">
        <Tag size="sm">small</Tag>
        <Tag size="md">medium</Tag>
        <Tag size="lg">large</Tag>
        <Tag tone="accent" onRemove={() => {}}>
          Project A
        </Tag>
      </Demo>
      <Demo label="StatusDot in row context">
        <div className="flex flex-col gap-2 w-full">
          <Row dot="accent" status="In discussion" item="Hero CTA copy needs to be sharper" source="Figma" />
          <Row dot="warning" status="Triaged" item="Empty state illustration looks generic" source="Slack" />
          <Row dot="success" status="Resolved" item="Onboarding step 3 collapses on mobile" source="Email" />
        </div>
      </Demo>
      <Demo label="Pressable / filter chips">
        {filters.map((f) => (
          <PressableTag
            key={f}
            pressed={active === f}
            onClick={() => setActive(f)}
          >
            {f}
          </PressableTag>
        ))}
      </Demo>
    </>
  );
}

function Row({
  dot,
  status,
  item,
  source,
}: {
  dot: "accent" | "warning" | "success";
  status: string;
  item: string;
  source: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2">
      <StatusDot tone={dot} />
      <Tag tone="ghost" size="sm">
        {status}
      </Tag>
      <span className="flex-1 truncate text-[var(--text-sm)] text-foreground">
        {item}
      </span>
      <Tag tone="neutral" size="sm">
        {source}
      </Tag>
    </div>
  );
}

/* ─────────── Input ─────────── */

function InputGroup() {
  return (
    <>
      <Demo label="Sizes + icons">
        <div className="flex flex-col gap-3 w-full max-w-md">
          <Input size="sm" placeholder="Search feedback…" iconLeft={<Search size={13} />} />
          <Input size="md" placeholder="Search feedback…" iconLeft={<Search size={14} />} />
          <Input size="lg" placeholder="Search feedback…" iconLeft={<Search size={15} />} />
        </div>
      </Demo>
      <Demo label="Field — label, helper, error">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          <Field
            id="title"
            label="Decision title"
            helper="Short — one line, sentence case. This shows up in the log."
            required
          >
            <Input id="title" placeholder="Use sentence-case CTAs" />
          </Field>
          <Field
            id="rationale"
            label="Rationale"
            error="Tell future-you why."
          >
            <Input id="rationale" tone="error" defaultValue="" />
          </Field>
        </div>
      </Demo>
      <Demo label="Textarea + disabled">
        <div className="flex flex-col gap-3 w-full max-w-lg">
          <Textarea placeholder="Considered and rejected: title-case CTAs (looked like every Shopify template), sentence + period (too soft for primary)…" />
          <Input disabled defaultValue="Locked — already resolved" />
        </div>
      </Demo>
    </>
  );
}

/* ─────────── Select ─────────── */

function SelectGroup() {
  const sources = [
    { value: "figma", label: "Figma comment" },
    { value: "slack", label: "Slack thread" },
    { value: "email", label: "Email" },
    { value: "usability", label: "Usability test" },
    { value: "call", label: "Stakeholder call" },
  ];
  return (
    <Demo label="Sources + sizes">
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Select size="sm" options={sources} placeholder="Source…" />
        <Select size="md" options={sources} defaultValue="figma" />
        <Select size="lg" options={sources} defaultValue="slack" />
        <Select
          size="md"
          tone="error"
          options={sources}
          placeholder="Pick a source"
        />
        <Select size="md" options={sources} defaultValue="email" disabled />
      </div>
    </Demo>
  );
}

/* ─────────── Card ─────────── */

function CardGroup() {
  return (
    <Demo label="Variants">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Card variant="surface">
          <CardHeader>
            <div>
              <CardTitle>Surface</CardTitle>
              <CardDescription>Default — hairline border, no shadow.</CardDescription>
            </div>
            <Tag tone="neutral">Default</Tag>
          </CardHeader>
          <CardBody>
            Used for primary content cells: inbox row groups, decision-log
            entries, dashboard cells.
          </CardBody>
        </Card>
        <Card variant="raised">
          <CardHeader>
            <div>
              <CardTitle>Raised</CardTitle>
              <CardDescription>Hover-elevated. Subtle shadow grows on hover.</CardDescription>
            </div>
            <Tag tone="accent">Hover me</Tag>
          </CardHeader>
          <CardBody>
            For focus-worthy items — pinned threads, the active triage row.
          </CardBody>
        </Card>
        <Card variant="muted">
          <CardHeader>
            <div>
              <CardTitle>Muted</CardTitle>
              <CardDescription>Inset / nested fill. No border.</CardDescription>
            </div>
            <Tag tone="ghost">Inset</Tag>
          </CardHeader>
          <CardBody>
            Good for quoted feedback inside a decision card or for the
            keyboard-shortcuts cheatsheet.
          </CardBody>
        </Card>
        <Card variant="outline">
          <CardHeader>
            <div>
              <CardTitle>Outline</CardTitle>
              <CardDescription>Transparent — for dense lists.</CardDescription>
            </div>
            <Tag tone="neutral">Dense</Tag>
          </CardHeader>
          <CardBody>
            Empty states and ghost containers. Inherits the page background.
          </CardBody>
          <CardFooter>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
            <Button size="sm">Save</Button>
          </CardFooter>
        </Card>
      </div>
    </Demo>
  );
}

/* ─────────── Overlays ─────────── */

function OverlayGroup() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { push } = useToast();

  return (
    <>
      <Demo label="Modal — confirms, short forms">
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal open={modalOpen} onOpenChange={setModalOpen} size="sm">
          <ModalHeader>
            <ModalTitle>Won&apos;t do</ModalTitle>
            <ModalDescription>
              This thread will move to the decision log marked as
              not-pursued, with your rationale attached.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <Field id="reason" label="Rationale" required>
              <Textarea
                id="reason"
                placeholder="Out of scope for this milestone — revisit Q3."
              />
            </Field>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setModalOpen(false);
                push({
                  tone: "neutral",
                  title: "Marked won't do",
                  description: "Hero CTA copy needs to be sharper",
                  action: { label: "Undo", onClick: () => {} },
                });
              }}
            >
              Mark won&apos;t do
            </Button>
          </ModalFooter>
        </Modal>
      </Demo>
      <Demo label="Sheet — full-task panels (right side)">
        <Button variant="secondary" onClick={() => setSheetOpen(true)} iconLeft={<MessageSquare size={14} />}>
          Open item detail
        </Button>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen} side="right" size="lg">
          <SheetHeader>
            <div className="flex items-center gap-2 mb-2">
              <Tag tone="warning" size="sm">Triaged</Tag>
              <Tag tone="neutral" size="sm" icon={<Component size={10} />}>
                Figma
              </Tag>
              <Tag tone="ghost" size="sm">P1</Tag>
            </div>
            <SheetTitle>Hero CTA copy needs to be sharper</SheetTitle>
            <SheetDescription>
              Raised by Priya · Project Web · 2 days ago
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            <p className="text-[var(--text-sm)] text-foreground-muted">
              Original comment: &ldquo;Get started&rdquo; reads generic.
              We&apos;ve done a lot of work on the brand voice; the homepage
              should signal that immediately.
            </p>
            <Card variant="muted" pad="md" className="mt-4">
              <p className="text-[var(--text-2xs)] font-mono uppercase tracking-[0.16em] text-foreground-subtle">
                Discussion · 3 replies
              </p>
              <p className="mt-2 text-[var(--text-sm)]">
                <strong>Priya:</strong> Try &ldquo;Make complex feel calm&rdquo;
                — it&apos;s already our principle.
              </p>
              <p className="mt-2 text-[var(--text-sm)]">
                <strong>You:</strong> Yes — and it lets us drop the secondary
                line entirely.
              </p>
            </Card>
            <div className="mt-6 space-y-4">
              <Field
                id="decision-title"
                label="Resolve — what we decided"
                required
              >
                <Input
                  id="decision-title"
                  placeholder="Use 'Make complex feel calm' as the hero CTA."
                />
              </Field>
              <Field
                id="decision-rationale"
                label="Rationale"
                helper="What we considered and rejected, who decided."
              >
                <Textarea
                  id="decision-rationale"
                  placeholder="Considered: 'Get started' (generic), 'Try Throughline' (product-led but cold)…"
                />
              </Field>
            </div>
          </SheetBody>
          <SheetFooter>
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button
              iconLeft={<CheckCircle2 size={14} />}
              onClick={() => {
                setSheetOpen(false);
                push({
                  tone: "success",
                  title: "Resolved",
                  description: "Decision written to the log.",
                });
              }}
            >
              Resolve & log
            </Button>
          </SheetFooter>
        </Sheet>
      </Demo>
      <Demo label="Toast — transient status">
        <Button
          variant="secondary"
          onClick={() =>
            push({
              tone: "neutral",
              title: "Thread archived",
              action: { label: "Undo", onClick: () => {} },
            })
          }
        >
          Neutral
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            push({
              tone: "success",
              title: "Resolved",
              description: "Decision written to the log.",
            })
          }
        >
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            push({
              tone: "warning",
              title: "5 threads aging",
              description: "Older than 14 days — review and resolve.",
            })
          }
        >
          Warning
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            push({
              tone: "danger",
              title: "Sync failed",
              description: "Figma connection dropped. Retry?",
              action: { label: "Retry", onClick: () => {} },
            })
          }
        >
          Danger
        </Button>
      </Demo>
    </>
  );
}

/* ─────────── Footer ─────────── */

function Footer() {
  return (
    <footer className="mt-16 border-t border-border pt-6 flex flex-wrap items-center gap-3 text-[var(--text-xs)] text-foreground-subtle">
      <Filter size={12} />
      <span>
        Step 0 of the build — primitives only. App screens (Triage Inbox,
        Decision Log, Sheet detail, Digest) land in Steps 2-5.
      </span>
    </footer>
  );
}
