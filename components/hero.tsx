import Link from "next/link";
import { site } from "@/content/site";

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  tertiaryCtaHref?: string;
  tertiaryCtaLabel?: string;
};

export default function Hero(props: Props) {
  const eyebrow = props.eyebrow ?? site.institution;
  const title = props.title ?? site.tagline;
  const subtitle = props.subtitle ?? site.description;

  // Defaults: match your nav routes
  const primaryCtaHref = props.primaryCtaHref ?? "/research";
  const primaryCtaLabel = props.primaryCtaLabel ?? "Explore research";

  const secondaryCtaHref = props.secondaryCtaHref ?? "/publications";
  const secondaryCtaLabel = props.secondaryCtaLabel ?? "Browse publications";

  const tertiaryCtaHref = props.tertiaryCtaHref ?? "/open-positions";
  const tertiaryCtaLabel = props.tertiaryCtaLabel ?? "Join the lab";

  return (
    <section className="relative overflow-hidden">
      {/* gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(45deg, #20c78a, #1b8abf, #8b7abf)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-screen-2xl px-6 py-20 md:py-28">
        <div className="max-w-4xl">
          <div className="text-sm font-medium text-white/80">{eyebrow}</div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
            {subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={primaryCtaHref}
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaHref}
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
            >
              {secondaryCtaLabel}
            </Link>

            <Link
              href={tertiaryCtaHref}
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
            >
              {tertiaryCtaLabel}
            </Link>
          </div>

          {/* optional micro-cred */}
          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
            <span className="rounded-full bg-white/10 px-3 py-1">
              {site.location}
            </span>
            {site.affiliations?.slice(0, 4).map((a) => (
              <span key={a} className="rounded-full bg-white/10 px-3 py-1">
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}