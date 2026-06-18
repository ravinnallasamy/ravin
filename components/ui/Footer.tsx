import Link from 'next/link';
import siteJson from '@/content/site.json';
import socialJson from '@/content/social.json';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-16 py-48 md:flex-row md:items-center md:justify-between md:px-24">
        <div>
          <p className="font-display text-h3 text-ink">{siteJson.name}</p>
          <p className="text-body text-ink-muted">{siteJson.role} · {siteJson.location}</p>
        </div>
        <div className="flex gap-24 text-body text-ink-muted">
          <Link href={socialJson.github} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            GitHub
          </Link>
          <Link href={`https://${socialJson.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            LinkedIn
          </Link>
          <Link href={`mailto:${socialJson.email}`} className="hover:text-ink">
            Email
          </Link>
        </div>
      </div>
    </footer>
  );
}
