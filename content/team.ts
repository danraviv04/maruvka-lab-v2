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
  image: '/team/dan_raviv.jpg',
  links: [
    { label: 'Technion profile', href: 'https://biotech.technion.ac.il/en/member/maruvka/' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=q8BKwrYAAAAJ&hl=en' },
  ],
};

export const team: TeamMember[] = [
  {
    name: 'Stav Naky',
    role: 'Direct-track PhD Student since October 2022',
    bio: 'LONG BIO', //'My research is about inferring cancer features from low-depth (1X) whole genome sequencing. Among the features are Polymerase Proofreading Deficiency (PPD), Homologous Repair Deficiency (HRD), Loss Of Heterozygosity (LOH), and Microsatellite Instability (MSI). Previous research shows that these features predict response to certain types of therapy (mainly immunotherapy such as Immune Checkpoint Inhibitors and PARP-Inhibitors). \n\n Inferring these features using low-pass WGS, rather than high coverage, reduces the detection price by an order of magnitude, democratizing cancer treatment for economically disadvantaged communities.',
    image: '/team/dan_raviv.jpg',
  },
  {
    name: 'Avraham Kahan',
    role: 'Some role (placeholder)',
    bio: 'I am currently studying towards a BS.c in Electrical Engineering. My main project in the lab is the continued algorithmic development and validation of MSMuTect, a microsatellite mutation detection tool for whole genome sequencing. ',
    links: [
    { label: 'MSMuTect GitHub', href: 'https://github.com/MaruvkaLab/MSMuTect_4/' },
    ], 
    image: '/team/dan_raviv.jpg',
  },
  {
    name: 'Gaia Frant',
    role: 'PhD Student',
    bio: 'My research investigates the mismatch repair (MMR) pathway, with a particular focus on its ability to correct longer deletion mutations in repetitive genomic regions. By enhancing the computational tool MSMuTect and by analyzing large-scale cancer genomic datasets from patients with and without MMR deficiency across multiple cancer types, I aim to deepen our understanding of MMR biology and its contribution to tumor development.',
    image: '/team/gaia_frant.png',
  },
  {
    name: 'Or Harnic',
    role: 'Project Student (placeholder)',
    bio: 'BIO PLACEHOLDER',
    image: '/team/or_harnic.jpeg',
  },
  {
    name: 'Daniel Gurevich',
    role: 'PhD Student',
    bio: 'BIO PLACEHOLDER',
    image: '/team/daniel_gurevich.jpeg',
  },
  {
    name: 'Eden Mor',
    role: 'M.Sc. Student',
    bio: 'BIO PLACEHOLDER',
    image: '/team/eden_mor.jpeg',
  },
];

export const alumni: TeamMember[] = [
  {
    name: 'Alumni Name 1 (placeholder)',
    role: 'Former PhD Student',
    bio: 'Now at Company/Institution X.',
  },
  {
    name: 'Alumni Name 2 (placeholder)',
    role: 'Former MSc Student',
    bio: 'Now pursuing PhD at University Y.',
  },
];
