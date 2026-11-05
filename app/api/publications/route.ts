import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { publications as fallbackPublications } from '../../../content/publications';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

const SCHOLAR_ID = process.env.SCHOLAR_ID || 'q8BKwrYAAAAJ';
const SCHOLAR_URL = `https://scholar.google.com/citations?user=${SCHOLAR_ID}&hl=en&view_op=list_works&sortby=pubdate&cstart=0&pagesize=100`;
const SCHOLAR_PROFILE_URL = `https://scholar.google.com/citations?user=${SCHOLAR_ID}&hl=en`;

const SCRAPE_CACHE_SECONDS = Number(process.env.REVALIDATE_SECONDS) || 3600;

/**
 * Serve content/publications.ts when Scholar scraping fails.
 *
 * KEEP THIS false until content/publications.ts holds only real papers. Most of
 * the entries there are template placeholders with '#' links, and publishing
 * those would present invented papers as the lab's record. The page links to
 * the real Scholar profile on failure instead.
 */
const USE_FALLBACK_ON_ERROR = false;

interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  citations: number;
  link: string;
}

async function fetchPublications(): Promise<Publication[]> {
  try {
    const response = await fetch(SCHOLAR_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      next: { revalidate: SCRAPE_CACHE_SECONDS }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const publications: Publication[] = [];

    // Parse each publication row
    $('.gsc_a_tr').each((_, element) => {
      const $row = $(element);
      
      const title = $row.find('.gsc_a_at').text().trim();
      const link = 'https://scholar.google.com' + $row.find('.gsc_a_at').attr('href');
      const authors = $row.find('.gs_gray').eq(0).text().trim();
      const venue = $row.find('.gs_gray').eq(1).text().trim();
      const year = parseInt($row.find('.gsc_a_y span').text().trim()) || 0;
      const citations = parseInt($row.find('.gsc_a_c').text().trim()) || 0;

      if (title && year) {
        publications.push({
          title,
          authors,
          venue,
          year,
          citations,
          link,
        });
      }
    });

    return publications;
  } catch (error) {
    console.error('Error fetching publications:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const publications = await fetchPublications();
    
    return NextResponse.json({
      success: true,
      count: publications.length,
      data: publications,
      lastUpdated: new Date().toISOString(),
      source: 'google-scholar',
      profileUrl: SCHOLAR_PROFILE_URL,
    });
  } catch (error) {
    console.error('API Error:', error);
    
    // Return static fallback publications when scraping fails
    if (USE_FALLBACK_ON_ERROR) {
      const transformed = fallbackPublications.map(pub => ({
        title: pub.title,
        authors: pub.authors,
        venue: pub.venue || 'Publication',
        year: pub.year,
        citations: 0,
        link: pub.links?.[0]?.href || '#',
      }));

      return NextResponse.json(
        {
          success: true,
          count: transformed.length,
          data: transformed,
          lastUpdated: new Date().toISOString(),
          source: 'static-fallback',
          message: 'Using static publications (real-time data unavailable)',
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch publications',
        message: error instanceof Error ? error.message : 'Unknown error',
        profileUrl: SCHOLAR_PROFILE_URL,
      },
      { status: 500 }
    );
  }
}
