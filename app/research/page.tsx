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

          {/* <div className="mt-12 grid gap-6 md:grid-cols-3">
            {focusAreas.map((a, idx) => {
              const gradients = [
                { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200', accent: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
                { bg: 'from-purple-50 to-pink-50', border: 'border-purple-200', accent: 'bg-gradient-to-r from-purple-500 to-pink-500' },
                { bg: 'from-teal-50 to-emerald-50', border: 'border-teal-200', accent: 'bg-gradient-to-r from-teal-500 to-emerald-500' },
              ];
              
              return (
                <Link
                  key={a.title}
                  href={a.href}
                  className={`group relative overflow-hidden rounded-2xl border ${gradients[idx].border} bg-gradient-to-br ${gradients[idx].bg} p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className={`absolute top-0 left-0 h-1 w-full ${gradients[idx].accent}`} />
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-primary">{a.title}</h3>
                    <span className="text-sm text-primary/60 transition group-hover:translate-x-0.5">→</span>
                  </div>
                  <p className="mt-3 font-serif text-sm leading-relaxed text-muted">{a.description}</p>
                  {a.tag && (
                    <span className={`mt-4 inline-block rounded-full ${gradients[idx].accent} px-3 py-1 text-xs font-medium text-white shadow-sm`}>
                      {a.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </div> */}

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {focusAreas.map((a, idx) => {
              const gradients = [
                { 
                  bg: 'from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950', 
                  border: 'border-blue-200 dark:border-blue-800', 
                  accent: 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                },
                { 
                  bg: 'from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950', 
                  border: 'border-purple-200 dark:border-purple-800', 
                  accent: 'bg-gradient-to-r from-purple-500 to-pink-500' 
                },
                { 
                  bg: 'from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950', 
                  border: 'border-teal-200 dark:border-teal-800', 
                  accent: 'bg-gradient-to-r from-teal-500 to-emerald-500' 
                },
              ];
              
              return (
                <Link
                  key={a.title}
                  href={a.href}
                  className={`group relative overflow-hidden rounded-2xl border ${gradients[idx].border} bg-gradient-to-br ${gradients[idx].bg} p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className={`absolute top-0 left-0 h-1 w-full ${gradients[idx].accent}`} />
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-primary">{a.title}</h3>
                    <span className="text-sm text-primary/60 transition group-hover:translate-x-0.5">→</span>
                  </div>
                  <p className="mt-3 font-serif text-sm leading-relaxed text-muted">{a.description}</p>
                  {a.tag && (
                    <span className={`mt-4 inline-block rounded-full ${gradients[idx].accent} px-3 py-1 text-xs font-medium text-white shadow-sm`}>
                      {a.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

        </Container>
      </section>

      <section className="bg-gradient-to-br from-white dark:from-slate-900 via-gray-50 dark:via-slate-800 to-white dark:to-slate-900 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-semibold text-primary">Our Approach</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-900 p-6 shadow-md hover:shadow-xl transition">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="mt-3 font-semibold text-primary">Rigorous inference</h3>
                <p className="mt-2 text-sm text-text/70">
                  We build statistical models that are honest about uncertainty and survive contact with real data.
                </p>
              </div>
              <div className="rounded-xl bg-white dark:bg-slate-800 border-2 border-purple-300 dark:border-purple-900 p-6 shadow-md hover:shadow-xl transition">
                <div className="text-4xl mb-3">🔬</div>
                <h3 className="mt-3 font-semibold text-primary">Collaborative science</h3>
                <p className="mt-2 text-sm text-text/70">
                  Close partnerships with clinicians and wet labs ensure our methods address real biological questions.
                </p>
              </div>
              <div className="rounded-xl bg-white dark:bg-slate-800 border-2 border-teal-300 dark:border-teal-900 p-6 shadow-md hover:shadow-xl transition">
                <div className="text-4xl mb-3">💻</div>
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
