import Link from "next/link";
import Image from "next/image";
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
      {/* Enhanced gradient background with mesh effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #20c78a 0%, #1b8abf 50%, #8b7abf 100%)",
        }}
      />
      
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

      {/* Two-column layout */}
      <div className="relative z-10 mx-auto max-w-screen-2xl px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left column: Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur-sm">
              {eyebrow}
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="mt-6 text-base leading-relaxed text-white/90 md:text-lg">
              {subtitle}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href={primaryCtaHref}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                {primaryCtaLabel}
              </Link>
              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                {secondaryCtaLabel}
              </Link>

              <Link
                href={tertiaryCtaHref}
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                {tertiaryCtaLabel}
              </Link>
            </div>

            {/* Credibility badges */}
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2">
              {site.affiliations?.slice(0, 4).map((a) => (
                <span key={a} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Right column: Visual element */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-2xl">
              {/* Lab logo */}
              <div className="flex h-full items-center justify-center p-8">
                <Image
                  src="/logoLAB3.svg"
                  alt="Maruvka Lab"
                  width={400}
                  height={400}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            {/* Floating animation effect */}
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}