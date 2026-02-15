// components/home-focus.tsx
import Link from "next/link";
import { focusAreas } from "@/content/focus";

export default function HomeFocus() {
  const top = focusAreas.slice(0, 3);

  return (
    <section className="bg-white dark:bg-slate-900 py-16 md:py-24">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Research
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text">Focus areas</h2>
          <p className="mt-3 text-muted">
            A few hard problems where careful modeling and clean data can move the needle.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {top.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className="group relative overflow-hidden rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-md transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl"
            >
              {a.tag && (
                <span className="inline-block rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {a.tag}
                </span>
              )}
              <h3 className="mt-3 text-lg font-semibold text-text">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:gap-2">
                <span>Learn more</span>
                <span className="transition group-hover:translate-x-0.5">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-medium text-text shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span>Explore all research</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}