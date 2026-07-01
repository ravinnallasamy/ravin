import type { Metadata } from 'next';
import { Hero } from '@/components/work/Hero';
import { List } from '@/components/work/List';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Projects I have designed, built, and shipped — full-stack products and the AI systems inside them.',
};

export default function WorkPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <List />
    </div>
  );
}
