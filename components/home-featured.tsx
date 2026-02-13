// components/home-featured.tsx
import Link from "next/link";
import { site } from "@/content/site";

export default function HomeFeatured() {
  const f = site.home.featured;

  return (
    <section className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-xs text-black/70">
              Featured
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">{f.title}</h2>
            <p className="mt-3 text-black/70">{f.body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={f.primaryHref}
                className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                {f.primaryLabel}
              </Link>
              <Link
                href={f.secondaryHref}
                className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold hover:bg-black/[0.03]"
              >
                {f.secondaryLabel}
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-6 shadow-sm">
            <div className="text-sm font-semibold">{f.sideTitle}</div>
            <ul className="mt-4 space-y-3 text-sm text-black/70">
              {f.bullets.map((b) => (
                <li key={b} className="leading-relaxed">
                  <span className="mr-2 text-black/40">•</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}