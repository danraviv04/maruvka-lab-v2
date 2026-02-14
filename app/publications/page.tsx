'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { publications } from '../../content/publications';

// Note: metadata export removed because this is now a client component
// Move metadata to a parent layout if needed for SEO

export default function PublicationsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Get unique types and tags
  const types = ['all', ...Array.from(new Set(publications.map(p => p.type).filter(Boolean)))];
  const allTags = Array.from(new Set(publications.flatMap(p => p.tags || [])));
  const tags = ['all', ...allTags.sort()];

  // Filter publications
  const filtered = publications.filter(p => {
    const typeMatch = selectedType === 'all' || p.type === selectedType;
    const tagMatch = selectedTag === 'all' || p.tags?.includes(selectedTag);
    return typeMatch && tagMatch;
  });

  // Group by year
  const byYear = filtered.reduce<Record<number, typeof publications>>((acc, p) => {
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
            description="Peer-reviewed papers, preprints, and conference proceedings from the lab."
          />

          {/* Filters */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="mr-2 text-sm font-semibold text-primary">Type:</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t === 'all' ? 'All types' : t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mr-2 text-sm font-semibold text-primary">Topic:</label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  {tags.map((t) => (
                    <option key={t} value={t}>
                      {t === 'all' ? 'All topics' : t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-sm text-text/70">
              Showing {filtered.length} of {publications.length} publications
            </div>
          </div>

          {/* Publications list */}
          <div className="mt-12 space-y-12">
            {years.length > 0 ? (
              years.map((year) => (
                <div key={year}>
                  <h2 className="text-xl font-semibold text-primary">{year}</h2>
                  <div className="mt-4 space-y-4">
                    {byYear[year].map((p) => (
                      <article key={p.title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft transition hover:shadow-md">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="flex-1 text-lg font-semibold text-primary">{p.title}</h3>
                          {p.type && (
                            <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary ring-1 ring-secondary/20">
                              {p.type}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 font-serif text-sm text-text/80">{p.authors}</p>
                        {p.venue && <p className="mt-2 text-sm text-text/70">{p.venue}</p>}
                        {p.tags?.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {p.tags.map((t) => (
                              <button
                                key={t}
                                onClick={() => setSelectedTag(t)}
                                className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/10 transition hover:bg-primary/10"
                              >
                                {t}
                              </button>
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
              ))
            ) : (
              <div className="rounded-2xl border border-black/5 bg-white p-12 text-center">
                <p className="text-text/70">No publications match the selected filters.</p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
