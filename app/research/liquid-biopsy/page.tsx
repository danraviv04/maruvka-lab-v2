import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '../../../components/Container';
import SectionHeader from '../../../components/SectionHeader';
import { publications } from '../../../content/publications';

export const metadata: Metadata = {
  title: 'Liquid Biopsy (cfDNA) - Research',
  description: 'Early detection and relapse monitoring from blood-based tumor DNA signals with robust statistical inference.',
};

export default function LiquidBiopsyPage() {
  const relatedPubs = publications.filter(p => p.tags?.includes('cfDNA'));

  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mb-6">
            <Link href="/research" className="text-sm text-secondary hover:underline">
              ← Back to Research
            </Link>
          </div>

          <SectionHeader
            eyebrow="Research Focus"
            title="Liquid biopsy (cfDNA)"
            description="Early detection and relapse monitoring from blood-based tumor DNA signals, with robust statistical inference under low signal-to-noise."
          />

          <div className="mx-auto mt-12 max-w-4xl space-y-8">
            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-primary">Overview</h3>
              <p className="mt-4 font-serif leading-relaxed text-text/80">
                Cell-free DNA (cfDNA) in blood carries information about tumor burden, clonal composition, and response to therapy. 
                The challenge is statistical: tumor-derived fragments are rare, error rates are non-negligible, and the 
                question "is this a real signal or noise?" demands careful modeling.
              </p>
              <p className="mt-4 font-serif leading-relaxed text-text/80">
                We build probabilistic frameworks that account for technical variation, incorporate prior information 
                from tissue sequencing when available, and provide honest uncertainty estimates for clinical decision-making.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-primary">Current Projects</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-primary">Error-aware inference for sparse observations</h4>
                  <p className="mt-2 text-sm text-text/70">
                    Developing statistical tests that maintain calibrated false-positive rates even when expected 
                    variant allele fractions are at or below sequencing error thresholds.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Longitudinal monitoring frameworks</h4>
                  <p className="mt-2 text-sm text-text/70">
                    Time-series models for tracking minimal residual disease, distinguishing recurrence from technical 
                    noise, and quantifying lead time vs. imaging endpoints.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Assay design and power analysis</h4>
                  <p className="mt-2 text-sm text-text/70">
                    Simulation frameworks to optimize panel size, sequencing depth, and sampling frequency for specific 
                    clinical scenarios (adjuvant monitoring, screening cohorts).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Multi-cancer early detection</h4>
                  <p className="mt-2 text-sm text-text/70">
                    Signal integration across mutational, methylation, and fragmentation features for population-level 
                    screening with controlled specificity.
                  </p>
                </div>
              </div>
            </div>

            {relatedPubs.length > 0 && (
              <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-soft">
                <h3 className="text-xl font-semibold text-primary">Related Publications</h3>
                <div className="mt-6 space-y-4">
                  {relatedPubs.map((p) => (
                    <div key={p.title} className="border-l-2 border-secondary pl-4">
                      <p className="text-sm font-semibold text-primary">{p.title}</p>
                      <p className="mt-1 text-xs text-text/70">{p.authors} — {p.venue} ({p.year})</p>
                      {p.links?.length && (
                        <div className="mt-2 flex gap-3">
                          {p.links.map((l) => (
                            <a key={l.label} href={l.href} className="text-xs font-semibold text-secondary hover:underline">
                              {l.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-primary p-8 text-white shadow-soft">
              <h3 className="text-xl font-semibold">Collaborate or Join</h3>
              <p className="mt-3 font-serif text-white/90">
                We're looking for students and collaborators interested in statistical inference, assay design, 
                or clinical validation of ctDNA methods. If you have a dataset or a methodological question, reach out.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-white hover:bg-secondary/90"
                >
                  Contact us
                </Link>
                <Link
                  href="/open-positions"
                  className="rounded-full border border-white/30 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Open positions
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
