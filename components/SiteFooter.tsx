import Link from 'next/link';
import Container from './Container';
import { site } from '../content/site';

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-white">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-3">
          <div>
            <div className="text-lg font-semibold text-primary">{site.name}</div>
            <div className="mt-2 text-sm text-text/70">
              {site.institution}
              <br />
              {site.location}
            </div>
            <div className="mt-4 text-sm">
              <a className="font-medium text-primary hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-primary">Quick links</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link className="text-text/70 hover:text-primary" href="/open-positions">
                Open positions
              </Link>
              <Link className="text-text/70 hover:text-primary" href="/publications">
                Publications
              </Link>
              <Link className="text-text/70 hover:text-primary" href="/tools">
                Software
              </Link>
              <Link className="text-text/70 hover:text-primary" href="/collaborators">
                Collaborators
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-primary">Affiliations</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {site.affiliations.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-text/70"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-black/5 py-6 text-xs text-text/60 md:flex-row">
          <div>© {new Date().getFullYear()} {site.name}. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link className="hover:text-primary" href="/contact">
              Contact
            </Link>
            <Link className="hover:text-primary" href="/mission">
              Mission
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
