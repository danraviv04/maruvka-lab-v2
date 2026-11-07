'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Stagger position within a group; each step adds 70ms. */
  index?: number;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'section';
};

/**
 * Fades and lifts content into place the first time it scrolls into view.
 *
 * Deliberately driven by a scroll listener rather than IntersectionObserver.
 * A jump-scroll — following a deep link like /#news, or restoring a scroll
 * position — can move an element from below the fold to above it between two
 * observer samples, so the observer never reports it as intersecting and the
 * content stays at opacity 0 forever. A scroll handler re-checks the real
 * rectangle after every jump, so content can never get stranded invisible.
 *
 * Anyone who has asked their system for less motion gets the content
 * immediately, with no transform and no listener at all.
 */
export function Reveal({ children, index = 0, className, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const check = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();

      // Revealed once its top edge clears the fold, or once it is above it.
      if (rect.top < window.innerHeight - 60) {
        setShown(true);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(check);
    };

    frame = requestAnimationFrame(check);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

type HoverLiftProps = {
  children: ReactNode;
  className?: string;
  /** How much it grows on hover. Keep it subtle for large surfaces. */
  scale?: number;
  as?: 'div' | 'article' | 'li';
};

/**
 * Grows and lifts on hover or keyboard focus, the interaction borrowed from the
 * Yizhak lab site. Reduced-motion users get the static card, since there is no
 * hover state worth rewarding with movement they did not ask for.
 */
export function HoverLift({ children, className, scale = 1.03, as = 'div' }: HoverLiftProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      whileHover={{ scale, y: -6 }}
      whileFocus={{ scale, y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      {children}
    </MotionTag>
  );
}
