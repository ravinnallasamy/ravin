export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      {eyebrow && (
        <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">
          {eyebrow}
        </span>
      )}
      <h2 className="text-h2 md:text-h2-lg text-ink">{title}</h2>
      {description && <p className="max-w-2xl text-body text-ink-muted">{description}</p>}
    </div>
  );
}
