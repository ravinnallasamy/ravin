export function StatReadout({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-mono-label font-mono text-ink-muted">{label}</span>
      <span className="font-display text-h2 text-ink">{value}</span>
    </div>
  );
}
