import { SectionHeading } from '@/components/ui/SectionHeading';
import { Form } from '@/components/contact/Form';
import { CoffeeTable } from '@/components/illustrations/CoffeeTable';

export function Hero() {
  return (
    <section
      className="flex h-[calc(100svh-64px)] items-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FBF8F3 0%, #F3EEE6 55%, #ECE4D8 100%)' }}
    >
      <div className="mx-auto grid w-full max-w-5xl gap-24 px-16 py-16 md:grid-cols-2 md:items-center md:gap-64 md:px-24">

        {/* ── Left: illustration ── */}
        <div className="flex items-center justify-center self-end md:-translate-x-[120px]">
          <CoffeeTable />
        </div>

        {/* ── Right: content ── */}
        <div className="flex flex-col gap-12">
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Book a table for coffee"
            description="Let's grab a virtual seat and dive deep into tech, ideas, or whatever's on your mind."
          />
          <Form />
        </div>

      </div>
    </section>
  );
}
