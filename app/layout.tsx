import './globals.css';
import type { Metadata } from 'next';
import { Merriweather, Noto_Sans_Cypro_Minoan, Overlock } from 'next/font/google';
import SiteShell from '../components/SiteShell';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import ThemeProvider from '../components/ThemeProvider';
import { Toaster } from 'sonner';
import { site } from '../content/site';

// The site's text face. It ships one weight (400) and no bold, which is why
// headings stay on Merriweather below.
const cypro = Noto_Sans_Cypro_Minoan({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-cypro',
});
const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});
// Button labels. Overlock ships 400/700/900 and no 600, so the font-semibold
// the buttons carry resolves to 700 — which is the weight they want anyway.
const overlock = Overlock({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-overlock',
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.institution}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    'cancer genomics',
    'computational biology',
    'tumor evolution',
    'liquid biopsy',
    'ctDNA',
    'mutational signatures',
    'statistical inference',
    'cancer prevention',
    'Technion',
    'Maruvka Lab',
  ],
  authors: [{ name: 'Yosef Maruvka' }],
  creator: 'Maruvka Lab',
  metadataBase: new URL('https://www.maruvkalab.com'),
  openGraph: {
    title: site.name,
    description: site.description,
    type: 'website',
    locale: 'en_US',
    url: 'https://www.maruvkalab.com',
    siteName: site.name,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${site.name} - ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = savedTheme || systemTheme;
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${cypro.variable} ${merriweather.variable} ${overlock.variable} bg-background text-text antialiased`}
      >
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white dark:focus:bg-slate-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold font-button focus:text-secondary focus:shadow-soft"
          >
            Skip to content
          </a>
          <AccessibilityToolbar />
          <SiteShell>{children}</SiteShell>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
