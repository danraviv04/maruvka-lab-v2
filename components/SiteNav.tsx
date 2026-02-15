'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { site } from '../content/site';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md shadow-md">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-14 w-14">
              <Image 
                src="/logoLAB.svg" 
                alt="Maruvka Lab Logo" 
                width={65} 
                height={65}
                className="h-full w-full"
              />
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold text-primary">{site.name}</div>
              <div className="text-xs text-muted">{site.institution}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {site.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={
                    active
                      ? 'relative text-sm font-semibold text-primary after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-primary dark:after:bg-primary after:rounded-full'
                      : 'text-sm font-medium text-muted hover:text-primary transition'
                  }
                >
                  {item.name}
                </Link>
              );
            })}
            <ThemeToggle />
            <Link
              href="/open-positions"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Careers
            </Link>
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            className="lg:hidden rounded-xl border-2 border-slate-300 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-text/80 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>

        {open ? (
          <div className="lg:hidden pb-4">
            <div className="rounded-2xl border-2 border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 p-4 shadow-xl">
              <div className="flex flex-col gap-2">
                {site.nav.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={
                        active
                          ? 'rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary'
                          : 'rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-slate-50 dark:hover:bg-slate-800 transition'
                      }
                    >
                      {item.name}
                    </Link>
                  );
                  
                })}
                <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2">
                  <span className="text-sm font-medium text-muted">Theme</span>
                  <ThemeToggle />
                </div>
                <Link
                  href="/open-positions"
                  className="mt-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition"
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
