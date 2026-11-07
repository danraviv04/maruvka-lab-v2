'use client';

import { useEffect, useState } from 'react';

/**
 * Reports which section is currently being read, for the nav to highlight.
 *
 * Picks the last section whose top has passed just under the sticky header,
 * rather than whichever is "most visible". That keeps the highlight stable
 * when a short section sits next to a tall one, and makes the final section
 * reachable at the bottom of the page where it can never fill the viewport.
 */
export function useSectionSpy(ids: string[], headerOffset = 96): string {
  const [activeId, setActiveId] = useState(ids[0] ?? '');

  useEffect(() => {
    if (ids.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;

      if (scrolledToBottom) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      let current = ids[0];

      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;

        if (element.getBoundingClientRect().top <= headerOffset + 8) {
          current = id;
        }
      }

      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, headerOffset]);

  return activeId;
}
