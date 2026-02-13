import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { site } from '../../content/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'How to reach the Maruvka Lab.',
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

              <div className="mt-6 text-sm font-semibold text-primary">Location</div>
              <p className="mt-2 text-sm text-text/70">{site.institution}<br />{site.location}</p>

              <div className="mt-6 text-sm font-semibold text-primary">For applicants</div>
              <p className="mt-2 font-serif text-sm text-text/80">
                Include a CV and one paragraph about what you want to work on.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft lg:col-span-2">
              <div className="text-sm font-semibold text-primary">Message template</div>
              <p className="mt-3 font-serif text-sm leading-relaxed text-text/80">
                Subject: Collaboration / rotation / position inquiry
                <br />
                Body: Who you are, what you want to do, why the lab is relevant, and links to anything concrete (paper, code, dataset).
              </p>
              <div className="mt-6 rounded-2xl bg-black/5 p-6">
                <p className="text-sm text-text/70">
                  Map embed placeholder - add an iframe or a static map image when you have the exact building address.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
