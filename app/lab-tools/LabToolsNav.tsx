'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FlaskConical, CalendarDays, Users, ShoppingCart, FolderOpen, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { href: '/lab-tools', label: 'Home', icon: FlaskConical, exact: true },
  { href: '/lab-tools/bsc', label: 'BSC Scheduler', icon: CalendarDays },
  { href: '/lab-tools/meeting', label: 'Lab Meeting', icon: Users },
  { href: '/lab-tools/procurement', label: 'Procurement', icon: ShoppingCart },
  { href: '/lab-tools/sop', label: 'Protocols', icon: FolderOpen },
];

export default function LabToolsNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
        <Link href="/lab-tools" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FlaskConical className="text-primary-foreground" size={18} />
          </div>
          <span className="font-semibold text-base tracking-tight text-foreground">Lab Tools</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive(href, exact)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="hidden md:inline-flex items-center gap-1.5 ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to main site
        </Link>

        <button
          className="md:hidden ml-auto p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <nav className="flex flex-col p-3 gap-1 bg-card">
              {navItems.map(({ href, label, icon: Icon, exact }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(href, exact)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                ← Back to main site
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
