'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import HelixCanvas from './HelixCanvas';
import { scrollToSection } from '@/lib/scroll-to-section';
import { site } from '@/content/site';

/**
 * Drop an .mp4 at public/hero/hero.mp4 and it takes over the backdrop with no
 * code change. Until then the file 404s, the video stays hidden, and the
 * canvas helix below it is what everyone sees.
 */
const HERO_VIDEO_SRC = '/hero/hero.mp4';
const HERO_VIDEO_POSTER = '/hero/hero-poster.jpg';

export default function HeroStage() {
  const reduceMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const animating = !reduceMotion;

  // Same reason as the nav: letting the browser handle these anchors means
  // the scroll gets cancelled when the page settles and nothing happens.
  const onSectionClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;

    event.preventDefault();
    scrollToSection(id);

    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, '', `#${id}`);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoReady) return;

    if (animating) video.play().catch(() => undefined);
    else video.pause();
  }, [animating, videoReady]);

  return (
    <section
      // Light and airy by day, deep but never black by night. The hero used to
      // be slate-950 in both themes, which left a dark slab across an
      // otherwise white page whenever light mode was chosen.
      className="relative isolate flex min-h-[86vh] items-center overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-200/80 dark:border-emerald-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/70"
      aria-labelledby="hero-title"
    >
      {/* Masked top and bottom so the helix fades out instead of being cut
          off square by the section edge. */}
      <HelixCanvas
        className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_86%,transparent)]"
        animate={animating}
      />

      {/* The video, once a file actually exists and can play. */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          videoReady ? 'opacity-30 dark:opacity-40' : 'opacity-0'
        }`}
        src={HERO_VIDEO_SRC}
        poster={HERO_VIDEO_POSTER}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoReady(false)}
      />

      {/* Colour wash, and a readability scrim under the text only. */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_45%,rgba(4,120,87,0.16),transparent_62%)] dark:bg-[radial-gradient(ellipse_at_72%_45%,rgba(45,217,148,0.2),transparent_62%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-emerald-50 via-emerald-50/85 to-transparent sm:w-3/4 dark:from-slate-900 dark:via-slate-900/85"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 sm:py-28">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          <span className="h-px w-8 bg-secondary" aria-hidden="true" />
          {site.institution}
        </p>

        <h1
          id="hero-title"
          className="mt-6 max-w-3xl font-serif text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
        >
          Deciphering cancer evolution
          <br className="hidden sm:block" /> through computation.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
          {site.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#research"
            onClick={(event) => onSectionClick(event, 'research')}
            className="group inline-flex items-center gap-2 rounded bg-secondary px-6 py-3 text-sm font-semibold font-button text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary dark:text-slate-950 dark:hover:bg-secondary/90"
          >
            <span>Explore our research</span>
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </a>
          <a
            href="#team"
            onClick={(event) => onSectionClick(event, 'team')}
            className="inline-flex items-center gap-2 rounded border border-emerald-600/40 px-6 py-3 text-sm font-semibold font-button text-emerald-900 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-secondary hover:bg-white/70 hover:text-secondary dark:border-white/30 dark:text-white dark:hover:border-secondary dark:hover:bg-white/10 dark:hover:text-secondary"
          >
            Meet the team
          </a>
        </div>

        <p className="mt-16 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {site.location}
          <br />
          {site.affiliations.join(' · ')}
        </p>
      </div>
    </section>
  );
}
