import Link from 'next/link';
import { Reveal, HoverLift } from '@/components/motion/Reveal';
import SectionHeading from './SectionHeading';
import { focusAreas } from '@/content/focus';

export default function ResearchSection() {
  return (
    <section
      id="research"
      className="scroll-mt-24 border-y border-emerald-200/70 bg-emerald-100/60 py-20 sm:py-28 dark:border-emerald-900/40 dark:bg-emerald-950/40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="02"
          kicker="Research"
          title="Research at the intersection."
          description="We build statistical and computational methods for tumor evolution, early detection, and prevention."
          deepHref="/research"
          deepLabel="All research areas"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {focusAreas.map((area, index) => (
            <Reveal key={area.href} index={index}>
              <HoverLift
                as="article"
                className="group flex h-full flex-col rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition-colors hover:border-secondary/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-secondary/50"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {String(index + 1).padStart(2, '0')}
                </p>

                {area.tag ? (
                  <span className="mt-3 inline-flex w-fit rounded-full bg-secondary/12 px-2.5 py-1 text-xs font-semibold text-secondary">
                    {area.tag}
                  </span>
                ) : null}

                <h3 className="mt-3 text-lg font-semibold text-text">{area.title}</h3>
                <p className="mt-2 flex-1 font-serif text-sm leading-relaxed text-muted">
                  {area.description}
                </p>

                <Link
                  href={area.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-all group-hover:gap-3"
                >
                  <span>Explore this research</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </HoverLift>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
