import { Reveal, HoverLift } from '@/components/motion/Reveal';
import Avatar from './Avatar';
import SectionHeading from './SectionHeading';
import { principalInvestigator, team } from '@/content/team';

export default function TeamSection() {
  const preview = team.slice(0, 5);

  return (
    <section id="team" className="scroll-mt-24 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="04"
          kicker="People"
          title="The team."
          deepHref="/team"
          deepLabel="Full team & alumni"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <HoverLift
              className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-secondary/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-secondary/50"
              scale={1.02}
            >
              <div className="flex items-center gap-4">
                <Avatar name={principalInvestigator.name} image={principalInvestigator.image} size={64} />
                <div>
                  <h3 className="text-lg font-semibold text-text">{principalInvestigator.name}</h3>
                  <p className="text-sm text-secondary">{principalInvestigator.role}</p>
                </div>
              </div>
              {principalInvestigator.bio ? (
                <p className="mt-4 font-serif text-sm leading-relaxed text-muted">
                  {principalInvestigator.bio}
                </p>
              ) : null}
            </HoverLift>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {preview.map((member, index) => (
              <Reveal key={member.name} index={index}>
                <HoverLift className="flex h-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-secondary/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-secondary/50">
                  <Avatar name={member.name} image={member.image} size={48} />
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-text">{member.name}</h4>
                    <p className="truncate text-xs text-muted">{member.role}</p>
                  </div>
                </HoverLift>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

