'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { Publication, categorizePublication, extractTags } from '../../lib/publications';

// Note: metadata export removed because this is now a client component
// Move metadata to a parent layout if needed for SEO

type ExtendedPublication = Publication & {
  type: string;
  tags: string[];
};

export default function PublicationsPage() {
  const [publications, setPublications] = useState<ExtendedPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const loadPublications = async () => {
    try {
      const response = await fetch('/api/publications', {
        cache: 'no-store', // Force fresh data
      });
      const result = await response.json();

      if (result.success && result.data) {
        // Enhance publications with type and tags
        const enhanced = result.data.map((pub: Publication) => ({
          ...pub,
          type: categorizePublication(pub.venue),
          tags: extractTags(pub.title, pub.venue),
        }));
        setPublications(enhanced);
        setLastUpdated(result.lastUpdated);
        setError(null);
      } else {
        setError(result.error || 'Failed to load publications');
      }
    } catch (err) {
      setError('Failed to fetch publications');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPublications();
  };

  useEffect(() => {
    loadPublications();
  }, []);

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
  const byYear = filtered.reduce<Record<number, ExtendedPublication[]>>((acc, p) => {
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
            description="Peer-reviewed papers, preprints, and conference proceedings from the lab. Automatically fetched from Google Scholar."
          />

          {loading ? (
            <div className="mt-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
              <p className="mt-4 text-muted">Loading publications from Google Scholar...</p>
            </div>
          ) : error ? (
            <div className="mt-12 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-12 text-center">
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Info bar */}
              {lastUpdated && (
                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-text/60">
                  <span>Last updated: {new Date(lastUpdated).toLocaleString()}</span>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-primary transition hover:bg-primary/20 disabled:opacity-50"
                    title="Refresh publications from Google Scholar"
                  >
                    <svg 
                      className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                      />
                    </svg>
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              )}

              {/* Filters */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <label className="mr-2 text-sm font-semibold text-primary">Type:</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
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
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
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
                        {byYear[year].map((p, index) => {
                          const typeColors = {
                            journal: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
                            preprint: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
                            conference: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white',
                            other: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
                          };
                          
                          return (
                            <article key={`${p.title}-${index}`} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition hover:shadow-lg hover:-translate-y-0.5">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <h3 className="flex-1 text-lg font-semibold text-primary">
                                  <a 
                                    href={p.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-accent transition-colors"
                                  >
                                    {p.title}
                                  </a>
                                </h3>
                                {p.type && (
                                  <span className={`rounded-full px-3 py-1 text-xs font-medium shadow-sm ${typeColors[p.type as keyof typeof typeColors] || typeColors.other}`}>
                                    {p.type}
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 font-serif text-sm text-muted">{p.authors}</p>
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
                              <div className="mt-4 flex flex-wrap gap-4">
                                <a 
                                  href={p.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-semibold text-secondary hover:underline"
                                >
                                  View on Google Scholar →
                                </a>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center">
                    <p className="text-muted">No publications match the selected filters.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </Container>
      </section>
    </div>
  );
}
