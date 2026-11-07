'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import HelixCanvas from './HelixCanvas';
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

  // null means "follow the OS setting". Once the button is pressed the choice
  // is the visitor's, so someone on reduced-motion can still opt in.
  const [override, setOverride] = useState<boolean | null>(null);
  const animating = override ?? !reduceMotion;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoReady) return;

    if (animating) video.play().catch(() => undefined);
    else video.pause();
  }, [animating, videoReady]);

  return (
    <section
      className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-slate-950"
      aria-labelledby="hero-title"
    >
      {/* Layer 1: always-present canvas backdrop */}
      <HelixCanvas
        className="absolute inset-0 h-full w-full"
        animate={animating}
      />

      {/* Layer 2: the video, once a file actually exists and can play */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          videoReady ? 'opacity-40' : 'opacity-0'
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

      {/* Layer 3: tint so text keeps its contrast over either backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/85 to-primary/25"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          {site.institution}
        </p>

        <h1
          id="hero-title"
          className="mt-6 max-w-3xl font-serif text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Deciphering cancer evolution
          <br className="hidden sm:block" /> through computation.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          {site.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#research"
            className="group inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            <span>Explore our research</span>
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </a>
          <a
            href="#team"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
          >
            Meet the team
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6">
          <p className="text-xs leading-relaxed text-slate-400">
            {site.location}
            <br />
            {site.affiliations.join(' · ')}
          </p>

          <button
            type="button"
            onClick={() => setOverride(!animating)}
            className="rounded-full border border-white/25 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-white/50 hover:text-white"
          >
            {animating ? 'Pause background' : 'Play background'}
          </button>
        </div>
      </div>
    </section>
  );
}
