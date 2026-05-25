'use client';

import { usePathname } from 'next/navigation';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLabTools = pathname.startsWith('/lab-tools');

  return (
    <>
      {!isLabTools && <SiteNav />}
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      {!isLabTools && <SiteFooter />}
    </>
  );
}
