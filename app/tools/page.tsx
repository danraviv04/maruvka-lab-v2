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
            {tools.map((t) => (
              <a
                key={t.name}
                href={t.href}
                className="group rounded-2xl border border-black/5 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary group-hover:text-secondary transition">{t.name}</h3>
                  <span className="text-sm text-primary/60 transition group-hover:translate-x-0.5">↗</span>
                </div>
                <p className="mt-3 font-serif text-sm leading-relaxed text-text/80">{t.description}</p>
                {t.audience && (
                  <p className="mt-3 text-xs text-text/60">
                    <span className="font-semibold text-primary">Who should use it:</span> {t.audience}
                  </p>
                )}
                {t.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-text/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </a>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
