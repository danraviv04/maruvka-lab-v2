import type { Metadata } from 'next';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import Badge from '../../components/Badge';
import { news } from '../../content/news';

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest updates, publications, awards, and announcements from the Maruvka Lab.',
};

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

export default function NewsPage() {
  // Sort news by date (most recent first)
  const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Updates"
            title="Lab News"
            description="Stay up to date with our latest publications, awards, events, and announcements."
          />

          <div className="mt-12 space-y-6">
            {sortedNews.map((item, index) => (
              <article
                key={index}
                className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-md transition hover:shadow-xl"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                      <time className="text-sm text-muted">{formatDate(item.date)}</time>
                    </div>

                    <h3 className="mt-3 text-xl font-semibold text-primary">{item.title}</h3>
                    <p className="mt-3 font-serif text-base leading-relaxed text-muted">
                      {item.description}
                    </p>

                    {item.link && (
                      <div className="mt-4">
                        <a
                          href={item.link.href}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
                        >
                          <span>{item.link.label}</span>
                          <span>→</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {item.image && (
                    <div className="h-24 w-24 overflow-hidden rounded-xl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Empty state if no news */}
          {sortedNews.length === 0 && (
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center shadow-md">
              <p className="text-muted">No news items yet. Check back soon for updates!</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
