import { path, t, type Locale } from "~/i18n";

export interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

// Single source of truth for the header and offcanvas menus.
export function nav(locale: Locale): NavItem[] {
  const n = t(locale).nav;
  return [
    { label: n.home, href: path("home", locale) },
    { label: n.services, href: path("services", locale) },
    { label: n.process, href: path("process", locale) },
    { label: n.work, href: path("work", locale) },
    { label: n.about, href: path("about", locale) },
    { label: n.notes, href: path("notes", locale) },
  ];
}

export function footerLinks(locale: Locale) {
  const n = t(locale).nav;
  return {
    studio: [
      { label: n.services, href: path("services", locale) },
      { label: n.process, href: path("process", locale) },
      { label: n.work, href: path("work", locale) },
      { label: n.aboutRenoir, href: path("about", locale) },
    ],
    more: [
      { label: n.notes, href: path("notes", locale) },
      { label: n.cta, href: path("contact", locale) },
    ],
  };
}

export const isActive = (href: string, current: string, homeHref: string) =>
  href === homeHref ? current === homeHref : current.startsWith(href);
