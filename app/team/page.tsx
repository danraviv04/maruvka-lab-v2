import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { principalInvestigator, team } from '../../content/team';

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
            <div className="lg:col-span-1 rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
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
              <div className="mt-1 text-sm text-text/70">{principalInvestigator.role}</div>
              {principalInvestigator.bio ? (
                <p className="mt-4 font-serif text-sm leading-relaxed text-text/80">{principalInvestigator.bio}</p>
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
                <div key={m.name} className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
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
                  <div className="mt-1 text-sm text-text/70">{m.role}</div>
                  {m.bio ? <p className="mt-3 font-serif text-sm text-text/80">{m.bio}</p> : null}
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
    </div>
  );
}
