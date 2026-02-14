export type Publication = {
  year: number;
  title: string;
  authors: string;
  venue?: string;
  links?: { label: string; href: string }[];
  tags?: string[];
  type?: 'journal' | 'preprint' | 'conference';
};

// Add your actual publications here. This is an expanded template with realistic structure.
export const publications: Publication[] = [
  {
    year: 2025,
    title: 'Statistical frameworks for ultra-low allele fraction detection in cell-free DNA',
    authors: 'Maruvka Y.E., Smith A., Johnson B., et al.',
    venue: 'Nature Methods',
    type: 'journal',
    links: [
      { label: 'DOI', href: '#' },
      { label: 'PDF', href: '#' },
    ],
    tags: ['cfDNA', 'inference', 'detection'],
  },
  {
    year: 2025,
    title: 'Longitudinal monitoring of minimal residual disease through Bayesian time-series models',
    authors: 'Chen L., Maruvka Y.E., Davis R.',
    venue: 'bioRxiv (preprint)',
    type: 'preprint',
    links: [
      { label: 'bioRxiv', href: '#' },
      { label: 'Code', href: '#' }
    ],
    tags: ['cfDNA', 'inference', 'MRD'],
  },
  {
    year: 2024,
    title: 'Therapy-induced mutational processes reshape clonal architecture in colorectal cancer',
    authors: 'Maruvka Y.E., Williams P., Garcia M., et al.',
    venue: 'Cancer Cell',
    type: 'journal',
    links: [
      { label: 'DOI', href: '#' },
      { label: 'Data', href: '#' }
    ],
    tags: ['signatures', 'evolution', 'therapy'],
  },
  {
    year: 2024,
    title: 'Quantifying uncertainty in mutational signature deconvolution',
    authors: 'Anderson K., Maruvka Y.E., Lee S.',
    venue: 'Genome Biology',
    type: 'journal',
    links: [{ label: 'DOI', href: '#' }],
    tags: ['signatures', 'inference'],
  },
  {
    year: 2024,
    title: 'MSI detection and neoantigen prediction for immunotherapy stratification',
    authors: 'Brown T., Maruvka Y.E., Wilson J.',
    venue: 'Clinical Cancer Research',
    type: 'journal',
    links: [
      { label: 'DOI', href: '#' },
      { label: 'Supplement', href: '#' }
    ],
    tags: ['MSI', 'immunology', 'immunotherapy'],
  },
  {
    year: 2023,
    title: 'Cohort-level quality control for large-scale cancer genomics studies',
    authors: 'Maruvka Y.E., Martinez R., Thompson H.',
    venue: 'Bioinformatics',
    type: 'journal',
    links: [{ label: 'DOI', href: '#' }],
    tags: ['QC', 'methods'],
  },
  {
    year: 2023,
    title: 'Evolutionary predictors of therapy resistance in metastatic cancers',
    authors: 'Zhang W., Maruvka Y.E., Patel N.',
    venue: 'Nature Genetics',
    type: 'journal',
    links: [
      { label: 'DOI', href: '#' },
      { label: 'Code', href: '#' }
    ],
    tags: ['evolution', 'resistance', 'therapy'],
  },
  {
    year: 2023,
    title: 'Integrative models for immune surveillance and prevention in Lynch syndrome',
    authors: 'Maruvka Y.E., Cohen D., Miller S.',
    venue: 'JAMA Oncology',
    type: 'journal',
    links: [{ label: 'DOI', href: '#' }],
    tags: ['immunology', 'MSI', 'prevention'],
  },
  {
    year: 2022,
    title: 'Benchmarking ctDNA assays for early cancer detection',
    authors: 'Hughes M., Maruvka Y.E., Clark J.',
    venue: 'Nature Reviews Clinical Oncology',
    type: 'journal',
    links: [{ label: 'DOI', href: '#' }],
    tags: ['cfDNA', 'detection', 'benchmarking'],
  },
  {
    year: 2022,
    title: 'Clonal dynamics under immune checkpoint blockade',
    authors: 'Foster E., Maruvka Y.E., Rogers A.',
    venue: 'Cell',
    type: 'journal',
    links: [
      { label: 'DOI', href: '#' },
      { label: 'Data', href: '#' }
    ],
    tags: ['evolution', 'immunology', 'immunotherapy'],
  },
];
