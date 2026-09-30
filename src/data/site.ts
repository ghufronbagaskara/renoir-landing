// Studio facts used across the site and in structured data.
// Add real contact channels only after the owner confirms them.
export const site = {
  name: "Renoir",
  // Astro's `site` (astro.config.mjs, overridden per stage in alchemy.run.ts until renoir.run is bought).
  url: (import.meta.env.SITE ?? "https://renoir.run").replace(/\/$/, ""),
  whatsapp: null as string | null,
  country: "ID",
  foundingYear: 2026,
};
