export type FocusArea = {
  title: string;
  description: string;
  href: string;
  tag?: string;
};

export const focusAreas: FocusArea[] = [
  {
    title: 'Liquid biopsy (cfDNA)',
    description:
      'Early detection and relapse monitoring from blood-based tumor DNA signals, with robust statistical inference under low signal-to-noise.',
    href: '/research/liquid-biopsy',
    tag: 'Detection',
  },
  {
    title: 'Cancer evolution and signatures',
    description:
      'Modeling clonal dynamics, mutational processes, and therapy-driven selection to connect genotype, history, and phenotype.',
    href: '/research/evolution-signatures',
    tag: 'Evolution',
  },
  {
    title: 'Immunology and prevention',
    description:
      'Quantitative approaches to immune surveillance, MSI biology, and rational design of prevention strategies.',
    href: '/research/immunology-prevention',
    tag: 'Immunity',
  },
];
