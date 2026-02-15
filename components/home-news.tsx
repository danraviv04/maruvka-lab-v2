import Link from 'next/link';
import { news } from '@/content/news';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Publication: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    Award: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
    Event: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
    Announcement: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    Presentation: 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300',
    Funding: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
  };
  return colors[category] || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
}

export default function HomeNews() {
  // Get the 3 most recent news items
  const recentNews = [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (recentNews.length === 0) return null;

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            Latest Updates
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text">Recent News</h2>
          <p className="mt-3 text-muted">
            Stay informed about our latest publications, awards, and lab activities.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {recentNews.map((item, index) => (
            <article
              key={index}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getCategoryColor(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
                <time className="text-xs text-muted">{formatDate(item.date)}</time>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-primary line-clamp-2">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
                {item.description}
              </p>

              {item.link && (
                <div className="mt-4">
                  <a
                    href={item.link.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:underline"
                  >
                    <span>{item.link.label}</span>
                    <span>→</span>
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-medium text-text shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span>View all news</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
