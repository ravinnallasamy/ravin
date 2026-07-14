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
      className="group -mt-[50px] mb-[25px] inline-flex w-fit items-center gap-8 rounded-full bg-surface px-16 py-8 font-mono text-mono-label text-ink-muted shadow-neu-sm transition-shadow hover:text-ink hover:shadow-neu-inset"
    >
      <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-2" aria-hidden />
      {label}
    </Link>
  );
}
