import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';

export const metadata: Metadata = {
  title: 'In Memoriam',
  description: 'Remembering those who have been part of our lab community.',
};

export default function MissionPage() {
  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Remembering"
            title="In Memoriam"
            description="Honoring those who have been part of our lab community and contributed to our mission."
          />

          <div className="mx-auto mt-12 max-w-3xl">
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-gradient-to-br from-white dark:from-slate-800 to-slate-50 dark:to-slate-800/50 p-8 shadow-xl">
              <div className="flex items-center gap-3 border-b-2 border-slate-300 dark:border-slate-700 pb-4">
                <span className="text-3xl">🕯️</span>
                <h2 className="text-2xl font-semibold text-primary">In Memory</h2>
              </div>
              <div className="mt-6 space-y-4 font-serif text-base leading-relaxed text-muted">
                <p>
                  This section is dedicated to remembering those who have been part of our lab community 
                  and contributed to our mission.
                </p>
                <p className="italic text-muted/80">
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
