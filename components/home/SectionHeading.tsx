import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';

type SectionHeadingProps = {
  /** Two-digit order marker, as on the CCG site: "01 / RESEARCH". */
  index: string;
  kicker: string;
  title: string;
  description?: string;
  deepHref?: string;
  deepLabel?: string;
};

export default function SectionHeading({
  index,
  kicker,
  title,
  description,
  deepHref,
  deepLabel,
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-secondary/25 pb-6 dark:border-secondary/30">
        <div className="max-w-2xl">
          {/* The green rule and index are the page's running accent: they are
              the one mark every section shares. */}
          <span className="mb-4 block h-1 w-10 rounded-full bg-secondary" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            <span className="text-secondary">{index}</span> / {kicker}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
          ) : null}
        </div>

        {deepHref ? (
          <Link
            href={deepHref}
            className="group inline-flex items-center gap-2 rounded border border-secondary/30 bg-white px-4 py-2 text-sm font-semibold font-button text-secondary transition hover:gap-3 hover:border-secondary hover:bg-secondary/5 dark:border-secondary/40 dark:bg-secondary/15 dark:hover:bg-secondary/25"
          >
            <span>{deepLabel ?? 'See all'}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </Reveal>
  );
}
