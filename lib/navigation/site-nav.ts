export type NavLabelKey =
  | 'home'
  | 'about'
  | 'aboutOverview'
  | 'reports'
  | 'getInvolved'
  | 'mentorship'
  | 'mentors'
  | 'donate'
  | 'eventsNews'
  | 'contact';

type NavLinkDef = {key: NavLabelKey; href: string};
type NavGroupDef = {key: NavLabelKey; children: NavLinkDef[]};
type NavItemDef = NavLinkDef | NavGroupDef;

export type NavLink = {key: string; label: string; href: string};
export type NavGroup = {key: string; label: string; children: NavLink[]};
export type NavItem = NavLink | NavGroup;

const links = {
  home: {key: 'home', href: '/'},
  aboutOverview: {key: 'aboutOverview', href: '/about'},
  reports: {key: 'reports', href: '/about/reports'},
  mentorship: {key: 'mentorship', href: '/get-involved/mentorship'},
  mentors: {key: 'mentors', href: '/get-involved/mentors'},
  donate: {key: 'donate', href: '/get-involved/donate'},
  eventsNews: {key: 'eventsNews', href: '/events-news'},
  contact: {key: 'contact', href: '/contact'},
} satisfies Record<string, NavLinkDef>;

export const PRIMARY_NAV: NavItemDef[] = [
  links.home,
  {key: 'about', children: [links.aboutOverview, links.reports]},
  {key: 'getInvolved', children: [links.mentorship, links.mentors, links.donate]},
  links.eventsNews,
  links.contact,
];

export const FOOTER_EXPLORE: NavLinkDef[] = [links.home, links.aboutOverview, links.reports, links.eventsNews, links.contact];
export const FOOTER_GET_INVOLVED: NavLinkDef[] = [links.mentorship, links.mentors, links.donate];

export function resolveNav(defs: NavLinkDef[], t: (key: NavLabelKey) => string): NavLink[];
export function resolveNav(defs: NavItemDef[], t: (key: NavLabelKey) => string): NavItem[];
export function resolveNav(defs: NavItemDef[], t: (key: NavLabelKey) => string): NavItem[] {
  return defs.map((def) =>
    'children' in def
      ? {key: def.key, label: t(def.key), children: def.children.map((child) => ({key: child.key, label: t(child.key), href: child.href}))}
      : {key: def.key, label: t(def.key), href: def.href},
  );
}

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'children' in item;
}

const pathOf = (href: string) => href.split(/[?#]/)[0];

/** Exact match → aria-current="page". `pathname` is locale-less (from next-intl usePathname). */
export function isCurrent(pathname: string, href: string): boolean {
  return pathOf(href) === pathname;
}

/** Section match for visual highlighting (e.g. an article under /events-news). */
export function isWithin(pathname: string, href: string): boolean {
  const path = pathOf(href);
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}
