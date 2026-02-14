import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';

export const metadata: Metadata = {
  title: 'Mission',
  description: 'Our approach to computational cancer genomics: reproducible methods, rigorous inference, and collaborative science.',
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

      {/* In Memoriam Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <span className="text-3xl">🕯️</span>
                <h2 className="text-2xl font-semibold text-primary">In Memoriam</h2>
              </div>
              <div className="mt-6 space-y-4 font-serif text-base leading-relaxed text-text/80">
                <p>
                  This section is dedicated to remembering those who have been part of our lab community 
                  and contributed to our mission.
                </p>
                <p className="italic text-text/60">
                  [Add specific memorial content here]
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
