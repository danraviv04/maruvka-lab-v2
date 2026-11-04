import { promises as fs } from 'fs';
import type { NewsItem } from '@/content/news';
import { NEWS_CONTENT_PATH, readNewsFromFile } from '@/lib/news';
import { isBlobStorageConfigured, readNewsFromBlob, writeNewsToBlob } from '@/lib/news-blob';
import { parseNewsItems, sortNewsByDate } from '@/lib/news-schema';

export type NewsStorage = 'blob' | 'github' | 'local';

type NewsWriteResult = {
  item: NewsItem;
  storage: NewsStorage;
};

export type NewsItemTarget = Pick<NewsItem, 'title' | 'date'>;

/** Produces the new feed, plus the item the caller should report back. */
type NewsTransform = (currentNews: NewsItem[]) => { item: NewsItem; news: NewsItem[] };

type GithubConfig = {
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
  token: string;
};

export function getNewsStorage(): NewsStorage {
  if (isBlobStorageConfigured()) {
    return 'blob';
  }

  return getGithubConfig() ? 'github' : 'local';
}

export async function addNewsItem(item: NewsItem): Promise<NewsWriteResult> {
  return mutateNews(
    (currentNews) => ({ item, news: mergeNewsItem(currentNews, item) }),
    (added) => `Add lab news: ${added.title.slice(0, 60)}`
  );
}

export async function updateNewsItem(target: NewsItemTarget, item: NewsItem): Promise<NewsWriteResult> {
  return mutateNews(
    (currentNews) => ({ item, news: replaceNewsItem(currentNews, target, item) }),
    (updated) => `Update lab news: ${updated.title.slice(0, 60)}`
  );
}

export async function deleteNewsItem(target: NewsItemTarget): Promise<NewsWriteResult> {
  return mutateNews(
    (currentNews) => {
      const { deletedItem, updatedNews } = removeNewsItem(currentNews, target);
      return { item: deletedItem, news: updatedNews };
    },
    (deleted) => `Delete lab news: ${deleted.title.slice(0, 60)}`
  );
}

/**
 * Reads the current feed from whichever backend is configured, applies the
 * transform, and writes it back. Reading and writing always hit the same
 * backend, so the admin list never disagrees with what the public pages show.
 */
async function mutateNews(transform: NewsTransform, describe: (item: NewsItem) => string): Promise<NewsWriteResult> {
  if (isBlobStorageConfigured()) {
    // A store that has never been written falls back to the repo file as a seed.
    const currentNews = (await readNewsFromBlob()) ?? (await readNewsFromFile());
    const { item, news } = transform(currentNews);

    await writeNewsToBlob(news);

    return { item, storage: 'blob' };
  }

  const githubConfig = getGithubConfig();

  if (githubConfig) {
    const currentFile = await fetchGithubNewsFile(githubConfig);
    const { item, news } = transform(parseNewsItems(JSON.parse(currentFile.content)));

    await writeGithubNewsFile(githubConfig, news, currentFile.sha, describe(item));

    return { item, storage: 'github' };
  }

  const { item, news } = transform(await readNewsFromFile());

  await fs.writeFile(NEWS_CONTENT_PATH, serializeNews(news), 'utf8');

  return { item, storage: 'local' };
}

async function writeGithubNewsFile(
  config: GithubConfig,
  news: NewsItem[],
  sha: string,
  message: string
): Promise<void> {
  const response = await fetch(githubContentsUrl(config), {
    method: 'PUT',
    headers: githubHeaders(config.token),
    body: JSON.stringify({
      branch: config.branch,
      content: Buffer.from(serializeNews(news), 'utf8').toString('base64'),
      message,
      sha,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`GitHub write failed: ${await readGithubError(response)}`);
  }
}

async function fetchGithubNewsFile(config: GithubConfig): Promise<{ content: string; sha: string }> {
  const response = await fetch(`${githubContentsUrl(config)}?ref=${encodeURIComponent(config.branch)}`, {
    headers: githubHeaders(config.token),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`GitHub read failed: ${await readGithubError(response)}`);
  }

  const data = (await response.json()) as { content?: string; encoding?: string; sha?: string };

  if (!data.content || !data.sha || data.encoding !== 'base64') {
    throw new Error('GitHub returned an unexpected news file payload.');
  }

  return {
    content: Buffer.from(data.content, 'base64').toString('utf8'),
    sha: data.sha,
  };
}

function mergeNewsItem(currentNews: NewsItem[], item: NewsItem): NewsItem[] {
  const itemKey = newsItemKey(item);
  const withoutExistingMatch = currentNews.filter((existingItem) => newsItemKey(existingItem) !== itemKey);
  return sortNewsByDate([item, ...withoutExistingMatch]);
}

function replaceNewsItem(currentNews: NewsItem[], target: NewsItemTarget, item: NewsItem): NewsItem[] {
  const targetKey = newsItemKey(target);

  if (!currentNews.some((existingItem) => newsItemKey(existingItem) === targetKey)) {
    throw new Error('News item was not found.');
  }

  const itemKey = newsItemKey(item);

  if (itemKey !== targetKey && currentNews.some((existingItem) => newsItemKey(existingItem) === itemKey)) {
    throw new Error('Another news item already uses that title and date.');
  }

  return sortNewsByDate(
    currentNews.map((existingItem) => (newsItemKey(existingItem) === targetKey ? item : existingItem))
  );
}

function removeNewsItem(
  currentNews: NewsItem[],
  target: NewsItemTarget
): { deletedItem: NewsItem; updatedNews: NewsItem[] } {
  const targetKey = newsItemKey(target);
  const deletedItem = currentNews.find((item) => newsItemKey(item) === targetKey);

  if (!deletedItem) {
    throw new Error('News item was not found.');
  }

  return {
    deletedItem,
    updatedNews: currentNews.filter((item) => newsItemKey(item) !== targetKey),
  };
}

function newsItemKey(item: NewsItemTarget): string {
  return `${item.date}:${item.title}`.toLowerCase();
}

function serializeNews(news: NewsItem[]): string {
  return `${JSON.stringify(news, null, 2)}\n`;
}

function getGithubConfig(): GithubConfig | null {
  const token = process.env.NEWS_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '';
  const repoFullName = process.env.NEWS_GITHUB_REPO || '';

  if (!token && !repoFullName) {
    return null;
  }

  if (!token || !repoFullName) {
    throw new Error('Set both NEWS_GITHUB_TOKEN and NEWS_GITHUB_REPO, or leave both unset for local file writes.');
  }

  const [owner, repo, ...extra] = repoFullName.split('/');

  if (!owner || !repo || extra.length > 0) {
    throw new Error('NEWS_GITHUB_REPO must use the owner/repo format.');
  }

  return {
    owner,
    repo,
    branch: process.env.NEWS_GITHUB_BRANCH || 'main',
    filePath: process.env.NEWS_GITHUB_FILE_PATH || 'content/news.json',
    token,
  };
}

function githubContentsUrl(config: GithubConfig): string {
  const encodedPath = config.filePath.split('/').map(encodeURIComponent).join('/');
  return `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(
    config.repo
  )}/contents/${encodedPath}`;
}

function githubHeaders(token: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function readGithubError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message || `${response.status} ${response.statusText}`;
  } catch {
    return `${response.status} ${response.statusText}`;
  }
}
