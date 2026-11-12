// Studio facts used across the site and in structured data.
// Add real contact channels only after the owner confirms them.
export const site = {
  name: "Katalhys",
  // Intended brand domain; deployment stages may override Astro's site URL.
  url: (import.meta.env.SITE ?? "https://katalhys.com").replace(/\/$/, ""),
  whatsapp: null as string | null,
  /** Public contact email, if the owner publishes one. */
  email: null as string | null,
  country: "ID",
  foundingYear: 2026,
  /**
   * Registered business identity (PT/CV, NIB, address). Each line renders in the footer, legal pages and
   * structured data only once filled in, so no placeholder reaches public HTML. Fill before launch.
   */
  legal: {
    entity: null as string | null,
    nib: null as string | null,
    address: null as string | null,
  },
  /** Bug fixing window after launch, in days (owner decision 2026-11-13). */
  bugFixDays: 30,
  /** How long lead records are kept after the last contact, in months. Pending owner approval. */
  leadRetentionMonths: 24,
};
