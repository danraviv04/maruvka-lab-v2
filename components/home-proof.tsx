// components/home-proof.tsx
import { site } from "@/content/site";

export default function HomeProof() {
  const items = site.home.proofItems;

  const icons = ['📊', '🧬', '💻'];

  return (
    <section className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it, idx) => (
            <div 
              key={it.title} 
              className="group rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-md transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-xl">
                  {icons[idx]}
                </div>
                <div className="flex-1">
                  <span className="inline-block rounded-full bg-accent/10 px-2 py-1 text-xs font-semibold text-accent">
                    {it.kicker}
                  </span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}