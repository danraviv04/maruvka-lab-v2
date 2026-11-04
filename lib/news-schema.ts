import { newsCategories } from '@/content/news';
import type { NewsItem } from '@/content/news';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type NewsValidationResult =
  | { ok: true; item: NewsItem }
  | { ok: false; errors: string[] };

export function isNewsCategory(value: unknown): value is NewsItem['category'] {
  return typeof value === 'string' && newsCategories.includes(value as NewsItem['category']);
}

export function sortNewsByDate<T extends Pick<NewsItem, 'date'>>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function parseNewsItems(value: unknown): NewsItem[] {
  if (!Array.isArray(value)) {
    throw new Error('News content must be an array.');
  }

  return value.map((item, index) => {
    const validation = validateNewsInput(item);

    if (!validation.ok) {
      throw new Error(`Invalid news item at index ${index}: ${validation.errors.join('; ')}`);
    }

    return validation.item;
  });
}

export function validateNewsInput(value: unknown): NewsValidationResult {
  const errors: string[] = [];

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, errors: ['News item must be an object.'] };
  }

  const input = value as Record<string, unknown>;
  const title = readTrimmedString(input.title);
  const date = readTrimmedString(input.date);
  const description = readTrimmedString(input.description);
  const category = input.category;
  const image = readTrimmedString(input.image);
  const link = readLink(input.link, input.linkLabel, input.linkHref);

  if (!title || title.length < 2 || title.length > 160) {
    errors.push('Title must be 2-160 characters.');
  }

  if (!isValidIsoDate(date)) {
    errors.push('Date must be a valid YYYY-MM-DD date.');
  }

  if (!isNewsCategory(category)) {
    errors.push(`Category must be one of: ${newsCategories.join(', ')}.`);
  }

  if (!description || description.length < 10 || description.length > 1200) {
    errors.push('Description must be 10-1200 characters.');
  }

  if (link.error) {
    errors.push(link.error);
  }

  if (image && !isSafeHref(image)) {
    errors.push('Image must be a public path such as /news/example.jpg or an http(s) URL.');
  }

  if (errors.length > 0 || !title || !date || !description || !isNewsCategory(category)) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    item: {
      title,
      date,
      category,
      description,
      ...(link.value ? { link: link.value } : {}),
      ...(image ? { image } : {}),
    },
  };
}

function readTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readLink(
  link: unknown,
  linkLabel: unknown,
  linkHref: unknown
): { value?: NewsItem['link']; error?: string } {
  if (link && typeof link === 'object' && !Array.isArray(link)) {
    const candidate = link as Record<string, unknown>;
    return normalizeLink(readTrimmedString(candidate.label), readTrimmedString(candidate.href));
  }

  return normalizeLink(readTrimmedString(linkLabel), readTrimmedString(linkHref));
}

function normalizeLink(label: string, href: string): { value?: NewsItem['link']; error?: string } {
  if (!label && !href) {
    return {};
  }

  if (!href) {
    return { error: 'Link URL is required when a link label is provided.' };
  }

  if (!isSafeHref(href)) {
    return { error: 'Link URL must be a relative path or an http(s) URL.' };
  }

  const normalizedLabel = label || 'Read more';

  if (normalizedLabel.length > 80) {
    return { error: 'Link label must be 80 characters or fewer.' };
  }

  return { value: { label: normalizedLabel, href } };
}

function isSafeHref(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//')) {
    return !isLocalFilesystemPath(value);
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isLocalFilesystemPath(value: string): boolean {
  return /^\/(?:Users|Volumes|private|tmp|var|home)\//.test(value);
}

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
