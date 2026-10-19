# Katalhys visual direction

Status: selected flowing logo 09 and confirmed Cobalt + Ink website palette applied to the local site on 2026-10-15. Co-owner approval remains pending. See `docs/brand/katalhys-identity.md` for assets and usage.

## Positioning

Katalhys connects identity, interface, websites, business systems, and the infrastructure that keeps them running. The name draws on the role of a catalyst, helping businesses remove obstacles through design and technology. English and Indonesian copy may use different phrasing as long as they land the same business idea.

## Design system

- Website palette: cobalt (`#1D4ED8`), ice (`#DBEAFE`), ink (`#17191C`), muted text (`#596273`), white (`#FFFFFF`), and panel (`#EEF2F8`). Cobalt anchors primary actions and dark sections. Use white text on cobalt actions and cobalt text on inverse white actions. The selected logo keeps its own midnight blue (`#173E72`) and cyan (`#64D6F2`) gradient; white logo variants belong on dark surfaces.
- Type: GeneralSans for display, Inter for body. These are already bundled, preload/fallback-tuned, and part of the existing performance budget; revisit only with measured evidence.
- Layout: generous horizontal margins, clear section starts, smaller service headlines, readable measure, and low-density cards. No decorative text should compete with the offer.
- Motion: headings and reading text stay static. Process diagrams draw strokes once; engagement/fit dividers orient readers; interaction feedback remains contextual. Projects crossfade in place over 500ms with a stable stage height. Video and service wheel carry expressive motion; reduced motion retains static content. No GSAP or character entrance download.
- Navigation: separate Katalhys wordmark and right-hand floating white pill. The logo has no white backing; its wordmark becomes ink after the hero. Phones use one rounded search/Menu group with no individual button outlines; language switching lives in the offcanvas. Inner headers begin on ink and adopt the floating composition after scrolling.
- Proof: Work presents eight projects completed by the Katalhys founder. Credit the actual role, use real screens, and avoid unverified results or metrics. Internal screens must use dummy data or redact private details.
- Brand mark: logo 09 has two curved fields around an open flowing channel. It expresses opening a path so businesses can move forward. Geometry and gradients live in `src/data/brand.ts`; `brandArtwork()` supplies the site, exported SVGs, campaign artwork, and white-background favicon. Inline gradient IDs are unique. Keep the wordmark beside the symbol in navigation and footer; symbol-only uses include watermarks and the favicon.
- Imagery: the Home hero uses the owner's monochrome particle-wave video, locally transcoded to H.264 with WebP poster fallbacks. The owner-approved service wheel uses four conceptual 3D illustrations in white, ink and cobalt plus five real project thumbnails. These illustrations are service artwork; only real Work screenshots demonstrate delivered software. Generated people, fake product screens and offices remain prohibited. Earlier campaign assets remain archived. Home prompts and source: `docs/design/home-refresh/README.md`; campaign history: `docs/brand/editorial-image-system.md`.

## Component direction

- Phone service detail: the overview keeps the ring; service selection shows one 140×110 illustration, full copy and a separate accessible detail link. Perspective drum motion is desktop-only in the selected state.

- Mobile refinement (2026-10-19): 16px gutters, 24px section padding, 22px section headings, 12–14px explanatory copy and 44px controls. Reflow the content for a phone instead of stacking desktop-sized blocks. The Problem canvas keeps three sources side by side; benefits use a small artwork/caption row and compact full explanations. Home services expose four choices in two columns; selected detail uses a shorter stage. Work keeps its core story visible with optional approach/service details. Process uses native stage disclosures. The shared CTA follows main content; service form labels remain visible with 16px field text. Work/Notes retain two-column catalogues. Live-reference research, one-screen budgets and limits: `docs/design/mobile/section-density.md`. ENERGY 2 / RHYTHM 2 / MOTION 2 within the existing identity.

