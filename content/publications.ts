export type Publication = {
  year: number;
  title: string;
  authors: string;
  venue?: string;
  links?: { label: string; href: string }[];
  tags?: string[];
};

// Replace with your actual publications. Keep links optional.
export const publications: Publication[] = [
  {
    year: 2025,
    title: 'A statistical framework for high-sensitivity ctDNA detection under sparse observations',
    authors: 'Maruvka Lab (placeholder authors)',
    venue: 'Preprint (placeholder)',
    links: [{ label: 'PDF', href: '#' }],
    tags: ['cfDNA', 'inference'],
  },
  {
    year: 2024,
    title: 'Therapy-induced mutational processes shape clonal selection in colorectal cancer',
    authors: 'Maruvka Lab (placeholder authors)',
    venue: 'Journal (placeholder)',
    links: [{ label: 'DOI', href: '#' }],
    tags: ['signatures', 'evolution'],
  },
];
