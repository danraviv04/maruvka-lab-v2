// components/home-proof.tsx
import { site } from "@/content/site";

export default function HomeProof() {
  const items = site.home.proofItems;

  return (
    <section className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-2xl border border-black/10 p-6 shadow-sm">
              <div className="text-sm text-black/60">{it.kicker}</div>
              <div className="mt-1 text-lg font-semibold">{it.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-black/70">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}