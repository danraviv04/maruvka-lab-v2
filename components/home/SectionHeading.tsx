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
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {index} / {kicker}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
          ) : null}
        </div>

        {deepHref ? (
          <Link
            href={deepHref}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            <span>{deepLabel ?? 'See all'}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </Reveal>
  );
}
