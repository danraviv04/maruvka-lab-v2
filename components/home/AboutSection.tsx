import { Reveal, HoverLift } from '@/components/motion/Reveal';
import SectionHeading from './SectionHeading';
import { site } from '@/content/site';

export default function AboutSection() {
  const proofItems = site.home?.proofItems ?? [];

  return (
    <section id="about" className="scroll-mt-24 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="01"
          kicker="About"
          title="Cancer leaves a record. We learn to read it."
          description={site.description}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {proofItems.map((item, index) => (
            <Reveal key={item.title} index={index}>
              <HoverLift
                className="h-full rounded-2xl border border-slate-200 border-t-4 border-t-secondary bg-white p-6 shadow-sm dark:border-slate-800 dark:border-t-secondary dark:bg-slate-900"
                scale={1.025}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
                  {item.kicker}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </HoverLift>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
