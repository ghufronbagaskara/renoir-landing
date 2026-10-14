# Mobile validation — 11 October 2026

Implemented the owner's fourteen mobile comments on Services, Process, Work, About, Notes and Contact. Design changes are scoped to inner pages at <=767px, with the Work catalogue retaining two columns through tablet widths. Existing desktop interactions, routes, forms and EN/ID copy remain available. No dependencies, API contracts or lockfiles changed.

## Density at 394 × 852

Measured normal initial state, with full copy preserved in native disclosures where appropriate.

| Component | Before | After |
| --- | ---: | ---: |
| First Services card | 422px | 263px |
| Open Services engagement panel | 329px | 231px |
| Process section | 1570px | 532px |
| Process FAQ section, including one answer | 1368px | 742px |
| Work introduction | 590px | 282px |
| Featured Work grid | 1397px | 518px |
| About breadcrumb | 403px | 220px |
| About facts | 1515px | 336px |
| Notes catalogue | 2149px | 747px |
| Notes topics | 279px | 108px |
| Recent notes, initial JS state | 1033px | 68px |
| Contact form | 1076px | 546px |
| Shared inner-page footer | 1306px | 687px |

Cards and input controls use distinct typography, padding and composition for phones. Work and Notes display two items per row; full previews are expandable without discarding text. Longer translations, expanded answers, text zoom and short viewports can require scrolling. No fixed-height container clips copy.

## Executed checks

- 60 EN/ID route/viewport combinations: 320, 394, 430, 768 and 1440px. No horizontal document overflow or failed images.
- Two-column Work/Notes, responsive Work thumbnail selection, touch disclosures, native single-open Process steps, FAQ activation by keyboard, visible form labels, >=44px form controls, >=16px input text and native required-field validation.
- Work search and service filters, Notes topic filters; no-JavaScript readability and native Process expansion; six FAQ answers accessible without JS; reduced-motion rendering; failed Services images leave titles and descriptions available.
- Home screenshot dimensions and non-image pixels match the baseline at 394/1440px. Desktop is entirely pixel-identical. Mobile differences are confined to lazy proof images and hover thumbnails finishing at different times; those image regions are explicitly excluded from the pixel assertion. No Home component or Home-specific rule changed.
- Astro check: zero errors/warnings; four existing hints in unrelated promo/image scripts. Nine existing contact tests passed. Production build succeeded. Link/copy guards each checked 45 pages. Git whitespace check passed.

Commands and assertions are in `validate-mobile.mjs`; raw metrics/screenshots and reports are in `qa/`. The screenshot montage is `qa/mobile-preview.png`.

## Lighthouse mobile, production assets on localhost

| Page | Performance | Accessibility | CLS | TBT |
| --- | ---: | ---: | ---: | ---: |
| Services | 97 | 100 | 0 | 0ms |
| Process | 98 | 100 | 0 | 0ms |
| Work | 97 | 100 | 0 | 0ms |
| About | 96 | 100 | 0 | 0ms |
| Notes | 97 | 100 | 0 | 0ms |
| Contact | 98 | 100 | 0 | 0ms |

Work initially scored 86. Supplying 720px mobile thumbnail variants through srcset reduced the eight pair assets from 608,348 to 195,628 bytes and the final Work run scored 97 (LCP 2.42s). Full-resolution project originals and Home assets are retained. Regenerate variants with `node docs/design/mobile/prepare-work-thumbnails.mjs` after changing a pair image.

These are local Chromium results, not field measurements. Physical iPhone/Android devices and Safari were not tested. Live contact delivery was not submitted and no deployment was performed.
# Services touch regression, 2026-10-11

`node docs/design/mobile/validate-service-cards.mjs` passed against the built site on port 4392:
four cards each in EN/ID at 394 × 852 retained complete text after touch; backgrounds became ink and
titles, arrows, lead sentences and supporting copy became white. No horizontal overflow. Keyboard
navigation to the service detail worked with JavaScript disabled. Evidence:
`qa/service-card-touch.json` and `qa/service-card-touch-services.png` / `qa/service-card-touch-id-layanan.png`.

The mobile hover/focus/active selectors are expanded explicitly: PurgeCSS dropped the version using
`:is()` around these pseudo classes. Existing Home styling is untouched.
