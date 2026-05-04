import { promises as fs } from 'fs';
import type { NewsItem } from '@/content/news';
import { getNews, NEWS_CONTENT_PATH, parseNewsItems, sortNewsByDate } from '@/lib/news';

type NewsWriteResult = {
  item: NewsItem;
  storage: 'github' | 'local';
};

export type NewsItemTarget = Pick<NewsItem, 'title' | 'date'>;

type GithubConfig = {
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
  token: string;
};

export async function addNewsItem(item: NewsItem): Promise<NewsWriteResult> {
  const githubConfig = getGithubConfig();

  if (githubConfig) {
    return addNewsItemToGithub(item, githubConfig);
  }

  return addNewsItemToLocalFile(item);
}

export async function deleteNewsItem(target: NewsItemTarget): Promise<NewsWriteResult> {
  const githubConfig = getGithubConfig();

  if (githubConfig) {
    return deleteNewsItemFromGithub(target, githubConfig);
  }

  return deleteNewsItemFromLocalFile(target);
}

async function addNewsItemToLocalFile(item: NewsItem): Promise<NewsWriteResult> {
  const currentNews = await getNews();
  const updatedNews = mergeNewsItem(currentNews, item);

  await fs.writeFile(NEWS_CONTENT_PATH, serializeNews(updatedNews), 'utf8');

  return { item, storage: 'local' };
}

async function deleteNewsItemFromLocalFile(target: NewsItemTarget): Promise<NewsWriteResult> {
  const currentNews = await getNews();
  const { deletedItem, updatedNews } = removeNewsItem(currentNews, target);

  await fs.writeFile(NEWS_CONTENT_PATH, serializeNews(updatedNews), 'utf8');

  return { item: deletedItem, storage: 'local' };
}

async function addNewsItemToGithub(item: NewsItem, config: GithubConfig): Promise<NewsWriteResult> {
  const currentFile = await fetchGithubNewsFile(config);
  const currentNews = parseNewsItems(JSON.parse(currentFile.content));
  const updatedNews = mergeNewsItem(currentNews, item);

  const response = await fetch(githubContentsUrl(config), {
    method: 'PUT',
    headers: githubHeaders(config.token),
    body: JSON.stringify({
      branch: config.branch,
      content: Buffer.from(serializeNews(updatedNews), 'utf8').toString('base64'),
      message: `Add lab news: ${item.title.slice(0, 60)}`,
      sha: currentFile.sha,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`GitHub write failed: ${await readGithubError(response)}`);
  }

  return { item, storage: 'github' };
}

async function deleteNewsItemFromGithub(target: NewsItemTarget, config: GithubConfig): Promise<NewsWriteResult> {
  const currentFile = await fetchGithubNewsFile(config);
  const currentNews = parseNewsItems(JSON.parse(currentFile.content));
  const { deletedItem, updatedNews } = removeNewsItem(currentNews, target);

  const response = await fetch(githubContentsUrl(config), {
    method: 'PUT',
    headers: githubHeaders(config.token),
    body: JSON.stringify({
      branch: config.branch,
      content: Buffer.from(serializeNews(updatedNews), 'utf8').toString('base64'),
      message: `Delete lab news: ${deletedItem.title.slice(0, 60)}`,
      sha: currentFile.sha,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`GitHub write failed: ${await readGithubError(response)}`);
  }

  return { item: deletedItem, storage: 'github' };
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
