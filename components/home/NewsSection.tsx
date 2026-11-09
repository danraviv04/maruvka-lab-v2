import { Reveal, HoverLift } from '@/components/motion/Reveal';
import SectionHeading from './SectionHeading';
import { getNews, sortNewsByDate } from '@/lib/news';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const categoryColor: Record<string, string> = {
  Publication: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  Award: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  Event: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  Announcement: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  Presentation: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
  Funding: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
};

export default async function NewsSection() {
  const recent = sortNewsByDate(await getNews()).slice(0, 3);

  if (recent.length === 0) return null;

  return (
    <section
      id="news"
      className="scroll-mt-24 border-y border-emerald-200/70 bg-emerald-100/60 py-20 sm:py-28 dark:border-emerald-900/40 dark:bg-emerald-950/40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="05"
          kicker="Updates"
          title="Lab news."
          deepHref="/news"
          deepLabel="All news"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {recent.map((item, index) => (
            <Reveal as="article" key={`${item.date}-${item.title}`} index={index}>
              <HoverLift className="flex h-full flex-col rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition-colors hover:border-secondary/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-secondary/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      categoryColor[item.category] ??
                      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.category}
                  </span>
                  <time className="text-xs text-muted">{formatDate(item.date)}</time>
                </div>

                <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-text">{item.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 font-serif text-sm leading-relaxed text-muted">
                  {item.description}
                </p>

                {item.link ? (
                  <a
                    href={item.link.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
                  >
                    <span>{item.link.label}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                ) : null}
              </HoverLift>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
