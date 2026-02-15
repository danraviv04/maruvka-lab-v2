import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '../../../components/Container';
import SectionHeader from '../../../components/SectionHeader';
import { publications } from '../../../content/publications';

export const metadata: Metadata = {
  title: 'Cancer Evolution & Signatures - Research',
  description: 'Modeling clonal dynamics, mutational processes, and therapy-driven selection to connect genotype, history, and phenotype.',
};

export default function EvolutionSignaturesPage() {
  const relatedPubs = publications.filter(p => p.tags?.includes('signatures') || p.tags?.includes('evolution'));

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
            title="Cancer evolution and signatures"
            description="Modeling clonal dynamics, mutational processes, and therapy-driven selection to connect genotype, history, and phenotype."
          />

          <div className="mx-auto mt-12 max-w-4xl space-y-8">
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-md transition hover:shadow-xl">
              <h3 className="text-xl font-semibold text-primary">Overview</h3>
              <p className="mt-4 font-serif leading-relaxed text-muted">
                Tumors evolve through accumulation of mutations shaped by mutational processes (signatures) and selective 
                pressures. Every observed genome is a snapshot of a hidden evolutionary trajectory. Our goal is to infer 
                plausible histories from these snapshots and connect them to therapeutic outcomes.
              </p>
              <p className="mt-4 font-serif leading-relaxed text-muted">
                We develop models that quantify mutational signature activities, reconstruct clonal phylogenies, and 
                characterize therapy-induced selection—always with careful attention to uncertainty and identifiability.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-md transition hover:shadow-xl">
              <h3 className="text-xl font-semibold text-primary">Current Projects</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-primary">Signature deconvolution with uncertainty estimates</h4>
                  <p className="mt-2 text-sm text-muted">
                    Bayesian and maximum-likelihood methods for attributing observed mutations to known or de novo 
                    mutational processes, with robust confidence intervals.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Clonal dynamics and therapy-driven selection</h4>
                  <p className="mt-2 text-sm text-muted">
                    Modeling how chemotherapy, targeted therapy, and immunotherapy reshape clonal landscapes. 
                    Integrating longitudinal sampling to distinguish neutral drift from selection.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Cohort-level quality control and harmonization</h4>
                  <p className="mt-2 text-sm text-muted">
                    Methods to detect batch effects, technical artifacts, and systematic biases in large-scale 
                    sequencing studies before biological interpretation.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Connecting signatures to mechanisms</h4>
                  <p className="mt-2 text-sm text-muted">
                    Experimental validation frameworks and literature integration to move from pattern recognition 
                    to mechanistic understanding of mutational processes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Evolutionary predictors of drug resistance</h4>
                  <p className="mt-2 text-sm text-muted">
                    Using pre-treatment mutational patterns to forecast resistance mechanisms and guide therapy selection.
                  </p>
                </div>
              </div>
            </div>

            {relatedPubs.length > 0 && (
              <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-md transition hover:shadow-xl">
                <h3 className="text-xl font-semibold text-primary">Related Publications</h3>
                <div className="mt-6 space-y-4">
                  {relatedPubs.map((p) => (
                    <div key={p.title} className="border-l-2 border-secondary pl-4">
                      <p className="text-sm font-semibold text-primary">{p.title}</p>
                      <p className="mt-1 text-xs text-muted">{p.authors} — {p.venue} ({p.year})</p>
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
                We're interested in collaborations around longitudinal tumor sequencing, signature validation, 
                and evolutionary modeling. If you have cohort data or mechanistic questions about mutational processes, 
                let's talk.
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