- Search: native centered command-palette dialog on desktop, bottom sheet on mobile, with service paths and recent Notes before a query. Search covers services, Work, Notes and public pages through Pagefind, with a content-catalog fallback in development or when the index fails.
- About: the breadcrumb heading is About / Tentang. Real founder-project software screens accompany the catalyst name story. The Katalhys symbol appears beside the name without pronunciation guidance. The fit list gives prospects three good-fit and three poor-fit conditions, followed by a consultation link.
- Home: a dark video hero positions the existing two-line headline and two actions near the bottom, with a dark scrim for legibility; the three engagement statements are removed. GeneralSans/Inter and cobalt actions stay consistent with the site. The problem section explains AI assistance for operators alongside the existing linked software screenshots. Services use a compact cobalt nine-image ring/drum with exactly four service choices. Work uses five project tabs, a large intact desktop/mobile pair, existing project copy and real case-study links. The process retains its SVG scenes and HTML labels. Internal-project and expert-profile client names stay anonymous in public copy; marketing names and existing screenshot pixels may remain.
- Home questions: reuse the Process FAQ with its localized handover card and desktop hover expansion. Touch and keyboard activation remain available; all answers remain readable without JavaScript.
- Home problem: one operational canvas connects chat, spreadsheet and document questions to a shared status/owner/next-step record. The ink workspace carries the focus; static cobalt SVG connectors explain the relationship. The AI tasks are visibly conceptual and human-reviewed, with one separate real-project evidence link. Astro/CSS only; no client script or new visual assets. Sources and rejected alternatives: docs/design/problem-refresh/research.md.
- Home benefits: the approved ink-and-document composition replaces the awards-style rows. Five topic-specific SVG icons accompany the existing benefit copy; a small illustrated handover bundle below the title shows design files, code, and access/documentation. The illustration is conceptual, not product proof. Text stays static and readable without JavaScript; only icon backgrounds respond to hover.
- Services: each row receives an ink field on hover or keyboard focus, with white copy and a visible cobalt arrow. The engagement section follows as a compact two-column composition on large screens, with its introduction to the left and four choices to the right.
- Service detail: the hero and supporting images show real projects appropriate to each offer, with descriptive alt text and captions. Deployment has one honest architecture diagram until a safe Komodo capture exists.
- Engagements: four divided service rows, not a 2×2 pricing grid; the expanded row holds scope details and its CTA. Dividing lines reveal once when in view; desktop hover opens each row with finite height animation; keyboard/touch and reduced-motion behavior remain available.
- Home motion: the supplied video has explicit pause/play and stops offscreen or in hidden tabs; reduced motion and save-data start on the static poster. The service ring stays circular while native page scroll and image drag rotate it. Service tabs or previous/next open the perspective view; hover/focus reveals real service detail links. Manual tabs, previous/next and horizontal drag select only the four services; the project images never become project choices. Rendering stops when settled/offscreen and reduced motion changes selections immediately. Work tabs advance every four seconds while in view, in homeRank order: Order & Field Sales, MAXY AI, Industrial Coatings, Proteksindo, then Deployment & Operations. A 500ms opacity crossfade blends the old and new panels without moving the section below; outgoing content is inert and hidden from assistive technology. Only selected and next cover images explicitly warm/decode on entering Work or changing selection; selected tabs scroll horizontally when clipped. Hover over controls, focus and an explicit pause stop rotation; reduced motion starts paused. Keyboard selection remains available. All panels remain available without JavaScript. The Work page's three featured projects remain separate.
- Work: three equal featured cards and the two-column catalog use a consistent 9:5 desktop-and-phone composition. Both screens remain visible without cropping. Detail pages use a solid dark header above a light canvas, then a compact breadcrumb, title, and two full-resolution screens side by side; on phones they stack. Context leads into numbered feature stories with real supporting screens, then role, services, and a consultation CTA. Screens can be opened at full size. On narrow Work details, the global floating CTA is hidden so it does not cover the screen captions; the page's own consultation CTA remains. White, ink, and cobalt frame the source UI without redrawing it.
- Home Notes: tinted article bodies and white diagram panels distinguish cards from the white section. Image, title and the existing localized cobalt CTA open the same article; focus stays visible and diagrams do not zoom.
- Notes: two-column reading grid with one sticky utility rail on desktop; single-column flow on smaller screens. Each article has a distinct explanatory diagram exported for article, list, card, and sidebar roles. EN/ID labels are rendered from the same diagram design using the site's font.
- Shared surfaces: breadcrumb uses ink; the footer uses ink (`#17191C`) with white copy and the white Katalhys symbol. Neither requests a repeated stock photo or texture. Locale OG artwork uses the shared geometry and bundled GeneralSans font.

## Promo videos

All four promo projects plus the original v1 story use the current Katalhys identity. Video layouts scale GeneralSans/Inter for 1080×1920 portrait delivery. Use cobalt for actions, ink/white for scene contrast, the navy/cyan mark on light backgrounds and the white mark on ink. The two curved fields may enter separately, then settle into the exact logo 09 geometry; never substitute the old three-piece mark or recolor the white variant cobalt. Real project screenshots remain proof; AI assistance is service positioning, not an invented result. The website phone sequence uses a current local Katalhys capture. Preserve each story’s timings and original music/SFX. Source/output mapping and review: promo/video/README.md and promo/video/review.html.

## Review gates

Before launch, review the new editorial assets and logo, provide a WhatsApp contact-center number, verify domain and contact details, and obtain permission for every public client/proof asset. Keep Lighthouse mobile performance ≥95, CLS 0, and TBT <100 ms. The 2026-10-16 Home refresh measured ID 97 / EN 99 performance, accessibility 100, TBT 0 / 5.5ms, and LCP 2.48 / 1.96s locally. A tiny font-swap shift remains (CLS below 0.001 rather than exactly zero). These individual local results do not certify the entire site or deployed CWV.

