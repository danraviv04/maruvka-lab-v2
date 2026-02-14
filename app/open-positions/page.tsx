import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { positions } from '../../content/positions';
import { site } from '../../content/site';

export const metadata: Metadata = {
  title: 'Join the Lab - Open Positions',
  description: 'Opportunities to join the Maruvka Lab at Technion.',
};

export default function OpenPositionsPage() {
  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Join"
            title="Join the lab"
            description="We welcome motivated students, engineers, and collaborators at all career stages."
          />

          <div className="mx-auto mt-8 max-w-4xl">
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-primary">What we're looking for</h3>
              <p className="mt-3 font-serif text-sm leading-relaxed text-text/80">
                Strong quantitative background (statistics, computer science, applied math, or computational biology). 
                Interest in cancer genomics, statistical inference, or method development. 
                Commitment to reproducible science and open code.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-center text-xl font-semibold text-primary">Open positions</h2>
          </div>

          <div className="mt-8 grid gap-6">
            {positions.map((p) => (
              <article key={p.title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-semibold text-primary">{p.title}</h2>
                  <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/10">
                    {p.level}
                  </span>
                </div>
                <p className="mt-3 font-serif text-sm leading-relaxed text-text/80">{p.summary}</p>
                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-text/80">
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <p className="mt-5 text-sm text-text/70">
                  <span className="font-semibold text-primary">How to apply:</span> {p.howToApply}
                </p>
              </article>
            ))}

            <div className="rounded-2xl border border-black/5 bg-primary p-6 text-white shadow-soft">
              <h3 className="text-lg font-semibold">Rotation students & general inquiries</h3>
              <p className="mt-2 font-serif text-sm text-white/80">
                Not seeing a perfect match? Interested in a rotation or short-term collaboration? 
                Send a short note with your background, interests, and availability.
              </p>
              <a href={`mailto:${site.email}`} className="mt-4 inline-block rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-white hover:bg-secondary/90">
                Email the lab
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
