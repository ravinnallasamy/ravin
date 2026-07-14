import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type BackLinkProps = {
  href: string;
  label: string;
};

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="group inline-flex w-fit items-center gap-6 font-mono text-mono-label font-semibold tracking-wider text-ink-muted transition-colors hover:text-ink"
    >
      <ArrowLeft
        size={16}
        className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
        aria-hidden
      />
      <span>{label}</span>
    </Link>
  );
}
