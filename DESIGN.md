# Renoir visual direction

Status: working direction for the local phase-2 site, not a final brand identity.

## Positioning

Renoir connects identity, interface, websites, business systems, and the infrastructure that keeps them running. The visual system should feel deliberate and capable, not like a generic agency template. English and Indonesian copy may use different phrasing as long as they land the same business idea.

## Design system

- Base: near-black ink (`#17191c`), cool paper (`#f5f7fb`), and one cobalt signal (`#1d4ed8`). Cobalt marks focus, selected filters, the persistent contact action, and small identity details; no secondary accent competes with it.
- Type: GeneralSans for display, Inter for body. These are already bundled, preload/fallback-tuned, and part of the existing performance budget; revisit only with measured evidence.
- Layout: generous horizontal margins, clear section starts, smaller service headlines, readable measure, and low-density cards. No decorative text should compete with the offer.
- Motion: desktop retains one-time GSAP reveals and lightweight parallax; phones use native one-time element reveals and do not download GSAP for them. UI motion uses `cubic-bezier(.16, 1, .3, 1)` and only animates transform/opacity. The contact signal pulses briefly every seven seconds and all non-essential motion stops under reduced motion. Avoid pinning or scroll-jacking.
- Navigation: Home pill stays floating while scrolling; inner-page header remains simple. A contact CTA persists on every page. All service rows show a clear link affordance on hover and focus.
- Proof: Work presents eight projects completed by the Renoir founder. Credit the actual role, use real screens, and avoid unverified results or metrics. Internal screens must use dummy data or redact private details.
- Brand mark: The Joint is a three-plane, single-colour SVG symbol used beside the Renoir wordmark in the header, menu, and footer. The same geometry forms the favicon. Raster explorations are retained in `docs/brand/`; `src/components/ui/BrandMark.astro` and `public/favicon.svg` are the production drawings.
- Photography: physically plausible porcelain, paper, brushed metal, and ink still lifes supply character, while only actual Work screenshots demonstrate product outcomes. Do not use generated people, mock interfaces, offices, or server rooms. The source brief, prompts, and crop roles are in `docs/brand/editorial-image-system.md`.

## Component direction

- Search: native centered command-palette dialog on desktop, bottom sheet on mobile, with service paths and recent Notes before a query.
- About: an editorial porcelain still life supports the name story; it is an illustration, not historical evidence. The Joint appears as a small maker's mark in the adjacent story card. The fit list gives prospects three good-fit and three poor-fit conditions, followed by a consultation link.
- Home: one wide editorial hero and one separately composed portrait share the same crafted junction. The problem section uses contained MAXY AI and Order & Field Sales screenshots. The four-stage process uses a light SVG sequence of The Joint rather than a meeting photograph.
- Services: each row receives an ink field on hover or keyboard focus, with white copy and a visible cobalt arrow. The engagement section follows as a compact two-column composition on large screens, with its introduction to the left and four choices to the right.
- Service detail: each offer has its own material photograph. Supporting screens are contained real Work pairs with descriptive alt text and captions; deployment has one honest architecture diagram until a safe Komodo capture exists.
- Engagements: four divided service rows, not a 2×2 pricing grid; the expanded row holds scope details and its CTA. Dividing lines reveal once when in view; the details height is not animated.
- Home motion: process stages and the image reveal once with transform and opacity. Four founder projects rotate through the home slider in the order Order & Field Sales, MAXY AI, Industrial Coatings, Deployment & Operations; three cards are visible on wide desktop, with a pause control and reduced-motion fallback. The Work page's three featured projects remain separate.
- Work: three equal featured cards and the two-column catalog use a consistent 9:5 desktop-and-phone composition. Both screens remain visible without cropping. Detail pages use a solid dark header above a light canvas, then a compact breadcrumb, title, and two full-resolution screens side by side; on phones they stack. Context leads into numbered feature stories with real supporting screens, then role, services, and a consultation CTA. Screens can be opened at full size. On narrow Work details, the global floating CTA is hidden so it does not cover the screen captions; the page's own consultation CTA remains. Paper, ink, and one cobalt signal frame the source UI without redrawing it.
- Notes: two-column reading grid with one sticky utility rail on desktop; single-column flow on smaller screens. Each article has one distinct editorial master, cropped for article, list, card, and sidebar roles. ID and EN use the same master.
- Shared surfaces: breadcrumb and footer use ink and The Joint geometry, with no repeated stock photo or texture request. Locale OG artwork is generated from the production symbol and exact text.

## Review gates

Before launch, review the new editorial assets and logo, provide a WhatsApp contact-center number, verify domain and contact details, and obtain permission for every public client/proof asset. Keep Lighthouse mobile performance ≥95, CLS 0, and TBT <100 ms. A local mobile pass after native phone reveals measured 87 / 0 / 270 ms. ScrollTrigger no longer loads on phones; the remaining long task is dominated by style/layout work from the template.

## Last updated

- 2026-09-29 — Added editorial material imagery for Home, About, four services, and three Notes; replaced shared stock backgrounds with SVG/CSS, paired real Work screens with service copy, and documented master-to-WebP production.
- 2026-09-29 — Expanded eight Work studies with feature stories and source screens; established intact desktop/mobile pairs, full-size image access, and consistent 9:5 cards.
- 2026-09-29 — Integrated The Joint mark and editorial About image; refined Services, About fit, and home process motion; specified a separate four-project home carousel and compact portrait support screens.
- 2026-09-28 — Replaced concept Work direction with founder project studies, responsive screenshot art direction, and a shorter, context-first detail layout.
- 2026-09-22 — Replaced brick-red with the cobalt signal system; documented command search, service rail, concept Work, Notes rail, and The Joint logo exploration.
