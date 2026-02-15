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
            description="Interested in joining the lab? Check out our Careers section. For collaborations, email us with a brief description of your dataset or question."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition hover:shadow-lg lg:col-span-1">
              <div className="text-sm font-semibold text-primary">Email</div>
              <a href={`mailto:${site.email}`} className="mt-2 block text-sm font-semibold text-secondary hover:underline">
                {site.email}
              </a>

              <div className="mt-6 text-sm font-semibold text-primary">Shipping Address</div>
              <p className="mt-2 text-sm text-text/70">
                {site.institution}<br />
                Emerson Building for Life Sciences<br />
                Haifa, 3200003<br />
                Israel
              </p>

              <div className="mt-6 text-sm font-semibold text-primary">Office Address</div>
              <p className="mt-2 text-sm text-text/70">
                {site.institution}<br />
                Emerson Building for Life Sciences<br />
                Floor 3, Room 301<br />
              </p>

              <div className="mt-6 text-sm font-semibold text-primary">Lab Phone Number</div>
              <p className="mt-2 text-sm text-text/70">{site.phone}</p>

              {/* 
              <div className="mt-6 text-sm font-semibold text-primary">For applicants</div>
              <p className="mt-2 font-serif text-sm text-text/80">
                Include a CV and one paragraph about what you want to work on.
              </p> */}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition hover:shadow-lg lg:col-span-2">
              <div className="text-sm font-semibold text-primary">Campus Map</div>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.575720066947!2d35.024608176475!3d32.77699077366375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151dbbddfd1db377%3A0xad3fc3c09059a8b8!2sEmerson%20Building%20for%20Life%20Sciences!5e0!3m2!1sen!2sil!4v1771088383984!5m2!1sen!2sil"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Technion Campus Map"
                ></iframe>
              </div>
              
              {/* <div className="mt-6 text-sm font-semibold text-primary">Getting to campus</div>
              <div className="mt-4 space-y-4 text-sm text-muted">
                <div>
                  <span className="font-semibold text-primary">By public transport:</span> Multiple bus lines connect to Technion from Haifa city center. 
                  The campus has several entrances; the Faculty of Biotechnology is in the central campus area.
                </div>
                <div>
                  <span className="font-semibold text-primary">By car:</span> Visitor parking is available near the main gate. 
                  Follow signs to the Faculty of Biotechnology and Food Engineering.
                </div> */}
                {/* <div>
                  <span className="font-semibold text-primary">Detailed directions:</span> Visit{' '}
                  <a href="https://www.technion.ac.il/en/about/campus-map/" target="_blank" rel="noopener noreferrer" className="font-semibold text-secondary hover:underline">
                    technion.ac.il/en/about/campus-map
                  </a>{' '}
                  for an interactive map and building-specific directions.
                </div> */}
              {/* </div> */}

              {/* <div className="mt-6 text-sm font-semibold text-primary">Message template</div>
              <div className="mt-3 rounded-xl bg-background p-4 font-serif text-sm leading-relaxed text-muted">
                <div className="font-semibold text-primary">Subject:</div>
                <div className="mt-1">Collaboration / rotation / position inquiry</div>
                <div className="mt-4 font-semibold text-primary">Body:</div>
                <div className="mt-1">
                  Who you are, what you want to do, why the lab is relevant, and links to anything concrete 
                  (paper, code, dataset).
                </div>
              </div> */}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
