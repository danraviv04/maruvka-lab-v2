// components/home-cta.tsx
import Link from "next/link";

export default function HomeCTA() {
  return (
    <section className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm md:flex md:items-center md:justify-between md:gap-10">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Interested in joining or collaborating?</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/70">
              We welcome motivated students and research collaborations in computational cancer genomics.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
            <Link
              href="/open-positions"
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Join the lab
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold hover:bg-black/[0.03]"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}