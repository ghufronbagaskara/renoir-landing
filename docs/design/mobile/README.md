# Mobile component research and implementation

Research at 394 × 852, 11 October 2026. Renoir retains GeneralSans/Inter, cobalt/ink palette and all content. Homepage is excluded through the `inner-page` body class. No third-party component code or dependencies are imported.

## Observed references

| Source | Actually observed | Renoir adaptation |
| --- | --- | --- |
| [Vercel templates](https://vercel.com/templates) | Mobile heading measured 32px/40px, 14px search text; filter sidebar becomes a filter button; cards use compact title/description hierarchy. Gallery is one column at 394px. | Smaller section headings, compact search/filter grouping and clear service cards. Renoir uses two columns where the owner requested them, rather than claiming Vercel does. |
| [Linear Now](https://linear.app/now) | Header is short; categories sit above the content; article preview separates image, headline, excerpt, and lightweight metadata. Gallery is one column; horizontal categories remain scrollable. | Notes search/topics before results, tighter metadata and title scale. Renoir wraps topic choices to avoid the unwanted sideways filter strip. |
| [Framer marketplace](https://www.framer.com/marketplace/templates/) | At 394px the catalogue displays two image tiles per row with compact labels; categories are also arranged in two columns. | Work/Notes use two fluid columns, intact thumbnail proportions, readable titles and expandable summaries. |
| [GOV.UK text input](https://design-system.service.gov.uk/components/text-input/) | Guidance requires labels and generally visible labels above inputs; the live mobile input example uses a fluid input with a distinct label. | Visible persistent form labels, 16px input text, 44px controls; pair only short related fields. Full-width email, project type and message remain easy to read. |
| [GOV.UK accordion](https://design-system.service.gov.uk/components/accordion/) | Guidance supports selective disclosure of related sections but warns against hiding content everyone needs. Reviewed documentation, not a claimed live interaction. | Process keeps every stage title visible and uses native details for full explanations; FAQ retains its existing disclosure behavior. No text is truncated. |
| [WCAG target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Level AA defines 24px minimum with spacing exceptions. | Renoir keeps the more comfortable 44px touch-control baseline even where typography is smaller. |

The first four references were inspected in the in-app browser at the actual phone viewport, not inferred from desktop screenshots. The final two are normative/pattern guidance. Colors, imagery, and copy are not copied from the references.

## Mapping all browser comments

| Comment | Component problem | Mobile treatment | Reference |
| --- | --- | --- | --- |
| 1 | Services heading overpowers the screen | 24px heading, 11px eyebrow, compact CTA and 36px section rhythm | Vercel |
| 2 | Service rows are oversized typography blocks | Thumbnail/title grid, 21px service title, 15px full description and bounded card padding | Vercel, Framer |
| 3 | Engagement panel has large offsets and gaps | Self-contained white disclosure card; full-width panel, 18px price and compact checklist | GOV.UK accordion |
| 4 | Footer requires excessive scrolling | Compact closing message, two columns of links, full-width brand/contact and reduced spacing | Framer density, WCAG targets; custom composition |
| 5 | Process is a long desktop stack | Four visible stage rows, one native detail open at a time; duplicate desktop diagram is omitted on mobile | GOV.UK accordion |
| 6 | FAQ graphic takes an entire screen | Handover graphic becomes three compact columns, followed immediately by 48px question rows | Framer tile density, GOV.UK accordion |
| 7 | Work intro is oversized | 24px heading, 15px intro and shorter divider spacing | Vercel |
| 8 | Featured products are full-width blocks | Two columns; full project brief is available through a native disclosure | Framer |
| 9 | Work search/filter/catalog are sprawling | 44px search, wrapped filter chips, smaller metadata, two-column cards | Vercel, Framer |
| 10 | About breadcrumb/content are too large | Short breadcrumb, compact name signature, two-column facts and smaller fit rows | Vercel hierarchy, Framer density |
| 11 | Notes use one giant card per row | Two columns, 15px headings, native full-summary disclosure | Framer, Linear |
| 12 | Topics consume a large sidebar block | Compact wrapping topic links located above results | Linear |
| 13 | Recent notes repeat the huge cards | Native disclosure after the catalogue; thumbnail/text rows when opened | Linear, GOV.UK accordion |
| 14 | Contact uses large placeholders and empty padding | Visible labels, short-field pairs, full-width email/message, 80px resizable textarea, 44px controls | GOV.UK text input |

## Fit rule

At normal phone text size, individual cards, one expanded engagement/process panel, the FAQ overview and the form should fit within the usable viewport. A complete multi-item catalogue or every expanded answer cannot reasonably fit one screen. Full copy remains accessible; text zoom and short viewports may require scrolling. No fixed height clips content and no line-clamp discards descriptions.

The floating contact CTA is in document flow on inner mobile pages, immediately before the footer, so it cannot cover fields or card copy. It remains fixed on desktop and unchanged on Home.

Validation artifacts: `qa/before-metrics.json`, `qa/after-metrics.json`, before/after screenshots, and `validate-mobile.mjs`. Original page URLs, bilingual dictionaries, metadata, API field names and validation constraints remain unchanged.
