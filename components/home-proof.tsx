// components/home-proof.tsx
import { site } from "@/content/site";

export default function HomeProof() {
  const items = site.home.proofItems;

  const icons = ['📊', '🧬', '💻'];

  return (
    <section id="home-proof" className="scroll-mt-24 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-16 md:py-24">
      <div className="mx-auto max-w-screen-2xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full border-2 border-primary/20 bg-white/70 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm dark:border-primary/30 dark:bg-slate-950/55">
            Research Approach
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-text sm:text-3xl">
            Methods, data, and reproducibility
          </h2>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3 lg:gap-10">
          {items.map((it, idx) => (
            <div 
              key={it.title} 
              className="min-h-64 rounded-2xl border-2 border-slate-300 bg-white p-8 shadow-md dark:border-slate-700 dark:bg-slate-800 md:p-10"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-3xl">
                  {icons[idx]}
                </div>
                <div className="flex-1">
                  <span className="inline-block rounded-full bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
                    {it.kicker}
                  </span>
                </div>
              </div>
              <h3 className="mt-7 text-2xl font-semibold text-text">{it.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-muted">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
