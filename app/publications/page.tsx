'use client';

import { useState, useEffect } from 'react';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { Publication, categorizePublication, extractTags } from '../../lib/publications';

// Note: metadata export removed because this is now a client component
// Move metadata to a parent layout if needed for SEO

type ExtendedPublication = Publication & {
  type: string;
  tags: string[];
};

// Used until the API reports the profile it actually scraped (it honours SCHOLAR_ID).
const DEFAULT_SCHOLAR_PROFILE = 'https://scholar.google.com/citations?user=q8BKwrYAAAAJ&hl=en';

export default function PublicationsPage() {
  const [publications, setPublications] = useState<ExtendedPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [profileUrl, setProfileUrl] = useState(DEFAULT_SCHOLAR_PROFILE);
  
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const loadPublications = async () => {
    try {
      const response = await fetch('/api/publications', {
        cache: 'no-store', // Force fresh data
      });
      const result = await response.json();

      if (result.profileUrl) {
        setProfileUrl(result.profileUrl);
      }

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
            description="Peer-reviewed papers, preprints, and conference proceedings from the lab. Updated automatically from the lab's OpenAlex record."
          />

          {loading ? (
            <div className="mt-12 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center shadow-md">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
              <p className="mt-4 text-muted">Loading publications...</p>
            </div>
          ) : error ? (
            <div className="mt-12 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center shadow-md">
              <h3 className="text-xl font-semibold text-secondary">
                Publications are temporarily unavailable
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-muted">
                The live list could not be loaded just now. The full, up-to-date publication
                list is always available on the lab&apos;s Scholar profile.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-secondary px-5 py-2.5 text-sm font-semibold font-button text-white shadow-md transition hover:bg-secondary/90 dark:text-slate-950"
                >
                  <span>View on Google Scholar</span>
                  <span aria-hidden="true">→</span>
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold font-button text-text shadow-sm transition hover:border-secondary dark:border-slate-700 dark:bg-slate-900"
                >
                  Try again
                </button>
              </div>
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
                    className="flex items-center gap-2 rounded bg-secondary/10 px-3 py-1.5 text-secondary transition hover:bg-secondary/20 disabled:opacity-50 font-button"
                    title="Reload the publication list"
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
                    <label className="mr-2 text-sm font-semibold text-secondary">Type:</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
                    >
                      {types.map((t) => (
                        <option key={t} value={t}>
                          {t === 'all' ? 'All types' : t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mr-2 text-sm font-semibold text-secondary">Topic:</label>
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
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
                      <h2 className="text-xl font-semibold text-secondary">{year}</h2>
                      <div className="mt-4 space-y-4">
                        {byYear[year].map((p, index) => {
                          const typeColors = {
                            journal: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
                            preprint: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
                            conference: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white',
                            other: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
                          };
                          
                          return (
                            <article key={`${p.title}-${index}`} className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-md transition hover:shadow-xl hover:-translate-y-0.5">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <h3 className="flex-1 text-lg font-semibold text-secondary">
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
                                      className="rounded-full bg-secondary/5 px-3 py-1 text-xs font-medium text-secondary ring-1 ring-secondary/10 transition hover:bg-secondary/10"
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
                                  Read the paper →
                                </a>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center shadow-md">
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
