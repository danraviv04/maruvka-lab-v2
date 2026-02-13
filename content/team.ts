export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  links?: { label: string; href: string }[];
};

// Replace placeholders with your actual lab members.
export const principalInvestigator: TeamMember = {
  name: 'Yosef Maruvka',
  role: 'Principal Investigator',
  bio:
    'We build statistical and computational methods to understand cancer evolution, detect disease earlier, and improve prevention.',
  image: '/team/dan_raviv.jpeg',
  links: [
    { label: 'Technion profile', href: 'https://biotech.technion.ac.il/en/member/maruvka/' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=q8BKwrYAAAAJ&hl=en' },
  ],
};

export const team: TeamMember[] = [
  {
    name: 'PhD Student (placeholder)',
    role: 'PhD Student',
    bio: 'Focus: liquid biopsy modeling and robust inference.',
    image: '/team/dan_raviv.jpeg',
  },
  {
    name: 'MSc Student (placeholder)',
    role: 'MSc Student',
    bio: 'Focus: mutational signatures and evolutionary dynamics.',
    image: '/team/dan_raviv.jpeg',
  },
  {
    name: 'Research Engineer (placeholder)',
    role: 'Research Engineer',
    bio: 'Pipelines, reproducibility, and open-source tooling.',
    image: '/team/dan_raviv.jpeg',
  },
];
