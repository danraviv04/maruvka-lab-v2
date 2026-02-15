import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { principalInvestigator, team, alumni } from '../../content/team';

export const metadata: Metadata = {
  title: 'Team',
  description: 'Meet the researchers, students, and engineers at the Maruvka Lab working on computational cancer genomics.',
};

export default function TeamPage() {
  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="People"
            title="Team"
            description="A small group with a bias toward rigorous methods, reproducible code, and honest uncertainty."/>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition hover:shadow-lg">
              {principalInvestigator.image && (
                <div className="mb-4 flex justify-center">
                  <div className="w-full aspect-square relative max-w-sm">
                    <Image
                      src={principalInvestigator.image}
                      alt={principalInvestigator.name}
                      fill
                      className="rounded-xl object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="text-xs font-semibold text-primary/70">Principal Investigator</div>
              <h3 className="mt-2 text-xl font-semibold text-primary">{principalInvestigator.name}</h3>
              <div className="mt-1 text-sm text-muted">{principalInvestigator.role}</div>
              {principalInvestigator.bio ? (
                <p className="mt-4 font-serif text-sm leading-relaxed text-muted">{principalInvestigator.bio}</p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                {(principalInvestigator.links ?? []).map((l) => (
                  <a key={l.label} href={l.href} className="text-sm font-semibold text-secondary hover:underline">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
              {team.map((m) => (
                <div key={m.name} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition hover:shadow-lg">
                  {m.image && (
                    <div className="mb-4 flex justify-center">
                      <div className="w-48 h-48 relative">
                        <Image
                          src={m.image}
                          alt={m.name}
                          fill
                          className="rounded-xl object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-primary">{m.name}</h3>
                  <div className="mt-1 text-sm text-muted">{m.role}</div>
                  {m.bio ? <p className="mt-3 font-serif text-sm text-muted">{m.bio}</p> : null}
                  {m.links?.length ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {m.links.map((l) => (
                        <a key={l.label} href={l.href} className="text-sm font-semibold text-secondary hover:underline">
                          {l.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Alumni Section */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-800/50">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Alumni
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text">Lab Alumni</h2>
            <p className="mt-3 text-muted">
              Former members who have contributed to our research and moved on to exciting opportunities.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {alumni.map((m) => (
              <div key={m.name} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition hover:shadow-lg">
                {m.image && (
                  <div className="mb-4 flex justify-center">
                    <div className="w-32 h-32 relative">
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-primary">{m.name}</h3>
                <div className="mt-1 text-sm text-muted">{m.role}</div>
                {m.bio ? <p className="mt-3 font-serif text-sm text-muted">{m.bio}</p> : null}
                {m.links?.length ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {m.links.map((l) => (
                      <a key={l.label} href={l.href} className="text-sm font-semibold text-secondary hover:underline">
                        {l.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
