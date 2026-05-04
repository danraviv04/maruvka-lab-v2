"use client";

// components/home-featured.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { fetchPublications, type Publication } from "@/lib/publications";

function selectLatestPublication(publications: Publication[]) {
  return publications
    .map((publication, index) => ({ publication, index }))
    .sort((a, b) => {
      if (b.publication.year !== a.publication.year) {
        return b.publication.year - a.publication.year;
      }
      return a.index - b.index;
    })[0]?.publication ?? null;
}

export default function HomeFeatured() {
  const f = site.home.featured;
  const [latest, setLatest] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadLatestArticle() {
      const result = await fetchPublications();
      if (cancelled) return;

      if (result.success && result.data?.length) {
        setLatest(selectLatestPublication(result.data));
      }
      setLoading(false);
    }

    loadLatestArticle();

    return () => {
      cancelled = true;
    };
  }, []);

  const articleHref = latest?.link && latest.link !== "#" ? latest.link : "/publications";
  const title = latest?.title ?? (loading ? "Loading latest article..." : "Latest article unavailable");
  const venue = latest?.venue;

  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-slate-100 py-20 text-text dark:border-slate-800 dark:bg-slate-950 dark:text-white md:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(120deg,rgba(32,199,138,0.16)_0%,transparent_34%,rgba(27,138,191,0.12)_62%,rgba(249,115,22,0.10)_100%)] dark:bg-[linear-gradient(120deg,rgba(32,199,138,0.10)_0%,transparent_34%,rgba(27,138,191,0.10)_62%,rgba(249,115,22,0.08)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-secondary/60 via-primary/70 to-accent/60"
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="rounded-lg border border-slate-300 bg-white p-7 shadow-2xl shadow-slate-900/10 backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.045] dark:shadow-slate-950/30 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase text-accent">
              Latest Article
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-muted dark:text-white/70">
              {venue ? (
                <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 dark:border-white/15 dark:bg-white/5">
                  {venue}
                </span>
              ) : null}
            </div>
          </div>

          <h2 className="mt-7 max-w-4xl text-3xl font-semibold tracking-tight text-text dark:text-white sm:text-4xl">
            {title}
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={articleHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 hover:bg-accent/90"
            >
              <span>{f.primaryLabel}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
            <Link
              href={f.secondaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-text shadow-md shadow-slate-900/5 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10"
            >
              <span>{f.secondaryLabel}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
