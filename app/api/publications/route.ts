import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

const SCHOLAR_ID = 'q8BKwrYAAAAJ';
const SCHOLAR_URL = `https://scholar.google.com/citations?user=${SCHOLAR_ID}&hl=en&cstart=0&pagesize=100`;

// Fallback mode: set to true to use static fallback if Scholar scraping fails
const USE_FALLBACK_ON_ERROR = true;

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
      next: { revalidate: 3600 } // Cache for 1 hour
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
    });
  } catch (error) {
    console.error('API Error:', error);
    
    // In production, return a more graceful error
    // You might want to implement a fallback to cached data here
    if (USE_FALLBACK_ON_ERROR) {
      return NextResponse.json(
        {
          success: false,
          error: 'Temporarily unable to fetch publications from Google Scholar',
          message: 'Please try again later or check the static publications page',
          data: [], // Could add fallback static data here
        },
        { status: 503 } // Service Unavailable
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch publications',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
