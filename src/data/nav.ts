import { services } from "~/content/services";
import { child, path, t, type Locale } from "~/i18n";

export interface NavChild {
  label: string;
  href: string;
  /** One-line benefit shown in the desktop panel and Home quick paths. */
  body?: string;
  /** Font Awesome glyph class (literal `fa-*` so `icons:subset` finds it). */
  icon?: string;
  badge?: string;
}
export interface NavPanel {
  /** Guiding question at the top of the desktop panel. */
  kicker: string;
  featured: { title: string; body: string; cta: string; href: string; icon: string };
  links: { label: string; href: string; icon: string }[];
}
export interface NavItem {
  label: string;
  /** Every top-level item is a real link; its panel opens on hover/focus. */
  href: string;
  children?: NavChild[];
  panel?: NavPanel;
  /** Shown in the offcanvas only (the logo already links home on desktop). */
  mobileOnly?: boolean;
}

const serviceIcons: Record<string, string> = {
  "marketing-sites": "fa-browser",
  "internal-systems": "fa-diagram-project",
  "uiux-identity": "fa-pen-ruler",
  "deployment-care": "fa-server",
};

/** The four services with their benefit line, icon and badge. Shared by the menu and Home. */
export function serviceLinks(locale: Locale): NavChild[] {
  const n = t(locale).nav;
  return [...services]
    .sort((a, b) => a.order - b.order)
    .map((s) => {
      const copy = locale === "en" ? s.en : s.id_;
      return {
        label: copy.title,
        href: child("services", locale, copy.slug),
        body: n.serviceLines[s.id as keyof typeof n.serviceLines],
        icon: serviceIcons[s.id],
        badge: s.id === "internal-systems" ? n.aiBadge : undefined,
      };
    });
}

// Single source of truth for the header and offcanvas menus.
export function nav(locale: Locale): NavItem[] {
  const n = t(locale).nav;
  const start = { title: n.featuredTitle, body: n.featuredBody, cta: n.featuredCta, href: path("start", locale), icon: "fa-compass" };
  return [
    { label: n.home, href: path("home", locale), mobileOnly: true },
    {
      label: n.services,
      href: path("services", locale),
      children: serviceLinks(locale),
      panel: {
        kicker: n.servicesKicker,
        featured: start,
        links: [
          { label: n.allServices, href: path("services", locale), icon: "fa-arrow-right" },
          { label: n.howWeWorkShort, href: path("howWeWork", locale), icon: "fa-shield-check" },
        ],
      },
    },
    { label: n.work, href: path("work", locale) },
    {
      label: n.resources,
      href: path("notes", locale),
      children: [
        { label: n.start, href: path("start", locale), body: n.startBody, icon: "fa-compass", badge: n.startBadge },
        { label: n.howWeWork, href: path("howWeWork", locale), body: n.howWeWorkBody, icon: "fa-shield-check" },
        { label: n.process, href: path("process", locale), body: n.processBody, icon: "fa-list-check" },
        { label: n.notes, href: path("notes", locale), body: n.notesBody, icon: "fa-book-open" },
      ],
      panel: {
        kicker: n.resourcesKicker,
        featured: { title: n.workFeatureTitle, body: n.workFeatureBody, cta: n.workFeatureCta, href: path("work", locale), icon: "fa-window" },
        links: [{ label: n.cta, href: path("contact", locale), icon: "fa-arrow-right" }],
      },
    },
    { label: n.about, href: path("about", locale) },
  ];
}

export function footerLinks(locale: Locale) {
  const n = t(locale).nav;
  const f = t(locale).footer;
  return {
    studio: [
      { label: n.services, href: path("services", locale) },
      { label: n.process, href: path("process", locale) },
      { label: n.work, href: path("work", locale) },
      { label: n.aboutRenoir, href: path("about", locale) },
    ],
    more: [
      { label: n.start, href: path("start", locale) },
      { label: n.howWeWork, href: path("howWeWork", locale) },
      { label: n.notes, href: path("notes", locale) },
      { label: n.cta, href: path("contact", locale) },
    ],
    legal: [
      { label: f.privacy, href: path("privacy", locale) },
      { label: f.terms, href: path("terms", locale) },
      { label: f.cookies, href: path("cookies", locale) },
    ],
  };
}

export const isActive = (href: string, current: string, homeHref: string) =>
  href === homeHref ? current === homeHref : current.startsWith(href);
