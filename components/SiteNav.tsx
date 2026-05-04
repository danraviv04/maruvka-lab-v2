'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { site } from '../content/site';

type RouteVisualKind =
  | 'research'
  | 'publications'
  | 'tools'
  | 'team'
  | 'news'
  | 'gallery'
  | 'collaborators'
  | 'mission'
  | 'contact'
  | 'careers';

const routeVisualByHref: Record<string, { label: string; kind: RouteVisualKind }> = {
  '/research': { label: 'Research', kind: 'research' },
  '/publications': { label: 'Publications', kind: 'publications' },
  '/tools': { label: 'Tools', kind: 'tools' },
  '/team': { label: 'Team', kind: 'team' },
  '/news': { label: 'News', kind: 'news' },
  '/gallery': { label: 'Gallery', kind: 'gallery' },
  '/collaborators': { label: 'Collaborators', kind: 'collaborators' },
  '/mission': { label: 'In Memoriam', kind: 'mission' },
  '/contact': { label: 'Contact', kind: 'contact' },
  '/open-positions': { label: 'Open positions', kind: 'careers' },
};

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

function RouteGraphic({ kind }: { kind: RouteVisualKind }) {
  const lineProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;

  return (
    <svg
      viewBox="0 0 64 64"
      className="h-10 w-10 text-white/90 transition-transform duration-500 ease-out"
      focusable="false"
    >
      {kind === 'research' ? (
        <>
          <path {...lineProps} d="M24 12c16 8 16 32 0 40" strokeWidth="3" />
          <path {...lineProps} d="M40 12c-16 8-16 32 0 40" strokeWidth="3" />
          <path {...lineProps} d="M25 22h14M24 32h16M25 42h14" className="opacity-75" strokeWidth="2" />
          <circle cx="48" cy="21" r="3.5" fill="currentColor" className="opacity-80" />
        </>
      ) : null}
      {kind === 'publications' ? (
        <>
          <rect x="19" y="13" width="28" height="38" rx="4" className="fill-white/14 stroke-current" strokeWidth="2.5" />
          <path {...lineProps} d="M26 24h14M26 32h14M26 40h9" strokeWidth="2.4" />
          <path {...lineProps} d="M44 18l5 5" className="opacity-55" strokeWidth="2.2" />
        </>
      ) : null}
      {kind === 'tools' ? (
        <>
          <path {...lineProps} d="M16 22h32M16 40h32" strokeWidth="2.8" />
          <circle cx="27" cy="22" r="5" className="fill-white/20 stroke-current" strokeWidth="2.3" />
          <circle cx="39" cy="40" r="5" className="fill-white/20 stroke-current" strokeWidth="2.3" />
        </>
      ) : null}
      {kind === 'team' ? (
        <>
          <circle cx="32" cy="22" r="7" className="fill-white/18 stroke-current" strokeWidth="2.6" />
          <path {...lineProps} d="M19 48c2-10 8-15 13-15s11 5 13 15" strokeWidth="2.8" />
          <circle cx="19" cy="28" r="4.5" className="fill-white/12 stroke-current opacity-70" strokeWidth="2.2" />
          <circle cx="45" cy="28" r="4.5" className="fill-white/12 stroke-current opacity-70" strokeWidth="2.2" />
          <path {...lineProps} d="M12 48c1-6 4-10 8-12M52 48c-1-6-4-10-8-12" className="opacity-70" strokeWidth="2.2" />
        </>
      ) : null}
      {kind === 'news' ? (
        <>
          <path {...lineProps} d="M14 35h11l5-14 8 24 5-13 5 3h4" strokeWidth="3" />
          <circle cx="50" cy="35" r="3" fill="currentColor" className="opacity-70" />
        </>
      ) : null}
      {kind === 'gallery' ? (
        <>
          <rect x="16" y="18" width="32" height="28" rx="5" className="fill-white/14 stroke-current" strokeWidth="2.5" />
          <circle cx="39" cy="26" r="3" fill="currentColor" className="opacity-70" />
          <path {...lineProps} d="M21 41l9-10 6 6 5-5 6 9" strokeWidth="2.3" />
        </>
      ) : null}
      {kind === 'collaborators' ? (
        <>
          <circle cx="32" cy="32" r="5.5" className="fill-white/22 stroke-current" strokeWidth="2.3" />
          <circle cx="20" cy="22" r="4" className="fill-white/14 stroke-current" strokeWidth="2.2" />
          <circle cx="45" cy="21" r="4" className="fill-white/14 stroke-current" strokeWidth="2.2" />
          <circle cx="22" cy="45" r="4" className="fill-white/14 stroke-current" strokeWidth="2.2" />
          <circle cx="47" cy="43" r="4" className="fill-white/14 stroke-current" strokeWidth="2.2" />
          <path {...lineProps} d="M24 25l4 4M41 24l-5 5M26 42l3-6M43 40l-7-5" className="opacity-65" strokeWidth="2" />
        </>
      ) : null}
      {kind === 'mission' ? (
        <>
          <path {...lineProps} d="M32 13c12 9 11 27 0 35-11-8-12-26 0-35Z" className="fill-white/14" strokeWidth="2.6" />
          <path {...lineProps} d="M32 22c5 6 5 13 0 18-5-5-5-12 0-18Z" className="opacity-70" strokeWidth="2.2" />
          <path {...lineProps} d="M23 51h18" className="opacity-50" strokeWidth="2.2" />
        </>
      ) : null}
      {kind === 'contact' ? (
        <>
          <path
            {...lineProps}
            d="M18 19h28a7 7 0 0 1 7 7v9a7 7 0 0 1-7 7H33l-10 6v-6h-5a7 7 0 0 1-7-7v-9a7 7 0 0 1 7-7Z"
            className="fill-white/14"
            strokeWidth="2.5"
          />
          <circle cx="26" cy="31" r="2.7" fill="currentColor" className="opacity-75" />
          <circle cx="34" cy="31" r="2.7" fill="currentColor" className="opacity-75" />
          <circle cx="42" cy="31" r="2.7" fill="currentColor" className="opacity-75" />
        </>
      ) : null}
      {kind === 'careers' ? (
        <>
          <rect x="16" y="25" width="32" height="23" rx="4.5" className="fill-white/14 stroke-current" strokeWidth="2.7" />
          <path {...lineProps} d="M24 25v-5a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5" strokeWidth="2.7" />
          <path {...lineProps} d="M16 34h32" className="opacity-70" strokeWidth="2.3" />
          <rect x="29" y="32" width="6" height="5" rx="1.5" className="fill-white/20 stroke-current" strokeWidth="2" />
        </>
      ) : null}
    </svg>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const [menu, setMenu] = useState({ pathname: '', open: false });
  const [compact, setCompact] = useState(false);
  const [tracker, setTracker] = useState({ left: 0, width: 0, visible: false });
  const menuOpen = compact && menu.pathname === pathname && menu.open;
  const activeNavIndex = site.nav.findIndex((item) => isActive(pathname, item.href));
  const homeActive = pathname === '/';
  const careerActive = isActive(pathname, '/open-positions');
  const activeNavItem = activeNavIndex >= 0 ? site.nav[activeNavIndex] : null;
  const routeVisual = homeActive
    ? null
    : careerActive
      ? routeVisualByHref['/open-positions']
      : activeNavItem
        ? routeVisualByHref[activeNavItem.href]
        : null;
  const activeStep = homeActive
    ? 0
    : careerActive
      ? site.nav.length + 1
      : activeNavIndex >= 0
        ? activeNavIndex + 1
        : 0;
  const routeThreadX = ((activeStep + 0.5) / (site.nav.length + 2)) * 100;
  const routeAccent =
    [
      'rgba(32,199,138,0.42)',
      'rgba(27,138,191,0.44)',
      'rgba(139,122,191,0.42)',
      'rgba(32,199,138,0.36)',
      'rgba(27,138,191,0.38)',
      'rgba(139,122,191,0.38)',
      'rgba(32,199,138,0.34)',
      'rgba(27,138,191,0.36)',
      'rgba(139,122,191,0.36)',
      'rgba(32,199,138,0.34)',
      'rgba(249,115,22,0.38)',
    ][activeStep] ?? 'rgba(27,138,191,0.4)';

  const headerRef = useRef<HTMLElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const logoMarkRef = useRef<HTMLDivElement | null>(null);
  const labNameRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const compactRef = useRef(false);

  useLayoutEffect(() => {
    const headerEl = headerRef.current;
    const rowEl = rowRef.current;
    const logoEl = logoRef.current;
    const navEl = navRef.current;
    if (!headerEl || !rowEl || !logoEl || !navEl) return;

    const GAP_SAFETY_PX = 40; // accounts for gaps/padding between logo and nav
    const VISUAL_GUTTER_PX = 24;
    const ENTER_COMPACT_PX = 8;
    const EXIT_COMPACT_PX = 24;

    const compute = () => {
      const rowW = rowEl.clientWidth;
      const logoW = logoEl.clientWidth;
      const visualW = visualRef.current
        ? visualRef.current.getBoundingClientRect().width + VISUAL_GUTTER_PX
        : 0;
      const available = Math.max(0, rowW - logoW - visualW - GAP_SAFETY_PX);

      // scrollWidth reflects the space the nav would like to occupy.
      const needed = navEl.scrollWidth;

      // Hysteresis to avoid flicker around the boundary.
      const nextCompact = compactRef.current
        ? needed > available - EXIT_COMPACT_PX
        : needed > available + ENTER_COMPACT_PX;
      compactRef.current = nextCompact;
      setCompact((prev) => (prev === nextCompact ? prev : nextCompact));
      if (!nextCompact) {
        setMenu((current) => (current.open ? { pathname: current.pathname, open: false } : current));
      }

      const activeEl = navEl.querySelector<HTMLElement>('[data-nav-active="true"]');
      if (nextCompact || (!homeActive && !activeEl)) {
        setTracker((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }

      const headerRect = headerEl.getBoundingClientRect();
      const logoOffsetParent = logoEl.offsetParent as HTMLElement | null;
      const activeRect =
        homeActive && logoOffsetParent
          ? {
              left: logoOffsetParent.getBoundingClientRect().left + logoEl.offsetLeft,
              width: logoEl.offsetWidth,
            }
          : activeEl?.getBoundingClientRect();
      if (!activeRect) {
        setTracker((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }
      const nextTracker = {
        left: Math.round(activeRect.left - headerRect.left),
        width: Math.round(activeRect.width),
        visible: true,
      };

      setTracker((prev) => {
        if (
          prev.visible === nextTracker.visible &&
          prev.left === nextTracker.left &&
          prev.width === nextTracker.width
        ) {
          return prev;
        }
        return nextTracker;
      });
    };

    let frameId: number | null = null;
    const scheduleCompute = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        compute();
      });
    };

    compute();

    const ro = new ResizeObserver(() => scheduleCompute());
    ro.observe(headerEl);
    ro.observe(rowEl);
    ro.observe(logoEl);
    if (logoMarkRef.current) ro.observe(logoMarkRef.current);
    if (labNameRef.current) ro.observe(labNameRef.current);
    ro.observe(navEl);
    if (visualRef.current) ro.observe(visualRef.current);

    const htmlObserver = new MutationObserver(() => scheduleCompute());
    htmlObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-text-size', 'data-readable-font', 'data-letter-spacing'],
    });

    // Also react to viewport and font-loading/layout shifts.
    window.addEventListener('resize', scheduleCompute);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      ro.disconnect();
      htmlObserver.disconnect();
      window.removeEventListener('resize', scheduleCompute);
    };
  }, [homeActive, pathname]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 overflow-hidden border-b border-white/20 bg-[linear-gradient(120deg,#20c78a_0%,#1b8abf_48%,#8b7abf_100%)] text-white shadow-xl shadow-primary/20 backdrop-blur-xl"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 transition duration-500"
        style={{
          background: `radial-gradient(circle at ${routeThreadX}% 50%, ${routeAccent}, transparent 34%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/15 dark:bg-slate-950/30"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-1 w-full bg-white/20"
      >
        {tracker.visible ? (
          <div
            className="absolute top-0 h-full rounded-full bg-white/85 shadow-[0_0_28px_rgba(255,255,255,0.5)] transition-[left,width,opacity] duration-500"
            style={{ left: `${tracker.left}px`, width: `${tracker.width}px` }}
          />
        ) : null}
      </div>
      <div className="relative mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-4 top-0 h-px bg-white/25 sm:inset-x-6 lg:inset-x-8"
        />
        <div ref={rowRef} className="relative flex h-18 items-center justify-between py-4">
          <Link
            ref={logoRef}
            href="/"
            data-nav-active={homeActive ? 'true' : undefined}
            className={
              homeActive
                ? 'flex shrink-0 items-center gap-3 transition-transform duration-500 ease-out'
                : 'flex shrink-0 -translate-x-2 items-center gap-3 transition-transform duration-500 ease-out sm:-translate-x-3 lg:-translate-x-4'
            }
          >
            <div ref={logoMarkRef} className="h-14 w-14">
              <Image 
                src="/logoLAB.svg" 
                alt="Maruvka Lab Logo" 
                width={65} 
                height={65}
                className="h-full w-full dark:hidden"
              />
              <Image
                src="/logoLAB3.svg"
                alt="Maruvka Lab Logo"
                width={65}
                height={65}
                className="hidden h-full w-full dark:block"
              />
            </div>
            <div className="leading-tight">
              <div ref={labNameRef} className="text-base font-semibold text-white">{site.name}</div>
              <div className="text-xs text-white/75">{site.institution}</div>
            </div>
          </Link>

          {routeVisual ? (
            <div
              ref={visualRef}
              role="img"
              aria-label={`${routeVisual.label} visual marker`}
              className={
                compact
                  ? 'pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-14 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center'
                  : 'pointer-events-none ml-2 mr-5 hidden h-12 w-16 shrink-0 items-center justify-center xl:flex'
              }
            >
              <div className="relative flex h-12 w-16 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] transition-all duration-500 ease-out">
                <RouteGraphic kind={routeVisual.kind} />
              </div>
            </div>
          ) : null}

          <nav
            ref={navRef}
            aria-hidden={compact ? true : undefined}
            className={
              compact
                ? 'pointer-events-none absolute left-[-9999px] top-[-9999px] flex shrink-0 items-center gap-2 whitespace-nowrap'
                : 'flex shrink-0 items-center gap-2 whitespace-nowrap'
            }
          >
            {site.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  data-nav-active={active ? 'true' : undefined}
                  className={
                    active
                      ? 'relative rounded-full border border-white/70 bg-white px-3 py-2 text-sm font-semibold text-primary shadow-md shadow-slate-900/15'
                      : 'rounded-full px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white'
                  }
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="[&>button]:text-white/80 [&>button:hover]:bg-white/10 [&>button:hover]:text-white [&>button:focus-visible]:ring-white/70">
              <ThemeToggle />
            </div>
            <Link
              href="/open-positions"
              data-nav-active={careerActive ? 'true' : undefined}
              className={
                careerActive
                  ? 'rounded-full bg-white px-4 py-2 text-sm font-semibold text-accent shadow-md shadow-slate-900/15 transition hover:-translate-y-0.5 hover:shadow-lg'
                  : 'rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-accent/95 hover:shadow-lg'
              }
            >
              Careers
            </Link>
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={
              compact
                ? 'rounded-xl border border-white/30 bg-white/15 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/20'
                : 'hidden'
            }
            onClick={() =>
              setMenu((current) => ({
                pathname,
                open: current.pathname === pathname ? !current.open : true,
              }))
            }
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {menuOpen ? (
          <div className="pb-4">
            <div className="rounded-2xl border border-white/25 bg-white/15 p-4 shadow-xl shadow-slate-900/20 backdrop-blur-xl">
              <div className="flex flex-col gap-2">
                {site.nav.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMenu({ pathname, open: false })}
                      className={
                        active
                          ? 'rounded-xl border border-white/70 bg-white px-3 py-2 text-sm font-semibold text-primary'
                          : 'rounded-xl px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white'
                      }
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <div className="mt-2 flex items-center justify-between rounded-xl border border-white/25 px-3 py-2">
                  <span className="text-sm font-medium text-white/80">Theme</span>
                  <div className="[&>button]:text-white/80 [&>button:hover]:bg-white/10 [&>button:hover]:text-white [&>button:focus-visible]:ring-white/70">
                    <ThemeToggle />
                  </div>
                </div>
                <Link
                  href="/open-positions"
                  onClick={() => setMenu({ pathname, open: false })}
                  className={
                    careerActive
                      ? 'mt-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-accent shadow-sm transition hover:shadow-md'
                      : 'mt-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md'
                  }
                >
                  Careers
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
