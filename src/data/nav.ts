// Single source of truth for navigation. Only routes that exist in src/pages may appear here.
export interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us/" },
  {
    label: "Pages",
    children: [
      { label: "Our Services", href: "/services/" },
      { label: "Our Team", href: "/team/" },
      { label: "Pricing Plan", href: "/pricing/" },
    ],
  },
  { label: "Portfolio", href: "/portfolio/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];

export const footerLinks = [
  { label: "About Us", href: "/about-us/" },
  { label: "Service", href: "/services/" },
  { label: "Portfolio", href: "/portfolio/" },
  { label: "Contact", href: "/contact/" },
];

export const footerSupport = [
  { label: "Our Team", href: "/team/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Blog", href: "/blog/" },
  { label: "Home", href: "/" },
];

export const isActive = (href: string, path: string) =>
  href === "/" ? path === "/" : path.startsWith(href);
