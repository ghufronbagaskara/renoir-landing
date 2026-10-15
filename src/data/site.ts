// Studio facts used across the site and in structured data.
// Add real contact channels only after the owner confirms them.
export const site = {
  name: "Katalhys",
  // Intended brand domain; deployment stages may override Astro's site URL.
  url: (import.meta.env.SITE ?? "https://katalhys.com").replace(/\/$/, ""),
  whatsapp: null as string | null,
  country: "ID",
  foundingYear: 2026,
};
