'use client';

import { upload } from '@vercel/blob/client';
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { newsCategories, type NewsCategory, type NewsItem } from '@/content/news';

type SessionState = 'loading' | 'authenticated' | 'guest' | 'disabled';
type SubmitState = 'idle' | 'saving' | 'success' | 'error';
type NewsListState = 'idle' | 'loading' | 'ready' | 'error';
type UploadState = 'idle' | 'uploading' | 'error';

type NewsItemTarget = Pick<NewsItem, 'title' | 'date'>;

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

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

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
  const [uploadsEnabled, setUploadsEnabled] = useState(false);
  const [storage, setStorage] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState<NewsFormState>(() => initialFormState());
  const [editingTarget, setEditingTarget] = useState<NewsItemTarget | null>(null);
  const [loginError, setLoginError] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsListState, setNewsListState] = useState<NewsListState>('idle');
  const [newsListMessage, setNewsListMessage] = useState('');
  const [deletingKey, setDeletingKey] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const data = (await response.json()) as {
          authenticated?: boolean;
          configured?: boolean;
          uploadsEnabled?: boolean;
          storage?: string;
        };

        if (!isMounted) return;

        setUploadsEnabled(Boolean(data.uploadsEnabled));
        setStorage(data.storage || '');

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

  function resetForm() {
    setForm(initialFormState());
    setEditingTarget(null);
    setUploadState('idle');
    setUploadMessage('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

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
    resetForm();
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setUploadState('error');
      setUploadMessage('That image is larger than 10 MB. Please pick a smaller file.');
      return;
    }

    setUploadState('uploading');
    setUploadMessage('');

    try {
      const result = await upload(`news/images/${safeFileName(file.name)}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/news/upload',
        contentType: file.type,
      });

      setForm((currentForm) => ({ ...currentForm, image: result.url }));
      setUploadState('idle');
      setUploadMessage('Image uploaded.');
    } catch (error) {
      setUploadState('error');
      setUploadMessage(error instanceof Error ? error.message : 'Unable to upload the image.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
      ...(editingTarget ? { original: editingTarget } : {}),
    };

    const response = await fetch('/api/admin/news', {
      method: editingTarget ? 'PUT' : 'POST',
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
    setSubmitMessage(storageMessage(editingTarget ? 'updated' : 'saved', data.storage));
    resetForm();
    loadNewsItems();
  }

  function handleEditNews(item: NewsItem) {
    setEditingTarget({ title: item.title, date: item.date });
    setForm({
      title: item.title,
      date: item.date,
      category: item.category,
      description: item.description,
      linkLabel: item.link?.label || 'Read more',
      linkHref: item.link?.href || '',
      image: item.image || '',
    });
    setSubmitState('idle');
    setSubmitMessage('');
    setUploadState('idle');
    setUploadMessage('');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    if (editingTarget && newsItemKey(editingTarget) === newsItemKey(item)) {
      resetForm();
    }

    setNewsItems((currentItems) => currentItems.filter((currentItem) => newsItemKey(currentItem) !== newsItemKey(item)));
    setNewsListState('ready');
    setNewsListMessage(storageMessage('deleted', data.storage));
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {storage === 'blob' ? (
          <p className="text-xs text-muted">Edits publish straight to the live site.</p>
        ) : storage === 'github' ? (
          <p className="text-xs text-muted">Edits commit to GitHub and go live after the deployment finishes.</p>
        ) : (
          <p className="text-xs text-muted">Edits are written to the local content file.</p>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-text shadow-sm transition hover:border-primary dark:border-slate-700 dark:bg-slate-800"
        >
          Sign out
        </button>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-300 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800"
      >
        {editingTarget ? (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            <span>Editing: {editingTarget.title}</span>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-semibold transition hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/40"
            >
              Cancel edit
            </button>
          </div>
        ) : null}

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
            <span className="block text-sm font-semibold text-text">Image</span>

            {uploadsEnabled ? (
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  id="news-image-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={handleImageUpload}
                  disabled={uploadState === 'uploading'}
                  className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-text file:mr-4 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900"
                />
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Choose a picture from your computer, up to 10 MB. It uploads straight to the website.
                </p>
              </div>
            ) : (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                File uploads need a Vercel Blob store. Paste an image address below instead.
              </p>
            )}

            {uploadState === 'uploading' ? (
              <p className="mt-2 text-xs font-medium text-muted">Uploading image...</p>
            ) : null}

            {uploadMessage ? (
              <p
                className={`mt-2 text-xs font-medium ${
                  uploadState === 'error' ? 'text-red-600 dark:text-red-300' : 'text-green-700 dark:text-green-300'
                }`}
              >
                {uploadMessage}
              </p>
            ) : null}

            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="news-image">
              Image address
            </label>
            <input
              id="news-image"
              value={form.image}
              onChange={(event) => setForm({ ...form, image: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text shadow-sm outline-none transition focus:border-primary dark:border-slate-600 dark:bg-slate-900"
              placeholder="https://example.com/photo.jpg"
            />

            {form.image ? (
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image}
                  alt="Selected news image preview"
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: '' })}
                  className="text-xs font-semibold text-red-600 hover:underline dark:text-red-300"
                >
                  Remove image
                </button>
              </div>
            ) : null}
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
          disabled={!canSubmit || submitState === 'saving' || uploadState === 'uploading'}
        >
          {submitState === 'saving' ? 'Saving...' : editingTarget ? 'Save changes' : 'Add news'}
        </button>
      </form>

      <section className="mt-8 rounded-lg border border-slate-300 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-primary">Existing news</h3>
            <p className="mt-1 text-sm text-muted">Edit or delete updates already on the news feed.</p>
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
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditNews(item)}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-text shadow-sm transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900"
                      disabled={Boolean(deletingKey)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNews(item)}
                      className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-800 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/40"
                      disabled={Boolean(deletingKey)}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function storageMessage(action: 'saved' | 'updated' | 'deleted', storage?: string): string {
  if (storage === 'blob') {
    return `News item ${action}. It is live on the site now.`;
  }

  if (storage === 'github') {
    return `News item ${action} in GitHub. The live site will update after the deployment finishes.`;
  }

  return `News item ${action} in the local content file.`;
}

function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() || 'image';
  return base.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100) || 'image';
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
