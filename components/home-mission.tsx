export default function HomeMission() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-white/10 py-12 sm:py-16">
      {/* Decorative gradient orbs - matching hero style */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      
      <div className="relative z-10 mx-auto max-w-6xl px-6">
      <div className="text-center rounded-2xl">
        <div className="inline-flex items-center rounded-full border-2 border-primary/20 dark:border-primary/30 bg-white/70 dark:bg-slate-950/55 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary">
          Our Mission
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-text sm:text-3xl">
          Building methods that survive real data
        </h2>
      </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="group rounded-xl border-2 border-slate-300 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5 shadow-md transition hover:border-primary/50 hover:shadow-xl">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-text">Our Goal</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Models that are interpretable, testable, and honest about uncertainty.
            </p>
          </div>

          <div className="group rounded-xl border-2 border-slate-300 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5 shadow-md transition hover:border-secondary/50 hover:shadow-xl">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-secondary/80 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-text">Principles</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Reproducibility first. Inference over vibes. Simple baselines, then validation.
            </p>
          </div>

          <div className="group rounded-xl border-2 border-slate-300 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5 shadow-md transition hover:border-accent/50 hover:shadow-xl">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/80 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-text">Collaborations</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Working with clinicians, wet labs, and computational groups worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
