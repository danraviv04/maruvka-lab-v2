import type { Metadata } from 'next';
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
  {
    name: 'Jacob Mueller, PhD',
    logo: '👨‍🔬',
    url: 'https://mueller.lab.medicine.umich.edu/home',
    institution: 'University of Michigan',
    description: 'Collaborative research in cancer evolution and genomics.',
  },
  {
    name: 'Zsofia K. Stadler, MD',
    logo: '👩‍⚕️',
    url: 'https://www.mskcc.org/cancer-care/doctors/zsofia-stadler',
    institution: 'Memorial Sloan Kettering Cancer Center',
    description: 'Collaborative research in cancer genetics and prevention.',
  },
];

const grants = [
  {
    name: 'Israel Science Foundation (ISF)',
    logo: '🔬',
    url: 'https://www.isf.org.il/',
    description: 'Supporting fundamental and applied research in Israel.',
  },
  {
    name: 'Israel Cancer Association (ICA)',
    logo: '🎗️',
    url: 'https://en.cancer.org.il/',
    description: 'Supporting cancer research and prevention initiatives.',
  },
  {
    name: 'Stephen and Sharon Seiden',
    logo: '🏆',
    description: 'The Stephen and Sharon Seiden Frontiers in Science and Engineering Forum.',
  },
  {
    name: 'D. Dan and Betty Kahn Michigan-Israel Partnership',
    logo: '🤝',
    url: 'https://um-israel.org/',
    description: 'Fostering research collaboration between Michigan and Israel.',
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
                className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-3xl transition-transform duration-300 group-hover:scale-110">
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
                            className="text-xl font-semibold text-primary hover:underline"
                          >
                            {collab.name}
                          </a>
                        ) : (
                          <h3 className="text-xl font-semibold text-primary">{collab.name}</h3>
                        )}
                        {collab.institution && (
                          <p className="mt-1 text-sm text-muted/80">{collab.institution}</p>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 font-serif text-base leading-relaxed text-muted">
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
                className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-2xl transition-transform duration-300 group-hover:scale-110">
                  {grant.logo}
                </div>
                <div className="mt-4">
                  {grant.url ? (
                    <a
                      href={grant.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-semibold text-primary hover:underline"
                    >
                      {grant.name}
                    </a>
                  ) : (
                    <h3 className="text-base font-semibold text-primary">{grant.name}</h3>
                  )}
                  <p className="mt-2 font-serif text-sm leading-relaxed text-muted">
                    {grant.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
