import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';

export const metadata: Metadata = {
  title: 'Mission',
  description: 'What we optimize for and how we work.',
};

export default function MissionPage() {
  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="About"
            title="Mission"
            description="A short, opinionated statement about what we do and how we do it. Replace the text with your real lab language."
          />

          <div className="mx-auto mt-12 max-w-3xl space-y-8">
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-primary">Our goal</h3>
              <p className="mt-3 font-serif text-sm leading-relaxed text-text/80">
                Build methods that survive contact with real data. We prefer models that are interpretable, testable, and
                honest about uncertainty.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-primary">Principles</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-text/80">
                <li>Reproducibility first: code, data, and exact versions.</li>
                <li>Inference over vibes: uncertainty quantification is a feature, not an afterthought.</li>
                <li>Simple baselines, then complexity, then ruthless validation.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-primary">Collaborations</h3>
              <p className="mt-3 font-serif text-sm leading-relaxed text-text/80">
                We collaborate with clinicians, wet labs, and computational groups. If you have a dataset, a clinical
                question, or a method that needs stress testing, reach out.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
