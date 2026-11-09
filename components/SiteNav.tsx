'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
import TechnionMark from './TechnionMark';
import ThemeToggle from './ThemeToggle';
import { useSectionSpy } from './useSectionSpy';
import { JOIN_SECTION_ID, navEntries, spySectionIds } from '@/lib/sections';
import { scrollToHash, scrollToSection } from '@/lib/scroll-to-section';
import { site } from '@/content/site';

const NO_SECTIONS: string[] = [];

export default function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  // Tying the open state to a pathname closes the menu on navigation without
  // an effect that would re-render every route change.
  const [menu, setMenu] = useState({ pathname: '', open: false });
  const menuOpen = menu.open && menu.pathname === pathname;
  const closeMenu = () => setMenu({ pathname, open: false });

  // A fresh [] each render would retrigger the spy's effect every time.
  const activeSection = useSectionSpy(isHome ? spySectionIds : NO_SECTIONS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Arriving at /#team from another page, and the Back button. Neither is
  // handled by the browser here: the smooth-scroll animation it would start
  // gets cancelled by the page settling, so we place the scroll ourselves.
  useEffect(() => {
    if (!isHome) return;

    if (window.location.hash) scrollToHash(window.location.hash);

    const onPopState = () => scrollToHash(window.location.hash);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [isHome]);

  // At the top of the home page the bar sits directly above the hero and
  // takes its colouring, so the two read as one block.
  const overHero = isHome && !scrolled && !menuOpen;

  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  /**
   * On the home page, scroll rather than let the browser jump. Pushing the
   * hash afterwards keeps Back working and means clicking the same link twice
   * still scrolls — the browser does nothing when the hash is unchanged.
   */
  const onSectionClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!isHome || event.metaKey || event.ctrlKey || event.shiftKey) return;

    event.preventDefault();
    closeMenu();
    scrollToSection(id);

    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const linkClasses = (active: boolean) =>
    `rounded-full px-2 py-1.5 text-[13px] font-medium whitespace-nowrap transition ${
      active
        ? 'bg-primary/12 text-primary'
        : overHero
          ? 'text-slate-200 hover:bg-white/10 hover:text-white'
          : 'text-muted hover:bg-slate-100 hover:text-text dark:hover:bg-slate-800'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        overHero
          ? 'border-b border-white/10 bg-slate-950/80 backdrop-blur-md dark:bg-slate-950/80'
          : 'border-b border-slate-200 bg-background/85 backdrop-blur-md dark:border-slate-800'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2.5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          aria-label={`${site.name} home`}
        >
          <TechnionMark onDark={overHero} className="hidden shrink-0 sm:flex" />

          <Image
            src="/lab-logo.webp"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full"
            priority
          />

          {/* Hidden below 2xl: eleven nav items need the room more than this does. */}
          <span className="hidden min-[1600px]:block">
            <span
              className={`block text-sm font-semibold leading-tight ${
                overHero ? 'text-white' : 'text-text'
              }`}
            >
              {site.name}
            </span>
            <span
              className={`block text-[11px] leading-tight ${
                overHero ? 'text-slate-300' : 'text-muted'
              }`}
            >
              Israel Institute of Technology
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-0.5 xl:flex">
          {navEntries.map((entry) =>
            entry.kind === 'section' ? (
              <a
                key={entry.id}
                href={sectionHref(entry.id)}
                onClick={(event) => onSectionClick(event, entry.id)}
                aria-current={isHome && activeSection === entry.id ? 'true' : undefined}
                className={linkClasses(isHome && activeSection === entry.id)}
              >
                {entry.label}
              </a>
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                aria-current={pathname === entry.href ? 'page' : undefined}
                className={linkClasses(pathname === entry.href)}
              >
                {entry.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <a
            href={sectionHref(JOIN_SECTION_ID)}
            onClick={(event) => onSectionClick(event, JOIN_SECTION_ID)}
            className={`group hidden items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold whitespace-nowrap transition sm:inline-flex ${
              overHero
                ? 'border-white/40 text-white hover:border-white hover:bg-white/10'
                : 'border-primary/40 text-primary hover:border-primary hover:bg-primary/10'
            }`}
          >
            <span>Join the lab</span>
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
              ↗
            </span>
          </a>

          <button
            type="button"
            onClick={() => setMenu({ pathname, open: !menuOpen })}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition xl:hidden ${
              overHero
                ? 'border-white/40 text-white'
                : 'border-slate-300 text-text dark:border-slate-700'
            }`}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="site-menu"
          className="border-t border-slate-200 bg-background px-5 py-4 xl:hidden dark:border-slate-800"
        >
          <nav aria-label="Main" className="grid gap-0.5">
            {navEntries.map((entry) =>
              entry.kind === 'section' ? (
                <a
                  key={entry.id}
                  href={sectionHref(entry.id)}
                  onClick={(event) => onSectionClick(event, entry.id)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-text transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {entry.label}
                </a>
              ) : (
                <Link
                  key={entry.href}
                  href={entry.href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-text transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {entry.label}
                </Link>
              ),
            )}
          </nav>

          <a
            href={sectionHref(JOIN_SECTION_ID)}
            onClick={(event) => onSectionClick(event, JOIN_SECTION_ID)}
            className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            <span>Join the lab</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      ) : null}
    </header>
  );
}
