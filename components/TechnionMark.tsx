'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The Technion badge, shown beside the lab mark.
 *
 * Replace public/technion-logo.png to change it. If the file is ever missing
 * the whole group hides itself, so the nav never shows a broken image or a
 * divider with nothing after it.
 */
const TECHNION_LOGO_SRC = '/technion-logo.png';

type TechnionMarkProps = {
  /** True while the bar sits on the dark hero. */
  onDark: boolean;
  className?: string;
};

export default function TechnionMark({ onDark, className }: TechnionMarkProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // The image usually finishes loading before React hydrates, so neither
  // onLoad nor onError ever fires for it. Re-read the element's own state once
  // mounted: `complete` with no intrinsic width means the request failed.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const image = imageRef.current;
      if (image?.complete && image.naturalWidth === 0) setFailed(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  if (failed) return null;

  return (
    <span className={`items-center gap-3 ${className ?? ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={TECHNION_LOGO_SRC}
        alt="Technion - Israel Institute of Technology"
        onError={() => setFailed(true)}
        // The badge is already white-on-navy, so it is never inverted. It is
        // clipped to a circle because the PNG has no alpha and would otherwise
        // show white corners. On the dark hero a hairline ring keeps the navy
        // circle from melting into the near-black background.
        className={`h-11 w-11 shrink-0 rounded-full object-cover ${
          onDark ? 'ring-1 ring-white/20' : ''
        }`}
      />
      {/* Divider sits after the badge, since the Technion mark leads the pair. */}
      <span
        className={`h-8 w-px shrink-0 ${onDark ? 'bg-white/25' : 'bg-slate-300 dark:bg-slate-700'}`}
        aria-hidden="true"
      />
    </span>
  );
}
