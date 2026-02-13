export type Tool = {
  name: string;
  description: string;
  href: string;
  tags?: string[];
};

export const tools: Tool[] = [
  {
    name: 'MSI / signatures toolkit (placeholder)',
    description: 'Reproducible pipelines for microsatellite instability, signatures, and cohort QC.',
    href: 'https://github.com/maruvka-lab',
    tags: ['Python', 'Nextflow'],
  },
  {
    name: 'Liquid biopsy simulator (placeholder)',
    description: 'Simulation + inference for ctDNA detection thresholds and assay design.',
    href: 'https://github.com/maruvka-lab',
    tags: ['R', 'statistics'],
  },
];
