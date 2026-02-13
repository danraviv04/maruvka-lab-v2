import './globals.css';
import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import { site } from '../content/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.institution}`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  metadataBase: new URL('https://www.maruvkalab.com'),
  openGraph: {
    title: site.name,
    description: site.tagline,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} bg-background text-text antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary focus:shadow-soft"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" className="min-h-[60vh]">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
