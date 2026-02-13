// components/home-focus.tsx
import Link from "next/link";
import { focusAreas } from "@/content/focus";

export default function HomeFocus() {
  const top = focusAreas.slice(0, 3);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-xs text-black/70">
            Research
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Focus areas</h2>
          <p className="mt-3 text-black/70">
            A few hard problems where careful modeling and clean data can move the needle.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {top.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className="group rounded-2xl border border-black/10 p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-lg font-semibold">{a.title}</div>
                <span className="text-black/40 transition group-hover:text-black/70">→</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-black/70">{a.description}</p>
              {a.tag ? (
                <div className="mt-4">
                  <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-xs text-black/70">
                    {a.tag}
                  </span>
                </div>
              ) : null}
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/research"
            className="inline-flex items-center rounded-full border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            Explore all research →
          </Link>
        </div>
      </div>
    </section>
  );
}