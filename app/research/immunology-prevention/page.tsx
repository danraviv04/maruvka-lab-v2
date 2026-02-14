import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '../../../components/Container';
import SectionHeader from '../../../components/SectionHeader';
import { publications } from '../../../content/publications';

export const metadata: Metadata = {
  title: 'Immunology & Prevention - Research',
  description: 'Quantitative approaches to immune surveillance, MSI biology, and rational design of prevention strategies.',
};

export default function ImmunologyPreventionPage() {
  const relatedPubs = publications.filter(p => p.tags?.includes('immunology') || p.tags?.includes('prevention') || p.tags?.includes('MSI'));

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
            title="Immunology and prevention"
            description="Quantitative approaches to immune surveillance, MSI biology, and rational design of prevention strategies."
          />

          <div className="mx-auto mt-12 max-w-4xl space-y-8">
            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-primary">Overview</h3>
              <p className="mt-4 font-serif leading-relaxed text-text/80">
                Some cancers are highly immunogenic (e.g., microsatellite-unstable tumors), while others evade immune 
                detection. Understanding why—and designing interventions that tip the balance toward surveillance and 
                prevention—requires quantitative models that integrate genomic, immunologic, and clinical data.
              </p>
              <p className="mt-4 font-serif leading-relaxed text-text/80">
                We apply computational methods to MSI biology, immune-response signatures, and prevention trial design. 
                The goal is to identify biomarkers robust enough to support clinical interventions, not just correlations.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-primary">Current Projects</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-primary">Immune response modeling</h4>
                  <p className="mt-2 text-sm text-text/70">
                    Quantifying patterns and constraints in tumor-immune interactions using transcriptomic and 
                    mutational data. Identifying features predictive of immunotherapy response.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">MSI biology and Lynch syndrome</h4>
                  <p className="mt-2 text-sm text-text/70">
                    Statistical frameworks for microsatellite instability detection, neoantigen prediction, and 
                    understanding why MSI-high tumors respond to immune checkpoint blockade.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Biomarkers for prevention strategies</h4>
                  <p className="mt-2 text-sm text-text/70">
                    Developing and validating biomarkers that can stratify individuals for chemoprevention or 
                    early-intervention trials. Focus on germline + somatic integration.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Integrating genomics, immunology, and outcomes</h4>
                  <p className="mt-2 text-sm text-text/70">
                    Building multi-modal models that link germline risk, somatic evolution, immune contexture, 
                    and long-term clinical outcomes in cohort studies.
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
                We're interested in collaborations with immunologists, clinicians running prevention trials, 
                and groups with MSI-focused cohorts. If you have a dataset or a prevention-oriented question, reach out.
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
