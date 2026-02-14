import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { focusAreas } from '../../content/focus';

export const metadata: Metadata = {
  title: 'Research',
  description: 'Computational methods for liquid biopsy, cancer evolution, mutational signatures, and immunology-driven prevention strategies.',
};

export default function ResearchPage() {
  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Research"
            title="Focus areas"
            description="We work at the intersection of genomics, statistics, and computation. The exact projects evolve, but the core questions stay stable."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {focusAreas.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className="group rounded-2xl border border-black/5 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary">{a.title}</h3>
                  <span className="text-sm text-primary/60 transition group-hover:translate-x-0.5">→</span>
                </div>
                <p className="mt-3 font-serif text-sm leading-relaxed text-text/80">{a.description}</p>
                {a.tag && (
                  <span className="mt-4 inline-block rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/10">
                    {a.tag}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-semibold text-primary">Our Approach</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-background p-6">
                <div className="text-3xl">📊</div>
                <h3 className="mt-3 font-semibold text-primary">Rigorous inference</h3>
                <p className="mt-2 text-sm text-text/70">
                  We build statistical models that are honest about uncertainty and survive contact with real data.
                </p>
              </div>
              <div className="rounded-xl bg-background p-6">
                <div className="text-3xl">🔬</div>
                <h3 className="mt-3 font-semibold text-primary">Collaborative science</h3>
                <p className="mt-2 text-sm text-text/70">
                  Close partnerships with clinicians and wet labs ensure our methods address real biological questions.
                </p>
              </div>
              <div className="rounded-xl bg-background p-6">
                <div className="text-3xl">💻</div>
                <h3 className="mt-3 font-semibold text-primary">Reproducible tools</h3>
                <p className="mt-2 text-sm text-text/70">
                  All methods are released as documented, tested software with clear benchmarking.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
