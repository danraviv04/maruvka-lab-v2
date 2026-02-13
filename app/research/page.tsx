import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { focusAreas } from '../../content/focus';

export const metadata: Metadata = {
  title: 'Research',
  description: 'Focus areas and ongoing directions in the Maruvka Lab.',
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
              <a
                key={a.title}
                href={a.href}
                className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold text-primary">{a.title}</h3>
                <p className="mt-3 font-serif text-sm leading-relaxed text-text/80">{a.description}</p>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-16">
            <div id="liquid-biopsy" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-primary sm:text-3xl">Liquid biopsy (cfDNA)</h2>
              <p className="mt-4 font-serif text-base leading-relaxed text-text/80">
                We develop models for ultra-low allele fraction detection, longitudinal monitoring, and rigorous uncertainty
                quantification. A recurring theme is: how do you separate a true signal from technical noise when the
                expected signal is tiny?
              </p>
              <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-text/80">
                <li>Error-aware inference for sparse observations</li>
                <li>Longitudinal testing under repeated sampling</li>
                <li>Benchmarking and simulation for study design</li>
              </ul>
            </div>

            <div id="evolution" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-primary sm:text-3xl">Cancer evolution and signatures</h2>
              <p className="mt-4 font-serif text-base leading-relaxed text-text/80">
                We study how mutational processes and selection shape observable genomes. The goal is to infer plausible
                histories from noisy readouts and connect them to therapeutic pressure.
              </p>
              <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-text/80">
                <li>Signature deconvolution with uncertainty estimates</li>
                <li>Clonal dynamics and therapy-driven selection</li>
                <li>Reproducible cohort-level QC and harmonization</li>
              </ul>
            </div>

            <div id="immunology" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-primary sm:text-3xl">Immunology and prevention</h2>
              <p className="mt-4 font-serif text-base leading-relaxed text-text/80">
                We apply quantitative methods to immune surveillance and prevention. In settings like MSI biology, a key
                question is: which signals are robust enough to support interventions, not just correlations?
              </p>
              <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-text/80">
                <li>Modeling immune-response patterns and constraints</li>
                <li>Prevention strategies grounded in measurable biomarkers</li>
                <li>Connecting immunology, genomics, and patient outcomes</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
