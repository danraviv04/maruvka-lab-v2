import Link from 'next/link';
import { Reveal, HoverLift } from '@/components/motion/Reveal';
import { positions } from '@/content/positions';
import { site } from '@/content/site';

export default function JoinSection() {
  return (
    <section
      id="join"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50/70 py-20 sm:py-28 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-secondary/10 blur-3xl dark:bg-secondary/15"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary dark:text-secondary">
            06 / Join us
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Come work on cancer with us.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            We look for people from statistics, computer science, physics and biology. Curiosity
            about cancer matters more than a specific background.
          </p>
        </Reveal>

        {positions.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {positions.slice(0, 4).map((position, index) => (
              <Reveal key={position.title} index={index}>
                <HoverLift
                  className="h-full rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                  scale={1.02}
                >
                  <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary dark:bg-secondary/15 dark:text-secondary">
                    {position.level}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{position.title}</h3>
                  <p className="mt-2 font-serif text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {position.summary}
                  </p>
                </HoverLift>
              </Reveal>
            ))}
          </div>
        ) : null}

        <Reveal>
          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-10 dark:border-white/10">
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-primary/90 dark:bg-secondary dark:text-slate-950 dark:hover:bg-secondary/90"
            >
              <span>Email the lab</span>
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </a>
            <Link
              href="/open-positions"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-primary hover:bg-white/60 hover:text-primary dark:border-white/30 dark:text-white dark:hover:border-white/60 dark:hover:bg-white/10 dark:hover:text-white"
            >
              See open positions
            </Link>

            <p className="ml-auto text-sm text-slate-500 dark:text-slate-400">
              {site.email}
              <br />
              {site.location}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
