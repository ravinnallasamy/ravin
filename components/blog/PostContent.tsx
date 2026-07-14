import type { ContentBlock } from '@/lib/blog';

export function PostContent({ content }: { content: ContentBlock[] }) {
  return (
    <div className="flex flex-col gap-16">
      {content.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={index} className="text-body leading-relaxed text-ink mb-8">
                {block.text}
              </p>
            );
          case 'heading':
            return (
              <h2 key={index} className="text-h2 font-bold text-ink mt-24 mb-8">
                {block.text}
              </h2>
            );
          case 'code':
            return (
              <pre key={index} className="bg-surface-raised p-16 rounded-xl overflow-x-auto font-mono text-mono-body text-ink border border-border/40 my-8">
                <code>{block.text}</code>
              </pre>
            );
          case 'list':
            return (
              <ul key={index} className="list-disc pl-24 my-8 space-y-4">
                {block.items?.map((item, idx) => (
                  <li key={idx} className="text-body text-ink leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
