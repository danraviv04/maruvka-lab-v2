export type Tool = {
  name: string;
  description: string;
  href: string;
  tags?: string[];
  audience?: string;
};

export const tools: Tool[] = [
  {
    name: 'SigProfiler Suite',
    description: 'Comprehensive toolkit for mutational signature analysis, including signature extraction, attribution, and visualization. Enables researchers to identify and quantify mutational processes in cancer genomes.',
    href: 'https://github.com/maruvka-lab',
    tags: ['Python', 'signatures', 'visualization'],
    audience: 'Cancer genomics researchers analyzing somatic mutations',
  },
  {
    name: 'cfDNA Inference Framework',
    description: 'Statistical models for ultra-low allele fraction detection in cell-free DNA. Includes error-aware inference, power calculations, and longitudinal monitoring pipelines for minimal residual disease tracking.',
    href: 'https://github.com/maruvka-lab',
    tags: ['R', 'Python', 'statistics', 'cfDNA'],
    audience: 'Clinicians and researchers working with liquid biopsies',
  },
  {
    name: 'MSI Detection Pipeline',
    description: 'Robust microsatellite instability calling from tumor sequencing data with validated sensitivity and specificity. Integrated with neoantigen prediction for immunotherapy stratification.',
    href: 'https://github.com/maruvka-lab',
    tags: ['Python', 'Nextflow', 'MSI', 'immunotherapy'],
    audience: 'Clinical labs and translational researchers',
  },
  {
    name: 'Clonal Dynamics Simulator',
    description: 'Forward-time evolutionary simulator for tumor populations under selection, drift, and therapy. Useful for study design, method benchmarking, and hypothesis testing.',
    href: 'https://github.com/maruvka-lab',
    tags: ['Python', 'simulation', 'evolution'],
    audience: 'Computational biologists modeling cancer evolution',
  },
  {
    name: 'Cohort QC Toolkit',
    description: 'Quality control pipelines for large-scale cancer genomics studies. Detects batch effects, technical artifacts, and systematic biases before downstream analysis.',
    href: 'https://github.com/maruvka-lab',
    tags: ['Python', 'Nextflow', 'QC'],
    audience: 'Multi-center genomics consortia',
  },
  {
    name: 'Bayesian Signature Deconvolution',
    description: 'Probabilistic framework for attributing observed mutations to known mutational processes with uncertainty quantification. Handles complex mixtures and low mutation burdens.',
    href: 'https://github.com/maruvka-lab',
    tags: ['R', 'Bayesian', 'signatures'],
    audience: 'Researchers requiring robust uncertainty estimates',
  },
];
