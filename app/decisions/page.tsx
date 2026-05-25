import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const metadata = {
  title: "Decisions",
};

export default function DecisionsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-12">
      <Card variant="muted" pad="lg">
        <CardTitle>Decision Log — coming next</CardTitle>
        <CardDescription>
          The institutional memory. Resolved threads land here with their
          rationale; filters by project, person, date, and tag. Lands in
          Step 4 — for now, resolve a thread from the Inbox to populate
          this view via the store.
        </CardDescription>
      </Card>
    </main>
  );
}
