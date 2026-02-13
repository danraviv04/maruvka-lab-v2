'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Container from './Container';
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
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <Container>
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
              <div className="text-xs text-text/70">{site.institution}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {site.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={
                    active
                      ? 'text-sm font-semibold text-primary'
                      : 'text-sm font-medium text-text/70 hover:text-primary'
                  }
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              href="/open-positions"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-primary/90"
            >
              Join
            </Link>
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            className="md:hidden rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold text-text/80"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>

        {open ? (
          <div className="md:hidden pb-4">
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-soft">
              <div className="flex flex-col gap-2">
                {site.nav.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={
                        active
                          ? 'rounded-xl bg-primary/5 px-3 py-2 text-sm font-semibold text-primary'
                          : 'rounded-xl px-3 py-2 text-sm font-medium text-text/80 hover:bg-black/5'
                      }
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <Link
                  href="/open-positions"
                  className="mt-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white"
                >
                  Join
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
