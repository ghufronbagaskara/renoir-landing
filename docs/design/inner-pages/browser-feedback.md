# Browser feedback implementation

About uses authentic Order & Field Sales desktop/mobile proof instead of the rejected porcelain illustration. No porcelain image is shipped. The name history remains factual; screenshots are identified as founder portfolio/demo work.

[Linear features](https://linear.app/features) informed pairing concise explanations with recognizable software UI. [Aceternity Tabs](https://ui.aceternity.com/components/tabs) informed changing the proof panel with the selected service; its demonstrated selection is click-based. Desktop hover is a Renoir-specific adaptation, not an observed reference behavior. [Aceternity Timeline](https://ui.aceternity.com/components/timeline) informed presenting concrete deliverables; the FAQ package is custom localized HTML, with no imported library code.

Services and Process share the existing engagement component, enhanced only through inner-page variants. Fine-pointer hover selects and animates a panel; click/Enter and native details remain available. Motion respects reduced motion. Process FAQ has the same hover behavior and a code/access/documentation handover visual. Without JavaScript, all Process FAQ answers are visible.

The custom pointer is removed globally. Floating CTA copy is Make the call! / Hubungi. Homepage section composition is unchanged; these two explicitly requested global controls also apply there. No dependencies, APIs, form destinations, route URLs, or metadata changed.

Validation: run `node docs/design/inner-pages/validate-feedback.mjs` against built-site port 4392. Results and screenshots are saved under `qa/feedback-*`.

## Actual validation (2026-10-11)

- Astro check: 0 errors, 0 warnings; four existing hints in promo/image tooling.
- Existing tests: 9 passed. Production build, 45-page link guard, copy guard, and diff whitespace check passed.
- 18 EN/ID route/viewport checks passed at 390/768/1440px: no broken images or horizontal overflow; correct CTA; desktop hover, rapid reversal, touch/click, keyboard, no-JS and reduced-motion fallbacks passed.
- Blocked image loading still leaves image alt, caption, and layout readable. Homepage engagement markup retains its original behavior.
- Local mobile Lighthouse: Services 97, About 98, Process 98 performance; CLS 0 and TBT 0 ms for each. Accessibility 96 for each: the existing breadcrumb Home link has contrast 4.09:1 against its dark background, below 4.5:1. The new components do not introduce this finding.
- No deployment performed. Lighthouse samples cover the three English pages; Indonesian pages were functionally and visually checked, not separately benchmarked.
