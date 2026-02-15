// components/home-cta.tsx
import Link from "next/link";

export default function HomeCTA() {
  return (
    <section className="bg-white dark:bg-slate-900 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-10 shadow-xl md:flex md:items-center md:justify-between md:gap-10 md:p-12">
          {/* Decorative background elements */}
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/20 blur-2xl" />
          
          <div className="relative">
            <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Interested in joining or collaborating?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/90 md:text-base">
              We welcome motivated students and research collaborations in computational cancer genomics.
            </p>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-3 md:mt-0">
            <Link
              href="/open-positions"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Join the lab
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}