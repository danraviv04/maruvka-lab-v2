export const site = {
  name: 'Maruvka Lab',
  institution: 'Technion - Israel Institute of Technology',
  tagline: 'Deciphering cancer evolution through computation',
  description:
    'We develop mathematical and statistical methods to understand tumor evolution, improve early detection, and design better interventions.',
  location: 'Technion, Haifa, Israel',
  email: 'maruvka.lab@technion.ac.il',
  phone: '077-8871902',
  socials: {
    github: 'https://github.com/maruvka-lab',
    googleScholar: '',
    twitter: '',
    linkedin: '',
  },
  nav: [
    { name: 'Research', href: '/research' },
    { name: 'Publications', href: '/publications' },
    { name: 'Software', href: '/tools' },
    { name: 'Team', href: '/team' },
    { name: 'News', href: '/news' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Collaborators', href: '/collaborators' },
    { name: 'In Memoriam', href: '/mission' },
    { name: 'Contact', href: '/contact' },
    { name: 'Members', href: '/members' },
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
      title: 'Latest: Statistical frameworks for ctDNA detection',
      body:
        'New methods for ultra-low allele fraction detection in cell-free DNA, published in Nature Methods. We develop probabilistic models that maintain calibrated false-positive rates even when signals are at or below sequencing error thresholds.',
      primaryLabel: 'Read the paper',
      primaryHref: '/publications',
      secondaryLabel: 'View code',
      secondaryHref: '/tools',
      sideTitle: 'Key innovations',
      bullets: [
        'Error-aware statistical inference for sparse observations',
        'Bayesian framework with honest uncertainty quantification',
        'Benchmarking across multiple ctDNA assay platforms',
        'Open-source implementation with reproducible pipelines',
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