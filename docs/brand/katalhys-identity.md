# Katalhys identity

Selected by the owner on 2026-10-15 for implementation and local review. Co-owner approval is pending before launch. The current direction combines the flowing logo 09 (Midnight + Cyan) with the explicitly confirmed Cobalt + Ink website palette, replacing the earlier stepped mark.

## Palette

| Role | Color | Use |
| --- | --- | --- |
| Primary | `#1D4ED8` | Primary actions, links, cobalt sections |
| Accent | `#DBEAFE` | Soft emphasis and focus on cobalt surfaces |
| Text | `#17191C` | Body/headings on light surfaces |
| Secondary | `#596273` | Supporting text on light surfaces |
| Background | `#FFFFFF` | Page canvas |
| Panel | `#EEF2F8` | Supporting panels |

Primary buttons use white text on cobalt, with a darker cobalt hover state. Inverse buttons on cobalt sections use white backgrounds and cobalt text. The logo separately retains navy `#173E72`, cyan `#64D6F2`, and a blue transition between them. These gradients stay inside the symbol; white and monochrome versions have no gradients. Existing `renoir-*` CSS names remain internal compatibility names. Error states retain a distinct red.

## Logo

Two curved fields form an open flowing channel. This is the central meaning: opening a path so businesses can move forward. The shape relates to making complex processes easier to run, from websites that help customers find services to systems that connect work across departments. It represents Katalhys adapting design and engineering to how a business works. This interpretation does not promise business results or worldwide visual uniqueness.

- `src/data/brand.ts`: shared paths, website palette, and `brandArtwork()` gradient/variant rendering
- `src/components/ui/BrandMark.astro`: color, white, and current-color variants
- `public/brand/katalhys-symbol.svg`: navy/cyan gradient symbol, transparent background
- `public/brand/katalhys-symbol-white.svg`: both parts white, transparent background
- `public/brand/katalhys-symbol-mono.svg`: both parts ink, transparent background
- `public/favicon.svg` and `public/favicon.png`: color symbol inside an opaque white square with padding
- `public/apple-touch-icon.png`: opaque white 180px touch icon

Run `bun run brand:assets` after changing geometry or palette. Keep SCSS tokens in `_site.scss` and `utils/_colors.scss` aligned with `brandColors`. Keep the symbol proportionate; do not stretch, add cast shadows, or close the internal opening. Keep the name beside it in the header, menu, and footer. Inline SVGs use unique gradient IDs to avoid collisions when multiple marks appear on a page. The white version retains the opening as transparent negative space. Favicon and touch-icon links include `?v=09` to refresh cached earlier marks.

## Website scope

Both languages use Katalhys in visible brand names, metadata, structured data, search, and AI-readable summaries. The About name paragraph describes the catalyst role and the selected symbol's open path. Other approved service copy is preserved. Pronunciation guidance and the former painter origin story have been removed.

`bun run images:editorial` composites the shared SVG and bundled GeneralSans lettering onto existing blank photographic masters, refreshes explanatory Notes diagrams, and produces `public/og/katalhys-en.jpg` and `katalhys-id.jpg`. Actual Work screens remain authentic project proof.

The intended canonical fallback is `https://katalhys.com`. Cloudflare resource names, credentials, bindings, and deployment stages remain unchanged. Domain ownership, DNS, Turnstile domains, and co-owner approval must be resolved before deployment. Historical Renoir promotional material remains outside this website rebrand.

## Current local validation on 2026-10-15

- `bun run brand:assets` and `bun run images:editorial`: regenerated logo variants, icons, campaign artwork, localized diagrams, and OG images
- `bun test`: 9 tests passed; `bun run check`: 0 errors, 0 warnings, 4 existing hints
- `bun run build`, `check:links`, and `check:copy`: passed on all 45 built pages
- Browser review: all 45 pages at 390, 768, and 1440px, totaling 135 checks without horizontal overflow, broken images, browser errors, duplicate gradient IDs, or unresolved gradient references
- Mobile menu, Escape dismissal, Pagefind search, no-JavaScript homepage, and the missing-route 404 response passed
- Primary action computed styles matched cobalt backgrounds and white text; logo variants, campaign artwork, and locale OG output were visually reviewed
- Every editorial WebP and exported SVG decoded; the favicon was opaque with a white corner, and the white symbol retained its transparent channel

The 404 action was moved outside the heading-decoration wrapper after the review exposed mobile overflow. No production deployment, live Worker contact submission, or new Lighthouse performance measurement was performed.

## Earlier local validation on 2026-10-15

- `bun test`: 9 tests passed
- `bun run check`: 0 errors, 0 warnings, 4 existing hints in promo/optimization sources
- `bun run build`, `check:links`, and `check:copy`: passed on 45 pages
- Browser review: 60 EN/ID route and viewport combinations at 390, 768, and 1440px, with no horizontal overflow, broken images, or browser errors
- Mobile menu and Pagefind search passed; homepage identity and heading remained visible without JavaScript
- All shipped editorial WebPs and SVG exports decoded; favicon pixels were fully opaque with a white corner
- Header/footer logo variants and the earlier action colors were checked in computed styles and screenshots

The pipeline writes completed binary assets to a sibling temporary file and renames them into place, avoiding Windows locks encountered when overwriting images directly. No production deployment or live form submission was performed. This review does not establish site-wide Core Web Vitals or trademark uniqueness.
