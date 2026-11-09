import Link from 'next/link';
import Container from './Container';
import { site } from '../content/site';

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-emerald-200/70 dark:border-slate-700 bg-white dark:bg-slate-900">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-3">
          <div>
            <div className="text-lg font-semibold text-secondary">{site.name}</div>
            <div className="mt-2 text-sm text-muted">
              {site.institution}
              <br />
              {site.location}
            </div>
            <div className="mt-4 text-sm">
              <a className="font-medium text-secondary hover:text-secondary hover:underline transition" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-secondary">Quick links</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link className="text-muted hover:text-secondary hover:underline transition" href="/open-positions">
                Open positions
              </Link>
              <Link className="text-muted hover:text-secondary hover:underline transition" href="/publications">
                Publications
              </Link>
              <Link className="text-muted hover:text-secondary hover:underline transition" href="/tools">
                Software
              </Link>
              <Link className="text-muted hover:text-secondary hover:underline transition" href="/collaborators">
                Collaborators
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-secondary">Affiliations</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {site.affiliations.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-muted"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-700 py-6 text-xs text-muted md:flex-row">
          <div>© {new Date().getFullYear()} {site.name}. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link className="hover:text-secondary" href="/research">
              Research
            </Link>
            <Link className="hover:text-secondary transition" href="/contact">
              Contact
            </Link>
            <Link className="hover:text-secondary transition" href="/open-positions">
              Careers
            </Link>
            <Link className="hover:text-secondary transition" href="/admin/news">
              News admin
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
