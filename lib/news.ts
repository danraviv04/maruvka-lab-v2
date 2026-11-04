import { promises as fs } from 'fs';
import path from 'path';
import { news as bundledNews } from '@/content/news';
import type { NewsItem } from '@/content/news';
import { isBlobStorageConfigured, readNewsFromBlob } from '@/lib/news-blob';
import { parseNewsItems } from '@/lib/news-schema';

export const NEWS_CONTENT_PATH = path.join(process.cwd(), 'content/news.json');

export {
  isNewsCategory,
  parseNewsItems,
  sortNewsByDate,
  validateNewsInput,
  type NewsValidationResult,
} from '@/lib/news-schema';

/**
 * Live news for the public pages and the admin list.
 *
 * Vercel Blob is the source of truth once it is configured, so an edit shows up
 * on the next request without a redeploy. `content/news.json` stays in the repo
 * as the seed for a fresh store and as the fallback if a read ever fails.
 */
export async function getNews(): Promise<NewsItem[]> {
  if (isBlobStorageConfigured()) {
    try {
      const blobNews = await readNewsFromBlob();

      if (blobNews) {
        return blobNews;
      }
    } catch (error) {
      console.error('Failed to read news from Vercel Blob. Falling back to the repo file.', error);
    }
  }

  return readNewsFromFile();
}

export async function readNewsFromFile(): Promise<NewsItem[]> {
  try {
    const file = await fs.readFile(NEWS_CONTENT_PATH, 'utf8');
    return parseNewsItems(JSON.parse(file));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Failed to read content/news.json. Falling back to bundled news.', error);
    }

    return bundledNews;
  }
}
