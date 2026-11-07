'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import TechnionMark from './TechnionMark';
import ThemeToggle from './ThemeToggle';
import { useSectionSpy } from './useSectionSpy';
import { JOIN_SECTION_ID, homeSections, secondaryRoutes } from '@/lib/sections';
import { site } from '@/content/site';

const SECTION_IDS = homeSections.map((section) => section.id);

export default function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  // Tying the open state to a pathname closes the menu on navigation without
  // an effect that would re-render every route change.
  const [menu, setMenu] = useState({ pathname: '', open: false });
  const menuOpen = menu.open && menu.pathname === pathname;
  const closeMenu = () => setMenu({ pathname, open: false });

  // Only spy on sections that actually exist on this page.
  const activeSection = useSectionSpy(isHome ? SECTION_IDS : []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // At the top of the home page the bar sits directly above the always-dark
  // hero, so it takes the hero's colour and reads as one block with it. It
  // cannot be transparent: the bar is in normal flow rather than over the
  // hero, so in light mode transparency would put white text on a white page.
  const overHero = isHome && !scrolled && !menuOpen;

  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        overHero
          ? 'bg-slate-950'
          : 'border-b border-slate-200 bg-background/85 backdrop-blur-md dark:border-slate-800'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          aria-label={`${site.name} home`}
        >
          <TechnionMark onDark={overHero} className="hidden shrink-0 sm:flex" />

          <Image
            src="/lab-logo.webp"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full"
            priority
          />

          <span className="hidden md:block">
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

        <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
          {homeSections.map((section) => {
            const active = isHome && activeSection === section.id;

            return (
              <a
                key={section.id}
                href={sectionHref(section.id)}
                aria-current={active ? 'true' : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-primary/12 text-primary'
                    : overHero
                      ? 'text-slate-200 hover:bg-white/10 hover:text-white'
                      : 'text-muted hover:bg-slate-100 hover:text-text dark:hover:bg-slate-800'
                }`}
              >
                {section.label}
              </a>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <a
            href={sectionHref(JOIN_SECTION_ID)}
            className={`group hidden items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition sm:inline-flex ${
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
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition lg:hidden ${
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
          className="border-t border-slate-200 bg-background px-6 py-5 lg:hidden dark:border-slate-800"
        >
          <nav aria-label="Sections" className="grid gap-1">
            {homeSections.map((section) => (
              <a
                key={section.id}
                href={sectionHref(section.id)}
                onClick={closeMenu}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-text transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {section.label}
              </a>
            ))}
          </nav>

          <p className="mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
            More
          </p>
          <nav aria-label="More pages" className="mt-1 grid gap-1">
            {secondaryRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-2.5 text-sm text-muted transition hover:bg-slate-100 hover:text-text dark:hover:bg-slate-800"
              >
                {route.name}
              </Link>
            ))}
          </nav>

          <a
            href={sectionHref(JOIN_SECTION_ID)}
            onClick={closeMenu}
            className="mt-5 flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            <span>Join the lab</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      ) : null}
    </header>
  );
}
