import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';

export const metadata: Metadata = {
  title: 'Collaborators & Grants',
  description: 'Research partnerships and funding supporting computational cancer genomics at the Maruvka Lab.',
};

const collaborators = [
  {
    name: 'Foresee Genomics',
    logo: '🧬',
    url: 'https://www.foreseegenomics.com/',
    description:
      'Our lab collaborates with Foresee Genomics in developing inexpensive and easy-to-use sequencing protocols based on Nanopore sequencing technology. They develop a combined system of molecular biology and bioinformatics to increase the accuracy of nanopore-based 4th generation DNA sequencing technology.',
  },
  {
    name: 'Steven M. Lipkin, MD, PhD',
    logo: '👨‍⚕️',
    url: 'https://robertsinstitute.weill.cornell.edu/team/steven-m-lipkin-md-phd',
    institution: 'Weill Cornell Medicine',
    description: 'Collaborative research in cancer genomics and prevention.',
  },
  {
    name: 'Uri Tabori, MD',
    logo: '👨‍⚕️',
    url: 'https://lab.research.sickkids.ca/tabori/',
    institution: 'The Hospital for Sick Children',
    description: 'Collaborative research in pediatric cancer.',
  },
  {
    name: 'Shai Izraeli, MD',
    logo: '👨‍⚕️',
    url: 'https://en-med.tau.ac.il/profile/sizraeli',
    institution: 'Tel Aviv University',
    description: 'Collaborative research in leukemia and cancer genomics.',
  },
];

type Grant = {
  name: string;
  /** Path under public/grants. Any aspect ratio: the plate letterboxes it. */
  logo: string;
  url?: string;
  description?: string;
};

const grants: Grant[] = [
  {
    name: 'Israel Science Foundation (ISF)',
    logo: '/grants/isf.webp',
    url: 'https://www.isf.org.il/',
    description: 'Supporting fundamental and applied research in Israel.',
  },
  {
    name: 'Israel Cancer Association (ICA)',
    logo: '/grants/israel-cancer-association.png',
    url: 'https://en.cancer.org.il/',
    description: 'Supporting cancer research and prevention initiatives.',
  },
  {
    name: 'Stephen and Sharon Seiden',
    logo: '/grants/seiden.jpg',
    description: 'The Stephen and Sharon Seiden Frontiers in Science and Engineering Forum.',
  },
  {
    name: 'D. Dan and Betty Kahn Michigan-Israel Partnership',
    logo: '/grants/kahn-michigan-israel.jpg',
    url: 'https://um-israel.org/',
    description: 'Fostering research collaboration between Michigan and Israel.',
  },
  {
    name: 'The Starr Foundation',
    logo: '/grants/starr-foundation.jpg',
    url: 'https://starrfoundation.org/',
    description: 'Description (placeholder).',
  },
  {
    name: 'NCI Community Oncology Research Program',
    logo: '/grants/nci-ncorp.png',
    url: 'https://ncorp.cancer.gov/',
    description:
      'A program of the National Cancer Institute of the National Institutes of Health.',
  },
  {
    // The logo gives only the acronym, so the full name and link are left for
    // the lab to fill in rather than guessed at.
    name: 'IPMP',
    logo: '/grants/ipmp.webp',
    description: 'Description (placeholder).',
  },
];

export default function CollaboratorsPage() {
  return (
    <div className="bg-background">
      {/* Collaborators Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Partnerships"
            title="Collaborators"
            description="We work with leading researchers and organizations to advance cancer research and genomics."
          />

          <div className="mt-12 space-y-6">
            {collaborators.map((collab) => (
              <div
                key={collab.name}
                className="group rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-3xl transition-transform duration-300 group-hover:scale-110">
                    {collab.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        {collab.url ? (
                          <a
                            href={collab.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl font-semibold text-secondary hover:underline"
                          >
                            {collab.name}
                          </a>
                        ) : (
                          <h3 className="text-xl font-semibold text-secondary">{collab.name}</h3>
                        )}
                        {collab.institution && (
                          <p className="mt-1 text-sm text-muted/80">{collab.institution}</p>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-base leading-relaxed text-muted">
                      {collab.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Grants Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Funding"
            title="Grants & Support"
            description="Our research is made possible by generous funding from these organizations."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {grants.map((grant) => (
              <div
                key={grant.name}
                className="group rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* White in both themes: several of these marks are dark ink on
                    transparency and would vanish against the dark card. */}
                <div className="relative h-28 w-full overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-105 dark:ring-slate-600">
                  <Image
                    src={grant.logo}
                    alt=""
                    fill
                    // The plate is ~290px at its widest. Stating that lets the
                    // browser pick the 2x candidate on a retina screen; next/image
                    // never upscales past the source, so a small logo file stays
                    // the limit rather than this hint.
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                    className="object-contain p-3"
                  />
                </div>
                <div className="mt-4">
                  {grant.url ? (
                    <a
                      href={grant.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-semibold text-secondary hover:underline"
                    >
                      {grant.name}
                    </a>
                  ) : (
                    <h3 className="text-base font-semibold text-secondary">{grant.name}</h3>
                  )}
                  {grant.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {grant.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