## Last updated

- 2026-10-19 - Applied the owner's compact phone composition across every Home section and shared inner component, removed the logo backing and redesigned floating mobile controls from live-reference research. Added explicit expanded-state and component height checks; content remains naturally sized with complete copy.

- 2026-10-19 - Refined the shared mobile scale, Home service/Work/Process composition, service and article details, persistent inquiry labels and compact footer. Kept approved copy, brand assets and existing desktop compositions.

- 2026-10-17 - Researched and rebuilt the Home problem as one source-to-workflow illustration, then clarified Notes card surfaces and image/title/button navigation. Fonts, palette, original screenshots and no-JS readability retained.

- 2026-10-17 - Optimized responsive Work/service media, portrait hero video, font discovery, CSS keyframes and animation/hover work; anonymized internal and expert client copy while preserving screenshot pixels. Performance evidence is in docs/performance/2026-10-17.md.

- 2026-10-17 - Reused the Process FAQ on Home, shortened About headings and corrected dark-header menu contrast.

- 2026-10-17 - Added Proteksindo as Home project four, moved operations to five, and changed Work rotation to four seconds with a stable 500ms crossfade.

- 2026-10-17 - Enhanced and integrated the owner-approved benefits document into Home EN/ID, with five semantic icons, a handover illustration and compact responsive spacing.

- 2026-10-17 - Migrated all five authored video variants to current Katalhys identity, updated logo choreography, website capture and AI-system offer, and prepared 60fps MP4 review and verification.

- 2026-10-17 - Removed generic typography entrance and documented per-section motion choices. Added a separate EN/ID delivery-document concept for benefits; current Rows remains pending selection.

- 2026-10-17 - Applied the owner's interaction and color feedback; restored the earlier navigation composition across Home and scrolled inner pages, compacted the service ring, added project rotation/pause and search fallback.

- 2026-10-16 - Implemented the supplied video hero, rectangular floating Home navigation, nine-image service wheel, project tabs and bilingual operator-focused AI positioning. Concept service art is explicitly owner-authorized; no framework or dependency migration.

- 2026-10-16 - Restored the shared EN/ID footer to the existing ink token, retaining its white copy, logo, and watermark.

- 2026-10-15 - Replaced the stepped mark with flowing logo 09, retaining its navy/cyan gradient while adopting the confirmed Cobalt + Ink website palette. Updated every shared symbol and regenerated campaign and icon assets for local review.

- 2026-10-15 - Applied the selected Katalhys identity for local review, including vector logo variants, white-background icons, Midnight Blue + Cyan tokens, and refreshed website campaign artwork. Co-owner approval remains pending.

- 2026-10-01 - Visual QA passed 66 localized route/viewport checks and desktop/mobile/reduced-motion/no-JavaScript hero checks. Lighthouse mobile measured 94/93/94, CLS 0, TBT 104/0/0 ms; the >=95 performance gate remains open. Editorial assets decreased from 1.73 MB to 0.79 MB.
- 2026-10-01 - Replaced abstract material imagery with Renoir campaign artwork, authentic service proof, and localized Notes diagrams; restored desktop hero parallax with responsive portrait art direction and safe limits.
- 2026-09-29 — Added editorial material imagery for Home, About, four services, and three Notes; replaced shared stock backgrounds with SVG/CSS, paired real Work screens with service copy, and documented master-to-WebP production.
- 2026-09-29 — Expanded eight Work studies with feature stories and source screens; established intact desktop/mobile pairs, full-size image access, and consistent 9:5 cards.
- 2026-09-29 — Integrated The Joint mark and editorial About image; refined Services, About fit, and home process motion; specified a separate four-project home carousel and compact portrait support screens.
- 2026-09-28 — Replaced concept Work direction with founder project studies, responsive screenshot art direction, and a shorter, context-first detail layout.
- 2026-09-22 — Replaced brick-red with the cobalt signal system; documented command search, service rail, concept Work, Notes rail, and The Joint logo exploration.

### Performance verification - 17 October 2026

The integrated Problem/Notes and runtime/media build was checked in Chrome. Home EN/ID each scored 92 in three cold mobile Lighthouse runs, with accessibility 100, CLS 0 and TBT below 100ms. Transfer dropped about 59% to 1.16 MB; the >=95 Home performance goal remains open. Seven inner routes scored 95-97 in single final runs. These results supersede the earlier Home lab scores above. Evidence, methods and remaining limits: [performance report](docs/performance/2026-10-17.md). No deployment.
