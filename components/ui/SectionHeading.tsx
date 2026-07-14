export function SectionHeading({
  eyebrow,
  title,
  description,
  as = 'h2',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  as?: 'h1' | 'h2';
}) {
  const Heading = as;
  const sizeClass = as === 'h1' ? 'text-h1 sm:text-h1-md lg:text-h1-lg' : 'text-h2 md:text-h2-lg';

  return (
    <div className="flex flex-col gap-8">
      {eyebrow && (
        <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">
          {eyebrow}
        </span>
      )}
      <Heading className={`${sizeClass} text-ink`}>{title}</Heading>
      {description && <p className="max-w-2xl text-body text-ink-muted [.text-center_&]:mx-auto">{description}</p>}
    </div>
  );
}
