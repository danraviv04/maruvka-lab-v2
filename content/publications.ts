export type Publication = {
  year: number;
  title: string;
  authors: string;
  venue?: string;
  links?: { label: string; href: string }[];
  tags?: string[];
  type?: 'journal' | 'preprint' | 'conference';
};

/**
 * The lab's publications, used when the live OpenAlex query is unavailable.
 *
 * Every entry here is a real paper with a real DOI, generated from the lab's
 * OpenAlex record (author A5086771704) on 2026-11-08. The live
 * list at /api/publications supersedes it whenever OpenAlex responds, so this
 * only has to be good enough to stand in, not exhaustive.
 *
 * To refresh it, re-run the query in docs/PUBLICATIONS.md. Do not hand-write
 * entries: an invented paper here would be published as the lab's record.
 */
export const publications: Publication[] = [
  {
    year: 2026,
    title: 'Assessment of the 2022 Constitutional Mismatch Repair Deficiency Syndrome Diagnostic Criteria Using the International Replication Repair Deficiency Consortium',
    authors: 'Aronson M.D., Stengs L.K., Edwards M., et al.',
    venue: 'JCO Precision Oncology',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1200/po-26-00979' }],
    tags: ['genetic factors in colorectal cancer', 'neurofibromatosis and schwannoma cases', 'genomics and rare diseases'],
  },
  {
    year: 2026,
    title: 'Comprehensive characterization of DNA polymerases driver variants using large genomic dataset',
    authors: 'Dayan D., Ladany H., Glaser F., et al.',
    venue: 'Scientific Reports',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1038/s41598-026-62150-w' }],
    tags: ['cancer genomics and diagnostics', 'genetic factors in colorectal cancer', 'genomics and rare diseases'],
  },
  {
    year: 2026,
    title: 'Passenger variants as pan‐clonal markers of pediatric AML: Implications for molecular MRD',
    authors: 'Shiloh R., Dayan D., Geron I., et al.',
    venue: 'HemaSphere',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1002/hem3.70424' }],
    tags: ['acute myeloid leukemia research', 'acute lymphoblastic leukemia research', 'cancer genomics and diagnostics'],
  },
  {
    year: 2025,
    title: 'Tamoxifen induces PI3K activation in uterine cancer',
    authors: 'Kübler K., Nardone A., Anand S.K., et al.',
    venue: 'Nature Genetics',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1038/s41588-025-02308-w' }],
    tags: ['multiple and secondary primary cancers', 'pi3k/akt/mtor signaling in cancer', 'estrogen and related hormone effects'],
  },
  {
    year: 2025,
    title: 'Patterns of hypermutation shape tumorigenesis and immunotherapy response in mismatch-repair-deficient glioma',
    authors: 'Fernandez N.R., Chang Y., Nunes N.M., et al.',
    venue: 'Nature Genetics',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1038/s41588-025-02420-x' }],
    tags: ['glioma diagnosis and treatment', 'cancer genomics and diagnostics', 'genetic factors in colorectal cancer'],
  },
  {
    year: 2025,
    title: 'Multi-cancer framework with cancer-aware attention and adversarial mutual-information minimization for whole slide image classification',
    authors: 'Peled S., Maruvka Y.E., Freiman M.',
    venue: 'Medical Image Analysis',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1016/j.media.2025.103927' }],
    tags: ['ai in cancer detection', 'radiomics and machine learning in medical imaging', 'digital imaging for blood diseases'],
  },
  {
    year: 2024,
    title: 'Clinical and biological landscape of constitutional mismatch-repair deficiency syndrome: an International Replication Repair Deficiency Consortium cohort study',
    authors: 'Ercan A.B., Aronson M.D., Fernandez N.R., et al.',
    venue: 'The Lancet Oncology',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1016/s1470-2045(24)00026-3' }],
    tags: ['genetic factors in colorectal cancer', 'brca gene mutations in cancer', 'immunodeficiency and autoimmune disorders'],
  },
  {
    year: 2024,
    title: 'The landscape of primary mismatch repair deficient gliomas in children, adolescents, and young adults: a multi-cohort study',
    authors: 'Negm L., Chung J., Nobre L.F., et al.',
    venue: 'The Lancet Oncology',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1016/s1470-2045(24)00640-5' }],
    tags: ['glioma diagnosis and treatment', 'genetic factors in colorectal cancer', 'chromatin remodeling and cancer'],
  },
  {
    year: 2024,
    title: 'CIMIL-CRC: A clinically-informed multiple instance learning framework for patient-level colorectal cancer molecular subtypes classification from H&E stained images',
    authors: 'Hezi H., Gelber M., Balabanov A., et al.',
    venue: 'Computer Methods and Programs in Biomedicine',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1016/j.cmpb.2024.108513' }],
    tags: ['ai in cancer detection', 'radiomics and machine learning in medical imaging', 'colorectal cancer screening and detection'],
  },
  {
    year: 2024,
    title: 'Exploring the interplay between colorectal cancer subtypes genomic variants and cellular morphology: A deep-learning approach',
    authors: 'Hezi H., Shats D., Gurevich D., et al.',
    venue: 'PLoS ONE',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1371/journal.pone.0309380' }],
    tags: ['ai in cancer detection', 'genetic factors in colorectal cancer', 'radiomics and machine learning in medical imaging'],
  },
  {
    year: 2020,
    title: 'The repertoire of mutational signatures in human cancer',
    authors: 'Alexandrov L.B., Kim J., Haradhvala N.J., et al.',
    venue: 'Nature',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1038/s41586-020-1943-3' }],
    tags: ['cancer genomics and diagnostics', 'chromatin remodeling and cancer', 'dna repair mechanisms'],
  },
  {
    year: 2020,
    title: 'Pan-cancer analysis of whole genomes',
    authors: 'Aaltonen L.A., Abascal F., Abeshouse A.A., et al.',
    venue: 'Nature',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1038/s41586-020-1969-6' }],
    tags: ['cancer genomics and diagnostics', 'chromatin remodeling and cancer', 'genomic variations and chromosomal abnormalities'],
  },
  {
    year: 2020,
    title: 'The evolutionary history of 2,658 cancers',
    authors: 'Gerstung M., Jolly C., Leshchiner I., et al.',
    venue: 'Nature',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1038/s41586-019-1907-7' }],
    tags: ['cancer genomics and diagnostics', 'chromatin remodeling and cancer', 'genomic variations and chromosomal abnormalities'],
  },
  {
    year: 2020,
    title: 'Patterns of somatic structural variation in human cancer genomes',
    authors: 'Li Y., Roberts N.D., Wala J.A., et al.',
    venue: 'Nature',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1038/s41586-019-1913-9' }],
    tags: ['cancer genomics and diagnostics', 'genomic variations and chromosomal abnormalities', 'genome rearrangement algorithms'],
  },
  {
    year: 2020,
    title: 'Proteogenomic Characterization Reveals Therapeutic Vulnerabilities in Lung Adenocarcinoma',
    authors: 'Gillette M.A., Satpathy S., Cao S., et al.',
    venue: 'Cell',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1016/j.cell.2020.06.013' }],
    tags: ['lung cancer treatments and mutations', 'lung cancer research studies', 'cancer genomics and diagnostics'],
  },
  {
    year: 2019,
    title: 'Next-generation characterization of the Cancer Cell Line Encyclopedia',
    authors: 'Ghandi M., Huang F.W., Jané-Valbuena J., et al.',
    venue: 'Nature',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1038/s41586-019-1186-3' }],
    tags: ['cancer genomics and diagnostics', 'chromatin remodeling and cancer', 'gene expression and cancer classification'],
  },
  {
    year: 2018,
    title: 'Genetic and transcriptional evolution alters cancer cell line drug response',
    authors: 'Ben-David U., Siranosian B.A., Ha G., et al.',
    venue: 'Nature',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1038/s41586-018-0409-3' }],
    tags: ['cancer genomics and diagnostics', 'cancer cells and metastasis', 'evolution and genetic dynamics'],
  },
  {
    year: 2016,
    title: 'Tumor cells can follow distinct evolutionary paths to become resistant to epidermal growth factor receptor inhibition',
    authors: 'Hata A.N., Niederst M.J., Archibald H.L., et al.',
    venue: 'Nature Medicine',
    type: 'journal',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1038/nm.4040' }],
    tags: ['lung cancer treatments and mutations', 'cancer genomics and diagnostics', 'her2/egfr in cancer research'],
  },
];
