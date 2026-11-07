/**
 * Sections of the one-page home, in document order.
 *
 * The nav, the scroll-spy and the page itself all read this list, so adding a
 * section means adding one entry here and one component on the page.
 *
 * `deepHref` is the full page that section summarises, if there is one. The
 * home page only previews those; the full lists stay on their own routes.
 */
export type HomeSection = {
  id: string;
  label: string;
  deepHref?: string;
};

export const homeSections: HomeSection[] = [
  { id: 'about', label: 'About', deepHref: '/mission' },
  { id: 'research', label: 'Research', deepHref: '/research' },
  { id: 'publications', label: 'Publications', deepHref: '/publications' },
  { id: 'team', label: 'Team', deepHref: '/team' },
  { id: 'news', label: 'News', deepHref: '/news' },
  { id: 'join', label: 'Contact', deepHref: '/contact' },
];

/** Where the "Join the lab" button points, on every page. */
export const JOIN_SECTION_ID = 'join';

/** Routes that are not part of the one-pager and keep their own nav entry. */
export const secondaryRoutes = [
  { name: 'Tools', href: '/tools' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Collaborators & Funding', href: '/collaborators' },
  { name: 'In Memoriam', href: '/mission' },
  { name: 'Open positions', href: '/open-positions' },
  { name: 'Lab Tools', href: '/lab-tools' },
];
