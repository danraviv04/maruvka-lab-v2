export type Position = {
  title: string;
  level: string;
  summary: string;
  bullets: string[];
  howToApply: string;
};

export const positions: Position[] = [
  {
    title: 'PhD student - cancer evolution / signatures',
    level: 'PhD',
    summary:
      'Probabilistic modeling of tumor evolution and mutational processes using large-scale genomic datasets.',
    bullets: [
      'Strong statistics / ML background',
      'Experience with Python and data pipelines',
      'Interest in cancer genomics and inference',
    ],
    howToApply:
      'Email a CV + short note describing your interests and prior work to the lab address.',
  },
  {
    title: 'Research assistant / engineer - pipelines and reproducibility',
    level: 'Full-time',
    summary:
      'Build and maintain reproducible analysis tooling for genomic datasets and computational experiments.',
    bullets: [
      'Python + software engineering best practices',
      'Linux + HPC workflows (Slurm) are a plus',
      'Comfortable with containers and CI',
    ],
    howToApply:
      'Email a CV + links to relevant code (GitHub) to the lab address.',
  },
];
