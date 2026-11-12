import { services } from "~/content/services";
import { child, path, t, type Locale } from "~/i18n";

export interface NavChild {
  label: string;
  href: string;
  /** One-line description shown in the desktop dropdown panel. */
  body?: string;
}
export interface NavItem {
  label: string;
  /** A parent with href stays a real link; its panel opens on hover/focus. */
  href?: string;
  children?: NavChild[];
}

// Single source of truth for the header and offcanvas menus.
export function nav(locale: Locale): NavItem[] {
  const n = t(locale).nav;
  const serviceLinks = [...services]
    .sort((a, b) => a.order - b.order)
    .map((s) => {
      const copy = locale === "en" ? s.en : s.id_;
      return { label: copy.title, href: child("services", locale, copy.slug), body: copy.tagline };
    });
  return [
    { label: n.home, href: path("home", locale) },
    { label: n.services, href: path("services", locale), children: [...serviceLinks, { label: n.allServices, href: path("services", locale) }] },
    { label: n.work, href: path("work", locale) },
    {
      label: n.resources,
      children: [
        { label: n.start, href: path("start", locale), body: n.startBody },
        { label: n.howWeWork, href: path("howWeWork", locale), body: n.howWeWorkBody },
        { label: n.process, href: path("process", locale), body: n.processBody },
        { label: n.notes, href: path("notes", locale), body: n.notesBody },
      ],
    },
    { label: n.about, href: path("about", locale) },
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
