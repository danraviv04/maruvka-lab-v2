'use client';

import { useState } from 'react';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { focusAreas } from '../../content/focus';

interface ResearchDetail {
  id: string;
  icon: string;
  title: string;
  description: string;
  details: Array<{ title: string; subtitle: string }>;
  gradient: string;
  iconBg: string;
}

const researchDetails: ResearchDetail[] = [
  {
    id: 'liquid-biopsy',
    icon: '💧',
    title: 'Liquid biopsy (cfDNA)',
    description: 'We develop models for ultra-low allele fraction detection, longitudinal monitoring, and rigorous uncertainty quantification. A recurring theme is: how do you separate a true signal from technical noise when the expected signal is tiny?',
    details: [
      { title: 'Error-aware inference', subtitle: 'for sparse observations' },
      { title: 'Longitudinal testing', subtitle: 'under repeated sampling' },
      { title: 'Benchmarking', subtitle: 'and simulation for study design' },
    ],
    gradient: 'from-white to-blue-50/30',
    iconBg: 'bg-blue-500/10',
  },
  {
    id: 'evolution',
    icon: '🧬',
    title: 'Cancer evolution and signatures',
    description: 'We study how mutational processes and selection shape observable genomes. The goal is to infer plausible histories from noisy readouts and connect them to therapeutic pressure.',
    details: [
      { title: 'Signature deconvolution', subtitle: 'with uncertainty estimates' },
      { title: 'Clonal dynamics', subtitle: 'and therapy-driven selection' },
      { title: 'Cohort-level QC', subtitle: 'and harmonization' },
    ],
    gradient: 'from-white to-purple-50/30',
    iconBg: 'bg-purple-500/10',
  },
  {
    id: 'immunology',
    icon: '🛡️',
    title: 'Immunology and prevention',
    description: 'We apply quantitative methods to immune surveillance and prevention. In settings like MSI biology, a key question is: which signals are robust enough to support interventions, not just correlations?',
    details: [
      { title: 'Immune-response modeling', subtitle: 'patterns and constraints' },
      { title: 'Prevention strategies', subtitle: 'grounded in biomarkers' },
      { title: 'Integration', subtitle: 'immunology, genomics, outcomes' },
    ],
    gradient: 'from-white to-green-50/30',
    iconBg: 'bg-green-500/10',
  },
];

export default function ResearchPage() {
  const [selectedResearch, setSelectedResearch] = useState<ResearchDetail | null>(null);

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
            {focusAreas.map((a, idx) => (
              <button
                key={a.title}
                onClick={() => setSelectedResearch(researchDetails[idx])}
                className="rounded-2xl border border-black/5 bg-white p-6 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold text-primary">{a.title}</h3>
                <p className="mt-3 font-serif text-sm leading-relaxed text-text/80">{a.description}</p>
                <span className="mt-4 inline-block text-xs font-medium text-primary">Click to learn more →</span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Modal Overlay */}
      {selectedResearch && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedResearch(null)}
        >
          <div 
            className={`relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-black/5 bg-gradient-to-br ${selectedResearch.gradient} p-8 shadow-2xl transition-all duration-300 sm:p-12`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedResearch(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-2xl text-primary shadow-md transition-all hover:bg-white hover:shadow-lg"
              aria-label="Close"
            >
              ×
            </button>

            {/* Modal Content */}
            <div className="flex items-start gap-6">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${selectedResearch.iconBg} text-4xl`}>
                {selectedResearch.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-semibold text-primary sm:text-4xl">{selectedResearch.title}</h2>
              </div>
            </div>

            <p className="mt-6 font-serif text-lg leading-relaxed text-text/90">
              {selectedResearch.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {selectedResearch.details.map((detail, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl bg-white/80 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="font-semibold text-primary">{detail.title}</p>
                  <p className="mt-2 text-sm text-text/70">{detail.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-serif text-lg text-text/70">
              Click on a focus area above to explore our research in detail
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
