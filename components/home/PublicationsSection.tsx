'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Reveal, HoverLift } from '@/components/motion/Reveal';
import SectionHeading from './SectionHeading';

const DEFAULT_SCHOLAR_PROFILE = 'https://scholar.google.com/citations?user=q8BKwrYAAAAJ&hl=en';
const PREVIEW_COUNT = 3;

type PreviewPublication = {
  title: string;
  authors: string;
  venue: string;
  year: number;
  link: string;
};

export default function PublicationsSection() {
  const [items, setItems] = useState<PreviewPublication[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [profileUrl, setProfileUrl] = useState(DEFAULT_SCHOLAR_PROFILE);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch('/api/publications');
        const result = await response.json();
        if (!active) return;

        if (result.profileUrl) setProfileUrl(result.profileUrl);

        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          setItems(result.data.slice(0, PREVIEW_COUNT));
          setState('ready');
        } else {
          setState('unavailable');
        }
      } catch {
        if (active) setState('unavailable');
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="publications" className="scroll-mt-24 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="03"
          kicker="Selected work"
          title="Recent publications."
          description="Pulled live from the lab's OpenAlex record, so this list never goes stale."
          deepHref="/publications"
          deepLabel="All publications"
        />

        <div className="mt-10">
          {state === 'loading' ? (
            <ul className="space-y-4" aria-hidden="true">
              {Array.from({ length: PREVIEW_COUNT }).map((_, index) => (
                <li
                  key={index}
                  className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                />
              ))}
            </ul>
          ) : state === 'unavailable' ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
              <p className="text-muted">
                The live publication list is temporarily unavailable.
              </p>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:text-slate-950"
              >
                <span>View on Google Scholar</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((publication, index) => (
                <Reveal as="li" key={`${publication.title}-${index}`} index={index}>
                  <HoverLift
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-secondary/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-secondary/50"
                    scale={1.015}
                  >
                    <div className="flex items-center gap-3 text-xs text-muted">
                      {publication.venue ? (
                        <span className="font-semibold text-secondary">{publication.venue}</span>
                      ) : null}
                      <span>{publication.year}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold leading-snug text-text">
                      {publication.link ? (
                        <a
                          href={publication.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition hover:text-secondary"
                        >
                          {publication.title}
                        </a>
                      ) : (
                        publication.title
                      )}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{publication.authors}</p>
                  </HoverLift>
                </Reveal>
              ))}
            </ul>
          )}
        </div>

        <Reveal>
          <div className="mt-8 text-center">
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 rounded-full border-2 border-secondary/40 bg-white px-5 py-2.5 text-sm font-semibold text-secondary transition hover:-translate-y-0.5 hover:border-secondary hover:bg-secondary/5 dark:border-secondary/40 dark:bg-slate-900 dark:hover:bg-secondary/10"
            >
              <span>Browse the full list</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
