/**
 * Everything in the main navigation bar.
 *
 * Two kinds of entry sit side by side. A `section` scrolls to part of the
 * one-page home (and jumps home first when you are on another page); a `page`
 * is an ordinary route. Both appear in the same bar — the lab asked for one
 * set of links rather than a short bar with the rest hidden behind "More".
 */
export type NavEntry =
  | { kind: 'section'; id: string; label: string; deepHref?: string }
  | { kind: 'page'; href: string; label: string };

export const navEntries: NavEntry[] = [
  { kind: 'section', id: 'about', label: 'About', deepHref: '/mission' },
  { kind: 'section', id: 'research', label: 'Research', deepHref: '/research' },
  { kind: 'section', id: 'publications', label: 'Publications', deepHref: '/publications' },
  { kind: 'section', id: 'team', label: 'Team', deepHref: '/team' },
  { kind: 'section', id: 'news', label: 'News', deepHref: '/news' },
  // 'Software' rather than 'Tools': that is the page's own heading, and it
  // keeps the lab's published software distinct from the internal Lab Tools.
  { kind: 'page', href: '/tools', label: 'Software' },
  { kind: 'page', href: '/open-positions', label: 'Open positions' },
  { kind: 'page', href: '/gallery', label: 'Gallery' },
  { kind: 'page', href: '/collaborators', label: 'Collaborators' },
  { kind: 'page', href: '/mission', label: 'In Memoriam' },
  { kind: 'page', href: '/lab-tools', label: 'Lab Tools' },
  // Contact is the full page rather than the home section, because that is
  // where the address, the map and the directions to the lab live.
  { kind: 'page', href: '/contact', label: 'Contact' },
];

/**
 * Sections of the one-page home, in document order. The page itself renders
 * from this, so a section exists even when it has no nav entry of its own.
 */
export const homeSections = [
  { id: 'about', label: 'About', deepHref: '/mission' },
  { id: 'research', label: 'Research', deepHref: '/research' },
  { id: 'publications', label: 'Publications', deepHref: '/publications' },
  { id: 'team', label: 'Team', deepHref: '/team' },
  { id: 'news', label: 'News', deepHref: '/news' },
  { id: 'join', label: 'Contact', deepHref: '/contact' },
];

/** Where the "Join the lab" button points, on every page. */
export const JOIN_SECTION_ID = 'join';

/** Only sections with a nav entry are worth highlighting as you scroll. */
export const spySectionIds = navEntries
  .filter((entry): entry is Extract<NavEntry, { kind: 'section' }> => entry.kind === 'section')
  .map((entry) => entry.id);
