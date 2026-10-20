# Phone section density and floating navigation

The owner's follow-up asks for a deliberately composed phone layout: shorter title-to-description gaps, smaller text, a slimmer footer and one coherent component per screen. The previous mobile pass still left the Problem, Work, benefits and other Home sections substantially taller than a phone. Antislop continues during implementation, as selected by the owner.

## Live navigation research

Inspected 19 October 2026 in Chrome at 390×844, including the initial header and scrolled state. Vercel and Stripe menu toggles were also activated. Captures are under ignored `.work-capture/mobile-polish/reference-*.png`.

| Primary source | Observed on the live mobile site | Applied to Katalhys |
| --- | --- | --- |
| [Vercel](https://vercel.com/) | 64px sticky header, a bare brand mark and one 44px menu control; mobile menu presents a short destination list | Reduce competing controls and keep a real 44px interaction area |
| [Linear](https://linear.app/) | 65px fixed header; logo sits directly on the page surface, with actions and a menu icon aligned in one row | Remove the logo's white backing; align the wordmark and controls on a compact common baseline |
| [Framer](https://www.framer.com/) | Brand at left; small login/signup actions and a clear menu icon at right. The mobile hero uses a short text-to-action gap | Keep typography and control spacing in a smaller register; language switching belongs inside the menu |
| [Stripe](https://stripe.com/) | 66px mobile header; bare wordmark and one separate menu trigger over the page artwork. Its observed trigger is 40px | Keep the brand separate from the control surface while retaining Katalhys' more comfortable 44px target |

These sites do not all use a detached floating island. Katalhys retains its requested floating treatment: a single white rounded search/Menu group, without three separate outlined boxes. “Menu” is visible; language switching remains available in the offcanvas. The established mark geometry, color palette and fonts are retained. The logo's surface is transparent on every scroll state; the wordmark becomes ink after the Home hero.

## Section-by-section decisions

| Component | Phone composition and reason |
| --- | --- |
| Hero | Keep the existing video/poster and complete headline; reduce body and action spacing while keeping one full-viewport introduction |
| Problem | Three source cards remain side by side, then feed one compact workspace. Retain every source detail, field, AI task, human-decision note and separate real-project proof link so the entire argument can be read together |
| Services | Expose all four tabs in two columns. Keep the overview ring; selecting an offer on phones shows one clear 140×110 illustration with complete text and a separate link underneath. The perspective drum remains on desktop. Disable the inherited height transition so selection does not temporarily expand the section |
| Work | Keep the intact screenshot pair, title, overview and case-study action together. Service tags and approach remain in a native disclosure, initially closed with JS on phones, open on desktop and without JS. A tab change closes secondary detail so an old panel cannot reserve excessive height |
| Process | Compact native stage disclosures, with all titles visible and one full explanation at a time |
| Engagement | Keep titles visible. The audience and complete scope are visible in the selected row; closed rows avoid repeating all the supporting text. Existing single-selection behavior remains |
| Benefits | Keep all five full explanations. Reflow the handover artwork into a small artwork/caption row and tighten document rows instead of showing the large desktop composition |
| FAQ | Keep the handover card and all questions. Use 44px question rows and smaller answers; the existing one-open-answer interaction remains |
| Notes | Put the catalogue action and previous/next controls on one row. Keep complete white diagram panels in shorter cards with compact metadata/title/action spacing |
| Footer | Reduce the heading, description, wordmark and label scale; tighten its dividers and grid gaps while keeping 44px link rows and every destination |
| Inner pages | Retain the compact service cards, Work/Notes two-column catalogues, visible form labels and 16px field text. Compact Internal Systems title, scene caption, steps and playback row. Check real Work feature stories, About fit/proof, contact panel and each catalogue card individually |

No fixed maximum section height, line clamping, hidden overflow on reading content, tiny form text, or nested vertical scrolling is used to force the budget. Reading remains native page flow. Long-form articles and catalogues are collections of components; individual content units are checked instead of truncating an entire article or project gallery. Text zoom, unusually short viewports and no-JS full-content fallbacks may require additional scrolling.

## Measured Home composition

Same Indonesian copy, 390×844 viewport, normal text size, reduced motion. The first column was measured before this denser follow-up. Live-preview final values are rounded CSS pixels and can differ slightly from production font/layout rounding.

| Section | Before | After |
| --- | ---: | ---: |
| Hero | 844 | 844 |
| Problem | 1,285 | 691 |
| Services overview | 892 | 660 |
| Work | 1,395 | 748 |
| Process | 542 | 435 |
| Engagement | 1,118 | 737 |
| Benefits | 1,422 | 657 |
| FAQ | 917 | 642 |
| Notes | 1,005 | 642 |
| Footer | 754 | 580 |

## Reproduce checks

Run `bun run build`, `bun run serve`, then:

```powershell
node scripts/check-mobile-density.mjs
node scripts/check-mobile-layout.mjs http://127.0.0.1:4322
node scripts/check-home-refresh.mjs http://127.0.0.1:4322
node scripts/check-home-feedback.mjs http://127.0.0.1:4322
```

The density script checks Home at 320×844, 360×780, 390×844 and 430×932, both languages. It measures each section, all service selections, every engagement selection, all five Work panels and their expanded secondary detail, and every FAQ answer. It also scans reusable components across the complete content catalogue at 360px and 430px. It verifies the transparent logo surface, ink wordmark after the hero, visible Menu label and offcanvas language switch. Results and screenshots are under `.work-capture/mobile-polish/density/`.

The broader layout script checks 45 built documents at ten widths for overflow, heading containment, image loading, navigation, form readability and interaction/fallbacks. Existing Home checks retain video, wheel drag, Work timing/pause, navigation/search, desktop composition and no-JS/reduced-motion coverage.

## Review limits

Viewport emulation is local evidence, not physical iOS/Android or deployed CWV verification. Input text remains 16px for phone form usability. Existing desktop compositions, approved wording, real screenshot pixels, API behavior and dependencies are retained. No deployment is authorized by this work.

## Executed results and delivery gate

- Production build completed successfully with Pagefind indexing 45 pages and inline CSS purging enabled.
- `bun run check`: 0 errors, 0 warnings; 5 existing hints in promotional sources/image tooling.
- `bun test`: 17 passed, 0 failed. Link and copy guards each checked 45 pages successfully.
- Mobile layout: 450 route/viewport checks and 14 interaction/fallback scenarios passed.
- Final production density: 544 section, expanded-state and reusable-component height checks passed. Selected service artwork was additionally verified as one visible 140×110 illustration. Both languages passed 320×844, 360×780, 390×844 and 430×932.
- Home refresh: 15 scenarios passed, including video, navigation, tabs, reduced motion, save-data, no-JS and video failure. Home feedback passed EN, ID and reduced-motion cases, including ring/drag, project rotation/pause, search and inner-header contrast.
- `git diff --check` passed. There is no configured formatting command in this repository.

Review image: `.work-capture/mobile-polish/mobile-review.png`. The three section captures hide the fixed header to show each full composition; the navbar capture is isolated on white so its shape and transparent logo can be inspected.

| Antislop block | Status | Evidence within this change |
| --- | --- | --- |
| Hard gate | PASS | Production layout/image/form/header/FAQ checks, recorded touch/keyboard/no-JS interactions and existing Home regressions. Complete approved copy and real proof remain; no invented claims or assets |
| Purpose gate | PASS | Component decisions and directly observed primary references are recorded above; spacing, smaller type and separate mobile service presentation serve the owner's phone-reading brief |
| Liveliness | PASS | Existing ENERGY 2 / RHYTHM 2 / MOTION 2 identity retained through cobalt/ink contrast, overview ring, real Work screens and the document benefits composition; reading text stays still |
| Craftsmanship | PASS | Build, type checking, unit tests and production guards passed; natural content flow and native disclosures preserve full content, with explicit viewport/device limits above |
