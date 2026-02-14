// lib/metadata.ts
import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://maruvkalab.technion.ac.il';
const siteName = 'Maruvka Lab';
const defaultDescription = 'Computational cancer genomics lab at Technion. Statistical methods for tumor evolution, liquid biopsy, and cancer prevention.';

export function createMetadata({
  title,
  description = defaultDescription,
  path = '',
  ogImage = '/og-image.png',
}: {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  const url = `${baseUrl}${path}`;
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export const defaultMetadata = createMetadata({
  title: siteName,
  description: defaultDescription,
});
