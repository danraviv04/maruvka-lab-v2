import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { site } from '../../content/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Maruvka Lab at Technion. Reach out about collaborations, rotations, or open positions.',
};

export default function ContactPage() {
  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Contact"
            title="Get in touch"
            description="Email is the fastest. If you are reaching out about a collaboration, include a short description of the dataset or question."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft lg:col-span-1">
              <div className="text-sm font-semibold text-primary">Email</div>
              <a href={`mailto:${site.email}`} className="mt-2 block text-sm font-semibold text-secondary hover:underline">
                {site.email}
              </a>

              <div className="mt-6 text-sm font-semibold text-primary">Address</div>
              <p className="mt-2 text-sm text-text/70">
                {site.institution}<br />
                Faculty of Biotechnology and Food Engineering<br />
                Haifa, 3200003<br />
                Israel
              </p>

              <div className="mt-6 text-sm font-semibold text-primary">For applicants</div>
              <p className="mt-2 font-serif text-sm text-text/80">
                Include a CV and one paragraph about what you want to work on.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft lg:col-span-2">
              <div className="text-sm font-semibold text-primary">Getting to campus</div>
              <div className="mt-4 space-y-4 text-sm text-text/70">
                <div>
                  <span className="font-semibold text-primary">By public transport:</span> Multiple bus lines connect to Technion from Haifa city center. 
                  The campus has several entrances; the Faculty of Biotechnology is in the central campus area.
                </div>
                <div>
                  <span className="font-semibold text-primary">By car:</span> Visitor parking is available near the main gate. 
                  Follow signs to the Faculty of Biotechnology and Food Engineering.
                </div>
                <div>
                  <span className="font-semibold text-primary">Campus map:</span> Visit{' '}
                  <a href="https://www.technion.ac.il/en/about/campus-map/" target="_blank" rel="noopener noreferrer" className="font-semibold text-secondary hover:underline">
                    technion.ac.il/en/about/campus-map
                  </a>{' '}
                  for an interactive map and detailed directions.
                </div>
              </div>

              <div className="mt-6 text-sm font-semibold text-primary">Message template</div>
              <div className="mt-3 rounded-xl bg-background p-4 font-serif text-sm leading-relaxed text-text/80">
                <div className="font-semibold text-primary">Subject:</div>
                <div className="mt-1">Collaboration / rotation / position inquiry</div>
                <div className="mt-4 font-semibold text-primary">Body:</div>
                <div className="mt-1">
                  Who you are, what you want to do, why the lab is relevant, and links to anything concrete 
                  (paper, code, dataset).
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
