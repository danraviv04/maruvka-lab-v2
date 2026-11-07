import Link from 'next/link';
import { Reveal, HoverLift } from '@/components/motion/Reveal';
import { positions } from '@/content/positions';
import { site } from '@/content/site';

export default function JoinSection() {
  return (
    <section
      id="join"
      className="relative scroll-mt-24 overflow-hidden bg-slate-950 py-20 sm:py-28"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-secondary/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
            06 / Join us
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Come work on cancer with us.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
            We look for people from statistics, computer science, physics and biology. Curiosity
            about cancer matters more than a specific background.
          </p>
        </Reveal>

        {positions.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {positions.slice(0, 4).map((position, index) => (
              <Reveal key={position.title} index={index}>
                <HoverLift
                  className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                  scale={1.02}
                >
                  <span className="inline-flex rounded-full bg-secondary/15 px-2.5 py-1 text-xs font-semibold text-secondary">
                    {position.level}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-white">{position.title}</h3>
                  <p className="mt-2 font-serif text-sm leading-relaxed text-slate-300">
                    {position.summary}
                  </p>
                </HoverLift>
              </Reveal>
            ))}
          </div>
        ) : null}

        <Reveal>
          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-white/10 pt-10">
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-secondary/90"
            >
              <span>Email the lab</span>
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </a>
            <Link
              href="/open-positions"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
            >
              See open positions
            </Link>

            <p className="ml-auto text-sm text-slate-400">
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
