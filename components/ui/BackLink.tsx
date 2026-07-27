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
      // -my-12 keeps the link optically flush with surrounding text while the
      // padding lifts the hit area to the 44px minimum.
      className="group -my-12 inline-flex w-fit items-center gap-6 py-12 font-mono text-mono-label font-semibold text-ink-muted transition-colors hover:text-ink"
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
