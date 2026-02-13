import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Lab photos, figures, and visuals.',
};

export default function GalleryPage() {
  const placeholders = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Visuals"
            title="Gallery"
            description="Swap placeholders with real lab images (public/...) and captions. Keep it minimal and curated."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {placeholders.map((i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl border border-black/5 bg-white shadow-soft"
              >
                <div className="grid h-full place-items-center text-sm text-text/60">Image {i + 1}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
