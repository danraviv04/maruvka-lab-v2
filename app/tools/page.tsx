import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { tools } from '../../content/tools';

export const metadata: Metadata = {
  title: 'Software',
  description: 'Open-source tools for cancer genomics: mutational signatures, ctDNA inference, MSI detection, and clonal dynamics.',
};

export default function ToolsPage() {
  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Software"
            title="Tools and resources"
            description="Open-source software, pipelines, and datasets from the lab. All tools are documented, tested, and available on GitHub."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {tools.map((t, idx) => {
              const gradients = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-teal-500 to-emerald-500',
                'from-orange-500 to-red-500',
                'from-indigo-500 to-purple-500',
                'from-green-500 to-teal-500',
              ];
              
              return (
                <a
                  key={t.name}
                  href={t.href}
                  className="group relative overflow-hidden rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl hover:border-primary/60"
                >
                  <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gradients[idx % gradients.length]}`} />
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition">{t.name}</h3>
                    <span className="text-sm text-muted transition group-hover:translate-x-0.5 group-hover:text-accent">↗</span>
                  </div>
                  <p className="mt-3 font-serif text-sm leading-relaxed text-muted">{t.description}</p>
                  {t.audience && (
                    <p className="mt-3 text-xs text-muted/80">
                      <span className="font-semibold text-primary">Who should use it:</span> {t.audience}
                    </p>
                  )}
                  {t.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {t.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            tag.includes('Python') ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' :
                            tag.includes('R') ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' :
                            tag.includes('Nextflow') ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300' :
                            tag.includes('Bayesian') ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </a>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
