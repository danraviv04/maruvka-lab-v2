export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  citations: number;
  link: string;
}

export interface PublicationsResponse {
  success: boolean;
  count?: number;
  data?: Publication[];
  lastUpdated?: string;
  error?: string;
}

export async function fetchPublications(): Promise<PublicationsResponse> {
  try {
    const response = await fetch('/api/publications', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch publications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching publications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to categorize publication types based on venue
export function categorizePublication(venue: string): 'journal' | 'preprint' | 'conference' | 'other' {
  const venueLower = venue.toLowerCase();
  
  if (venueLower.includes('biorxiv') || venueLower.includes('arxiv') || venueLower.includes('medrxiv')) {
    return 'preprint';
  }
  
  if (venueLower.includes('conference') || venueLower.includes('proceedings') || 
      venueLower.includes('workshop') || venueLower.includes('symposium')) {
    return 'conference';
  }
  
  if (venueLower.includes('nature') || venueLower.includes('science') || 
      venueLower.includes('cell') || venueLower.includes('plos') ||
      venueLower.includes('journal') || venueLower.includes('jama')) {
    return 'journal';
  }
  
  return 'other';
}

// Helper to extract tags/topics from titles and venues
export function extractTags(title: string, venue: string): string[] {
  const text = (title + ' ' + venue).toLowerCase();
  const tags: string[] = [];
  
  const tagMap: Record<string, string[]> = {
    'cfDNA': ['cfdna', 'cell-free', 'liquid biopsy', 'ctdna'],
    'signatures': ['mutation', 'signature', 'mutational'],
    'evolution': ['evolution', 'clonal', 'phylogen'],
    'immunology': ['immune', 'immunotherapy', 'neoantigen'],
    'MSI': ['msi', 'microsatellite', 'lynch'],
    'inference': ['bayesian', 'statistical', 'model', 'inference'],
    'detection': ['detection', 'screening', 'diagnostic'],
    'therapy': ['therapy', 'treatment', 'drug'],
  };
  
  for (const [tag, keywords] of Object.entries(tagMap)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.push(tag);
    }
  }
  
  return tags.length > 0 ? tags : ['other'];
}
