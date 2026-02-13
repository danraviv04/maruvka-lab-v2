import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { publications } from '../../content/publications';

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Papers and preprints from the Maruvka Lab.',
};

export default function PublicationsPage() {
  const byYear = publications.reduce<Record<number, typeof publications>>((acc, p) => {
    (acc[p.year] ??= []).push(p);
    return acc;
  }, {});

  const years = Object.keys(byYear)
    .map((y) => Number(y))
    .sort((a, b) => b - a);

  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Outputs"
            title="Publications"
            description="This list is stored in content/publications.ts. Swap the placeholders with real citations and links."
          />

          <div className="mt-12 space-y-12">
            {years.map((year) => (
              <div key={year}>
                <h2 className="text-xl font-semibold text-primary">{year}</h2>
                <div className="mt-4 space-y-4">
                  {byYear[year].map((p) => (
                    <article key={p.title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
                      <h3 className="text-lg font-semibold text-primary">{p.title}</h3>
                      <p className="mt-2 font-serif text-sm text-text/80">{p.authors}</p>
                      {p.venue ? <p className="mt-2 text-sm text-text/70">{p.venue}</p> : null}
                      {p.tags?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/10"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {p.links?.length ? (
                        <div className="mt-4 flex flex-wrap gap-4">
                          {p.links.map((l) => (
                            <a key={l.label} href={l.href} className="text-sm font-semibold text-secondary hover:underline">
                              {l.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
