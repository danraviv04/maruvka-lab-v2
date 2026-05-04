'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { newsCategories, type NewsCategory, type NewsItem } from '@/content/news';

type SessionState = 'loading' | 'authenticated' | 'guest' | 'disabled';
type SubmitState = 'idle' | 'saving' | 'success' | 'error';
type NewsListState = 'idle' | 'loading' | 'ready' | 'error';

type NewsFormState = {
  title: string;
  date: string;
  category: NewsCategory;
  description: string;
  linkLabel: string;
  linkHref: string;
  image: string;
};

type ApiResponse = {
  success?: boolean;
  error?: string;
  details?: string[];
  storage?: string;
  data?: NewsItem[];
};

const initialFormState = (): NewsFormState => ({
  title: '',
  date: localDateString(),
  category: 'Announcement',
  description: '',
  linkLabel: 'Read more',
  linkHref: '',
  image: '',
});

export default function NewsAdminForm() {
  const [sessionState, setSessionState] = useState<SessionState>('loading');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState<NewsFormState>(() => initialFormState());
  const [loginError, setLoginError] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsListState, setNewsListState] = useState<NewsListState>('idle');
  const [newsListMessage, setNewsListMessage] = useState('');
  const [deletingKey, setDeletingKey] = useState('');

  const loadNewsItems = useCallback(async () => {
    setNewsListState('loading');
    setNewsListMessage('');

    const response = await fetch('/api/admin/news', { cache: 'no-store' });
    const data = (await response.json().catch(() => ({}))) as ApiResponse;

    if (!response.ok || !data.data) {
      setNewsListState('error');
      setNewsListMessage(data.error || 'Unable to load news items.');
      return;
    }

    setNewsItems(data.data);
    setNewsListState('ready');
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const response = await fetch('/api/admin/news/session', { cache: 'no-store' });
        const data = (await response.json()) as { authenticated?: boolean; configured?: boolean };

        if (!isMounted) return;

        if (!data.configured) {
          setSessionState('disabled');
        } else {
          setSessionState(data.authenticated ? 'authenticated' : 'guest');
          if (data.authenticated) {
            loadNewsItems();
          }
        }
      } catch {
        if (isMounted) {
          setSessionState('guest');
        }
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [loadNewsItems]);

  const canSubmit = useMemo(() => {
    return Boolean(form.title.trim() && form.date && form.category && form.description.trim());
  }, [form]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError('');

    const response = await fetch('/api/admin/news/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = (await response.json().catch(() => ({}))) as ApiResponse;

    if (!response.ok) {
      setLoginError(data.error || 'Unable to sign in.');
      return;
    }

    setPassword('');
    setSessionState('authenticated');
    loadNewsItems();
  }

  async function handleLogout() {
    await fetch('/api/admin/news/login', { method: 'DELETE' });
    setSessionState('guest');
    setSubmitState('idle');
    setSubmitMessage('');
    setNewsItems([]);
    setNewsListState('idle');
    setNewsListMessage('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState('saving');
    setSubmitMessage('');

    const payload = {
      title: form.title,
      date: form.date,
      category: form.category,
      description: form.description,
      linkLabel: form.linkLabel,
      linkHref: form.linkHref,
      image: form.image,
    };

    const response = await fetch('/api/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => ({}))) as ApiResponse;

    if (!response.ok) {
      setSubmitState('error');
      setSubmitMessage([data.error, ...(data.details || [])].filter(Boolean).join(' '));
      return;
    }

    setSubmitState('success');
    setSubmitMessage(
      data.storage === 'github'
        ? 'News item committed to GitHub. The live site will update after deployment.'
        : 'News item saved locally.'
    );
    setForm(initialFormState());
    loadNewsItems();
  }

  async function handleDeleteNews(item: NewsItem) {
    const confirmed = window.confirm(`Delete this news item?\n\n${item.title}`);

    if (!confirmed) {
      return;
    }

    setDeletingKey(newsItemKey(item));
    setNewsListMessage('');

    const response = await fetch('/api/admin/news', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: item.title, date: item.date }),
    });
    const data = (await response.json().catch(() => ({}))) as ApiResponse;

    setDeletingKey('');

    if (!response.ok) {
      setNewsListState('error');
      setNewsListMessage(data.error || 'Unable to delete news item.');
      return;
    }

    setNewsItems((currentItems) => currentItems.filter((currentItem) => newsItemKey(currentItem) !== newsItemKey(item)));
    setNewsListState('ready');
    setNewsListMessage(
      data.storage === 'github'
        ? 'News item deleted in GitHub. The live site will update after deployment.'
        : 'News item deleted locally.'
    );
  }

  if (sessionState === 'loading') {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-slate-300 bg-white p-6 text-sm text-muted shadow-md dark:border-slate-700 dark:bg-slate-800">
        Checking access...
      </div>
    );
  }

  if (sessionState === 'disabled') {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900 shadow-md dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
        Set NEWS_ADMIN_PASSWORD in the deployment environment to enable this page.
      </div>
    );
  }

  if (sessionState === 'guest') {
    return (
      <form
        onSubmit={handleLogin}
        className="mx-auto mt-10 max-w-md rounded-lg border border-slate-300 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800"
      >
        <label className="block text-sm font-semibold text-text" htmlFor="news-admin-password">
          Password
        </label>
        <input
          id="news-admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text shadow-sm outline-none transition focus:border-primary dark:border-slate-600 dark:bg-slate-900"
          autoComplete="current-password"
        />
        {loginError ? <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-300">{loginError}</p> : null}
        <button
          type="submit"
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!password}
        >
          Sign in
        </button>
      </form>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-text shadow-sm transition hover:border-primary dark:border-slate-700 dark:bg-slate-800"
        >
          Sign out
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-300 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-text" htmlFor="news-title">
              Title
            </label>
            <input
              id="news-title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text shadow-sm outline-none transition focus:border-primary dark:border-slate-600 dark:bg-slate-900"
              maxLength={160}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text" htmlFor="news-date">
              Date
            </label>
            <input
              id="news-date"
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text shadow-sm outline-none transition focus:border-primary dark:border-slate-600 dark:bg-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text" htmlFor="news-category">
              Category
            </label>
            <select
              id="news-category"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value as NewsCategory })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text shadow-sm outline-none transition focus:border-primary dark:border-slate-600 dark:bg-slate-900"
            >
              {newsCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-text" htmlFor="news-description">
              Description
            </label>
            <textarea
              id="news-description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="mt-2 min-h-36 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text shadow-sm outline-none transition focus:border-primary dark:border-slate-600 dark:bg-slate-900"
              maxLength={1200}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text" htmlFor="news-link-label">
              Link label
            </label>
            <input
              id="news-link-label"
              value={form.linkLabel}
              onChange={(event) => setForm({ ...form, linkLabel: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text shadow-sm outline-none transition focus:border-primary dark:border-slate-600 dark:bg-slate-900"
              maxLength={80}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text" htmlFor="news-link-href">
              Link URL
            </label>
            <input
              id="news-link-href"
              value={form.linkHref}
              onChange={(event) => setForm({ ...form, linkHref: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text shadow-sm outline-none transition focus:border-primary dark:border-slate-600 dark:bg-slate-900"
              placeholder="/publications"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-text" htmlFor="news-image">
              Image path or URL
            </label>
            <input
              id="news-image"
              value={form.image}
              onChange={(event) => setForm({ ...form, image: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text shadow-sm outline-none transition focus:border-primary dark:border-slate-600 dark:bg-slate-900"
              placeholder="/team/dan_raviv.jpg"
            />
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Use an existing file from the public folder, such as /team/dan_raviv.jpg, or paste a full https URL.
              Local computer paths like /Users/... are not visible to the website.
            </p>
          </div>
        </div>

        {submitMessage ? (
          <p
            className={`mt-5 rounded-lg px-4 py-3 text-sm font-medium ${
              submitState === 'error'
                ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200'
                : 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-200'
            }`}
          >
            {submitMessage}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          disabled={!canSubmit || submitState === 'saving'}
        >
          {submitState === 'saving' ? 'Saving...' : 'Add news'}
        </button>
      </form>

      <section className="mt-8 rounded-lg border border-slate-300 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-primary">Existing news</h3>
            <p className="mt-1 text-sm text-muted">Delete outdated or mistaken updates from the news feed.</p>
          </div>
          <button
            type="button"
            onClick={loadNewsItems}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-text shadow-sm transition hover:border-primary dark:border-slate-700 dark:bg-slate-900"
            disabled={newsListState === 'loading'}
          >
            {newsListState === 'loading' ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {newsListMessage ? (
          <p
            className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${
              newsListState === 'error'
                ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200'
                : 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-200'
            }`}
          >
            {newsListMessage}
          </p>
        ) : null}

        {newsListState === 'loading' ? <p className="mt-5 text-sm text-muted">Loading news items...</p> : null}

        {newsListState !== 'loading' && newsItems.length === 0 ? (
          <p className="mt-5 text-sm text-muted">No news items are currently listed.</p>
        ) : null}

        {newsItems.length > 0 ? (
          <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-700">
            {newsItems.map((item) => {
              const key = newsItemKey(item);
              const isDeleting = deletingKey === key;

              return (
                <article key={key} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {item.category}
                      </span>
                      <time className="text-xs text-muted">{formatDate(item.date)}</time>
                    </div>
                    <h4 className="mt-2 text-base font-semibold text-text">{item.title}</h4>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{item.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteNews(item)}
                    className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-800 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/40"
                    disabled={Boolean(deletingKey)}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function localDateString(): string {
  const date = new Date();
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return offsetDate.toISOString().slice(0, 10);
}

function newsItemKey(item: Pick<NewsItem, 'title' | 'date'>): string {
  return `${item.date}:${item.title}`.toLowerCase();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
