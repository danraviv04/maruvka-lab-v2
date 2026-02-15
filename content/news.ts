export type NewsItem = {
  title: string;
  date: string; // ISO date string: YYYY-MM-DD
  category: 'Publication' | 'Award' | 'Event' | 'Announcement' | 'Presentation' | 'Funding';
  description: string;
  link?: { label: string; href: string };
  image?: string;
};

export const news: NewsItem[] = [
  {
    title: 'New Nature Methods paper on ctDNA detection',
    date: '2026-02-01',
    category: 'Publication',
    description:
      'Our latest work on statistical frameworks for ultra-low allele fraction detection in cell-free DNA has been published in Nature Methods. The paper introduces novel probabilistic models for maintaining calibrated false-positive rates.',
    link: { label: 'Read paper', href: '/publications' },
  },
  {
    title: 'Lab awarded ISF grant for cancer evolution research',
    date: '2026-01-15',
    category: 'Funding',
    description:
      'We are excited to announce that our lab has been awarded a 4-year Israel Science Foundation grant to study tumor evolutionary dynamics in longitudinal patient samples.',
  },
  {
    title: 'Dr. Maruvka invited speaker at AACR Annual Meeting',
    date: '2025-12-10',
    category: 'Presentation',
    description:
      'Dr. Yosef Maruvka will present our latest research on mutational signatures at the AACR Annual Meeting 2026 in San Diego.',
    link: { label: 'Conference details', href: 'https://www.aacr.org/meeting/aacr-annual-meeting-2026/' },
  },
  {
    title: 'Welcome new PhD students!',
    date: '2025-10-01',
    category: 'Announcement',
    description:
      'We are thrilled to welcome two new PhD students to the lab this fall. They will be working on liquid biopsy modeling and tumor evolution.',
  },
  {
    title: 'Lab receives Best Paper Award at RECOMB 2025',
    date: '2025-05-20',
    category: 'Award',
    description:
      'Our paper on "Bayesian inference for tumor phylogenies from single-cell sequencing" received the Best Paper Award at RECOMB 2025.',
  },
];
