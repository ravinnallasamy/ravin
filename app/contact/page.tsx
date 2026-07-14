import type { Metadata } from 'next';
import { Hero } from '@/components/contact/Hero';
import { Elsewhere } from '@/components/contact/Elsewhere';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch, or book time directly.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Elsewhere />
    </div>
  );
}
