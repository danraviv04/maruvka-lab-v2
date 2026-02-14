export type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: 'lab' | 'research' | 'events' | 'figures';
  date?: string;
};

// Add your actual images to the public folder and reference them here
export const galleryItems: GalleryItem[] = [
  {
    id: 'lab-space-1',
    title: 'Computational workspace',
    description: 'Our main workspace where we develop methods and analyze data',
    image: '/gallery/lab-space.jpg',
    category: 'lab',
    date: '2024',
  },
  {
    id: 'team-meeting-1',
    title: 'Lab meeting',
    description: 'Weekly research discussions and code reviews',
    image: '/gallery/team-meeting.jpg',
    category: 'events',
    date: '2024',
  },
  {
    id: 'research-fig-1',
    title: 'Mutational signature analysis',
    description: 'Deconvolution of mutational processes in colorectal cancer cohort',
    image: '/gallery/signatures-plot.jpg',
    category: 'research',
    date: '2024',
  },
  {
    id: 'research-fig-2',
    title: 'ctDNA detection framework',
    description: 'Statistical power curves for minimal residual disease monitoring',
    image: '/gallery/ctdna-power.jpg',
    category: 'research',
    date: '2025',
  },
  {
    id: 'research-fig-3',
    title: 'Clonal evolution',
    description: 'Phylogenetic tree reconstruction from longitudinal sequencing',
    image: '/gallery/phylogeny.jpg',
    category: 'research',
    date: '2024',
  },
  {
    id: 'conference-1',
    title: 'AACR 2024',
    description: 'Presenting our work on therapy-induced mutational processes',
    image: '/gallery/conference-2024.jpg',
    category: 'events',
    date: '2024',
  },
  {
    id: 'lab-space-2',
    title: 'Server room',
    description: 'High-performance computing infrastructure for large-scale genomic analysis',
    image: '/gallery/servers.jpg',
    category: 'lab',
    date: '2024',
  },
  {
    id: 'research-fig-4',
    title: 'MSI detection pipeline',
    description: 'Validation metrics across multiple tumor types',
    image: '/gallery/msi-validation.jpg',
    category: 'research',
    date: '2023',
  },
  {
    id: 'event-seminar-1',
    title: 'Guest seminar',
    description: 'Collaborative research discussion with visiting scientist',
    image: '/gallery/seminar.jpg',
    category: 'events',
    date: '2024',
  },
  {
    id: 'team-photo-1',
    title: 'Lab retreat 2024',
    description: 'Annual retreat in the Galilee',
    image: '/gallery/retreat-2024.jpg',
    category: 'events',
    date: '2024',
  },
  {
    id: 'research-fig-5',
    title: 'Immune response modeling',
    description: 'T-cell infiltration patterns in MSI-high tumors',
    image: '/gallery/immune-model.jpg',
    category: 'research',
    date: '2023',
  },
  {
    id: 'figures-cover',
    title: 'Journal cover',
    description: 'Featured artwork from our Nature Methods publication',
    image: '/gallery/journal-cover.jpg',
    category: 'figures',
    date: '2025',
  },
];

export const categories = [
  { value: 'all', label: 'All' },
  { value: 'research', label: 'Research Figures' },
  { value: 'lab', label: 'Lab Space' },
  { value: 'events', label: 'Events & People' },
  { value: 'figures', label: 'Published Figures' },
] as const;
