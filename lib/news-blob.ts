import { BlobNotFoundError, head, put } from '@vercel/blob';
import type { NewsItem } from '@/content/news';
import { parseNewsItems } from '@/lib/news-schema';

export const NEWS_BLOB_PATHNAME = 'news/news.json';
export const NEWS_IMAGE_BLOB_PREFIX = 'news/images/';

// The Blob SDK refuses a cache lifetime below one minute, so reads append the
// upload timestamp as a cache buster to pick up an edit immediately.
const NEWS_BLOB_CACHE_SECONDS = 60;

export function isBlobStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Returns null when the store exists but no news file has been written yet. */
export async function readNewsFromBlob(): Promise<NewsItem[] | null> {
  let metadata;

  try {
    metadata = await head(NEWS_BLOB_PATHNAME);
  } catch (error) {
    if (isBlobNotFound(error)) {
      return null;
    }

    throw error;
  }

  const response = await fetch(`${metadata.url}?v=${metadata.uploadedAt.getTime()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Blob read failed: ${response.status} ${response.statusText}`);
  }

  return parseNewsItems(await response.json());
}

export async function writeNewsToBlob(news: NewsItem[]): Promise<void> {
  await put(NEWS_BLOB_PATHNAME, `${JSON.stringify(news, null, 2)}\n`, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: NEWS_BLOB_CACHE_SECONDS,
  });
}

function isBlobNotFound(error: unknown): boolean {
  return error instanceof BlobNotFoundError || /not\s*found/i.test(String(error));
}
