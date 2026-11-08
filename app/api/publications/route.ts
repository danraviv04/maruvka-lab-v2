import { NextResponse } from 'next/server';
import { publications as fallbackPublications } from '../../../content/publications';
import { site } from '../../../content/site';

export const dynamic = 'force-dynamic';

/**
 * The live publication list, from OpenAlex.
 *
 * This used to scrape Google Scholar. Scholar returns 403 to datacenter IPs,
 * so it worked on a laptop and failed on every deployment — the page was
 * permanently stuck on its error card in production. OpenAlex is a free public
 * API built to be queried by servers, needs no key, and carries the same
 * records, so the list now works wherever the site is hosted.
 *
 * Scholar is still linked from the page as the lab's public profile; it is
 * just no longer the data source.
 */
const OPENALEX_AUTHOR_ID = process.env.OPENALEX_AUTHOR_ID || 'A5086771704';
const SCHOLAR_ID = process.env.SCHOLAR_ID || 'q8BKwrYAAAAJ';
const SCHOLAR_PROFILE_URL = `https://scholar.google.com/citations?user=${SCHOLAR_ID}&hl=en`;

const CACHE_SECONDS = Number(process.env.REVALIDATE_SECONDS) || 3600;
const MAX_RESULTS = 60;

/**
 * OpenAlex asks callers to identify themselves and gives a faster, more
 * reliable pool to those who do. This is the lab address already printed in
 * the site footer, not a visitor's.
 */
const CONTACT_EMAIL = process.env.OPENALEX_CONTACT_EMAIL || site.email;

/** Conference abstracts and errata carry DOIs but are not papers. */
const NOT_A_PAPER = /^(id #|abstract\b|erratum|correction|corrigendum|author correction|reply to|retraction)/i;

interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  citations: number;
  link: string;
}

type OpenAlexWork = {
  title: string | null;
  publication_year: number | null;
  cited_by_count: number | null;
  doi: string | null;
  authorships?: { author?: { display_name?: string | null } | null }[];
  primary_location?: { source?: { display_name?: string | null } | null } | null;
};

/** 'Yosef E. Maruvka' -> 'Maruvka Y.E.' — the form used across the site. */
function abbreviate(name: string): string {
  const parts = name.replace(/‐/g, '-').trim().split(/\s+/);
  if (parts.length < 2) return name;

  const last = parts[parts.length - 1];
  const initials = parts
    .slice(0, -1)
    .filter((part) => /^\p{L}/u.test(part))
    .map((part) => `${part[0]}.`)
    .join('');

  return `${last} ${initials}`.trim();
}

function formatAuthors(work: OpenAlexWork): string {
  const names = (work.authorships ?? [])
    .map((authorship) => authorship.author?.display_name)
    .filter((name): name is string => Boolean(name))
    .map(abbreviate);

  if (names.length === 0) return '';
  if (names.length > 4) return `${names.slice(0, 3).join(', ')}, et al.`;
  return names.join(', ');
}

async function fetchPublications(): Promise<Publication[]> {
  const url = new URL('https://api.openalex.org/works');
  url.searchParams.set('filter', `author.id:${OPENALEX_AUTHOR_ID},type:article`);
  url.searchParams.set('sort', 'publication_date:desc');
  url.searchParams.set('per-page', String(MAX_RESULTS));
  url.searchParams.set('mailto', CONTACT_EMAIL);

  const response = await fetch(url, {
    headers: { 'User-Agent': `maruvka-lab-website (mailto:${CONTACT_EMAIL})` },
    next: { revalidate: CACHE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`OpenAlex responded ${response.status}`);
  }

  const payload = (await response.json()) as { results?: OpenAlexWork[] };

  return (payload.results ?? [])
    .filter((work) => work.title && work.doi && !NOT_A_PAPER.test(work.title))
    .map((work) => ({
      title: work.title as string,
      authors: formatAuthors(work),
      venue: work.primary_location?.source?.display_name ?? '',
      year: work.publication_year ?? 0,
      citations: work.cited_by_count ?? 0,
      link: work.doi as string,
    }))
    .filter((publication) => publication.year > 0);
}

export async function GET() {
  try {
    const publications = await fetchPublications();

    if (publications.length === 0) {
      throw new Error('OpenAlex returned no usable records');
    }

    return NextResponse.json({
      success: true,
      count: publications.length,
      data: publications,
      lastUpdated: new Date().toISOString(),
      source: 'openalex',
      profileUrl: SCHOLAR_PROFILE_URL,
    });
  } catch (error) {
    console.error('Publications: live fetch failed, serving stored list.', error);

    // Safe to serve now: content/publications.ts is generated from OpenAlex and
    // every entry is a real paper with a real DOI. It was not always so — the
    // file previously held invented placeholders, and serving it would have
    // published fictional papers as the lab's record.
    const stored = fallbackPublications.map((publication) => ({
      title: publication.title,
      authors: publication.authors,
      venue: publication.venue ?? '',
      year: publication.year,
      citations: 0,
      link: publication.links?.[0]?.href ?? SCHOLAR_PROFILE_URL,
    }));

    return NextResponse.json({
      success: true,
      count: stored.length,
      data: stored,
      lastUpdated: new Date().toISOString(),
      source: 'stored',
      message: 'Live list unavailable; showing the most recent stored copy.',
      profileUrl: SCHOLAR_PROFILE_URL,
    });
  }
}
