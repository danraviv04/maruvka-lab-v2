export const site = {
  name: 'Maruvka Lab',
  institution: 'Technion - Israel Institute of Technology',
  tagline: 'Deciphering cancer evolution through computation',
  description:
    'We develop mathematical and statistical methods to understand tumor evolution, improve early detection, and design better interventions.',
  location: 'Technion, Haifa, Israel',
  email: 'maruvka.lab@technion.ac.il',
  socials: {
    github: 'https://github.com/maruvka-lab',
    googleScholar: '',
    twitter: '',
  },
  nav: [
    { name: 'Research', href: '/research' },
    { name: 'Publications', href: '/publications' },
    { name: 'Software', href: '/tools' },
    { name: 'Team', href: '/team' },
    { name: 'Mission', href: '/mission' },
    { name: 'Contact', href: '/contact' },
  ],
  affiliations: ['Technion', 'ISF', 'NIH'],

  // NEW: homepage-only content (teasers, not full page copies)
  home: {
    proofItems: [
      {
        kicker: 'Methods',
        title: 'Probabilistic modeling',
        body: 'Statistical inference for tumor evolution under uncertainty.',
      },
      {
        kicker: 'Data',
        title: 'Multi-modal cancer genomics',
        body: 'Longitudinal sampling, sequencing, and clinical covariates.',
      },
      {
        kicker: 'Reproducibility',
        title: 'Open pipelines',
        body: 'Code-first research with careful benchmarking and documentation.',
      },
    ],

    featured: {
      title: 'Featured',
      body:
        'Highlight one item here (a preprint, a dataset, or a tool) instead of duplicating the Publications page.',
      primaryLabel: 'Browse publications',
      primaryHref: '/publications',
      secondaryLabel: 'See software',
      secondaryHref: '/tools',
      sideTitle: 'What we build',
      bullets: [
        'Models for clonal dynamics and selection',
        'Mutational signatures and therapy-induced processes',
        'ctDNA detection under sparse observations',
      ],
    },

    cta: {
      title: 'Interested in joining or collaborating?',
      body:
        'We welcome motivated students and research collaborations in computational cancer genomics.',
      primaryLabel: 'Join the lab',
      primaryHref: '/open-positions',
      secondaryLabel: 'Contact',
      secondaryHref: '/contact',
    },
  },
} as const;