// components/home-featured.tsx
import Link from "next/link";
import { site } from "@/content/site";

export default function HomeFeatured() {
  const f = site.home.featured;

  return (
    <section className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left column: Content */}
          <div>
            <span className="inline-block rounded-full border-2 border-accent/30 dark:border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
              Featured Publication
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text dark:text-white">{f.title}</h2>
            <p className="mt-3 leading-relaxed text-muted dark:text-slate-300">{f.body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={f.primaryHref}
                className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-accent/90"
              >
                {f.primaryLabel}
              </Link>
              <Link
                href={f.secondaryHref}
                className="inline-flex items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary dark:border-white/20 dark:bg-white/5 dark:text-white dark:backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-primary/20 dark:hover:bg-white/10"
              >
                {f.secondaryLabel}
              </Link>
            </div>
          </div>

          {/* Right column: Key innovations */}
          <div className="rounded-2xl border-2 border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-md dark:backdrop-blur-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-text dark:text-white/70">{f.sideTitle}</h3>
            <ul className="mt-4 space-y-3">
              {f.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-muted dark:text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs text-secondary">
                    ✓
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}