'use client';

import { useState } from 'react';

/** Initials stand in while a member has no photo, or the file is missing. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

type AvatarProps = {
  name: string;
  image?: string;
  size: number;
};

/**
 * Photo when there is one, initials when there is not.
 *
 * Every path in content/team.ts currently 404s, so the onError fallback is
 * what visitors actually see. A plain <img> is used rather than next/image:
 * the optimizer turns a missing file into a 500, while this just falls back.
 */
export default function Avatar({ name, image, size }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showInitials = !image || failed;

  if (showInitials) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-full bg-primary/12 font-semibold text-primary"
        style={{ width: size, height: size, fontSize: size / 2.8 }}
        aria-hidden="true"
      >
        {initials(name)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
