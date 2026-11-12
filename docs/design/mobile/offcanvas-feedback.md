# Offcanvas feedback, 22 October 2026

The owner requested visible text feedback before mobile-menu navigation, more deliberate pressed links, and separation between the project CTA and language switch. The existing Katalhys identity remains the direction: GeneralSans/Inter, ink reading text, cobalt actions, ENERGY 2 / RHYTHM 2 / MOTION 2. Antislop applies during implementation, as previously selected by the owner.

## Research and decisions

- [NN/g: animation duration](https://www.nngroup.com/articles/animation-duration/) describes short feedback for simple interactions and recommends reducing duration as interactions become more frequent. Its examples include a 100ms microinteraction. This supports a brief confirmation, rather than a long menu exit sequence.
- [IBM Carbon: motion](https://www.carbondesignsystem.com/building-blocks/foundations/motion/overview) distinguishes subtle productive motion for button states from expressive motion. Its fast fade token is 110ms. We use that duration for the owner's requested pre-navigation feedback; the navigation delay is our implementation choice, not a Carbon requirement.

Each navigation row has a divider to clarify its full tap area. On press/focus, its text becomes ink and a cobalt underline grows beneath the label while the forward arrow appears. The arrow confirms the chosen destination; it is hidden at rest. Labels do not move or split. Existing project-button arrow artwork is reused; no assets, icon classes or dependencies were added.

The primary CTA remains the focal point. Its pressed background becomes ink, the language button gets an ice surface, and logo/contact links receive underlined text feedback. The project and language controls share a wrapping flex row with a 12px gap, so narrow screens can place the language control below the CTA without overlap.

Native anchors retain their real destinations. Only ordinary same-origin page navigation waits 110ms. Reduced motion removes both this delay and link transitions. Modified clicks, new tabs, downloads, protocols/external destinations and same-page anchors retain browser behavior. Another link supersedes pending feedback; Escape/close cancels it. Page lifecycle cleanup prevents stale pressed styling after returning with Back.

## Validation

Changed sources: `Offcanvas.astro` groups the actions; `NavMenu.astro` supplies mobile label/arrow markup; `_site.scss` owns the feedback; `_inner-mobile.scss` adjusts the action-row spacing; `site.ts` handles the finite navigation delay and cleanup. `check-offcanvas-feedback.mjs` records the regression coverage. `AGENTS.md` and `DESIGN.md` describe the resulting conventions.

The focused check is `node scripts/check-offcanvas-feedback.mjs`, against the built-page server on port 4322 by default, or a URL argument. It covers 320, 394, 430 and 820px viewports in EN/ID, button separation, 44px targets, keyboard focus and closing, every menu destination, latest-click selection, cancellation, native exceptions, actual touch and keyboard navigation, and reduced motion. Screenshots are saved under ignored `.work-capture/mobile-polish/offcanvas/`.

This is desktop Chrome device emulation. Physical iOS/Android behavior is not certified by these checks.

Final built-page result: **43 checks passed, no page errors**. The earlier development pass covered 40 checks; three additional native exception cases were added for the final production run. Every locale's logo, Home, Services, Process, Work, About, Notes, project CTA, language switch and contact link was activated and reached its real destination. Enter opened Services; touch opened the language counterpart; Escape closed the menu and cancelled a queued navigation. Back returned without stale pressed styling.

`bun run check` reported zero errors/warnings and five existing hints. `bun test` passed 17 tests. `bun run build` succeeded; link and copy guards each checked 45 pages. `git diff --check` passed. No formatter command is configured in this repository.

The production test caught PurgeCSS dropping `:active` and `:focus-visible` from a mixed `:is()` selector containing the runtime pressed class. Separate state selectors now preserve all three states. The regression check waits for the focus arrow and asserts ink text during the pre-navigation feedback, so both visual states are checked against built CSS.

Screenshots `en-focus.png` and `id-focus.png` were visually reviewed at 394×852. Muted, ink and cobalt text on white measure 6.14:1, 17.61:1 and 6.70:1 respectively using WCAG relative luminance. Existing approved fonts and colors take precedence over generic skill suggestions to replace Inter or white.

## Antislop delivery gate

Scope: the changed offcanvas, navigation markup and shared click handler. Existing pages and historical artwork were not re-audited. The following PASS entries record the review of each gate item in this scope.

| Hard gate | Status and evidence |
| --- | --- |
| R-02 punctuation | PASS: no user-facing copy was changed or added |
| R-03 mobile containment | PASS: controls fit at 320/394/430/820px in EN/ID; narrow actions wrap with 12px separation |
| R-17 statistics | PASS: no statistics added to the UI |
| R-18 testimonials | PASS: no testimonials added |
| R-23 asset authorization | PASS: requested menu styling uses existing logo, copy, routes and arrow icon; no new assets |
| R-24 destinations | PASS: all 20 EN/ID menu anchors activated; 45-page link guard passed |
| R-25 contrast | PASS: text/background pairs measured above 4.5:1 |
| R-26 controls | PASS: links navigate; menu opens/closes and Escape cancels queued navigation |
| R-27 states | PASS: navigation has rest, current, focus and pressed states; no new data/loading UI |
| R-28 FAQ relevance | PASS: no FAQ changes |
| R-32 keyboard | PASS: visible focus checked; Enter navigates and Escape closes |
| R-33 source implementation | PASS: changes are in Astro, SCSS and the existing TypeScript handler |
| R-34 themes | PASS: no theme switch introduced; existing light menu retained |
| R-35 runtime proof | PASS: build, 43 browser checks, 17 unit tests and destination click-through completed |
| R-36 claims | PASS: no security, performance or customer claims added to the UI |
| R-37 direction | PASS: existing DESIGN.md read; ENERGY 2 / RHYTHM 2 / MOTION 2 applied |
| R-38 fabricated content | PASS: existing approved labels and real routes retained |

| Purpose gate | Status and evidence |
| --- | --- |
| R-01 gradients/glow | PASS: no new gradients or glow |
| R-04 icons | PASS: existing forward arrow confirms the selected navigation destination |
| R-06 typography | PASS: existing brand typography retained |
| R-07 background pattern | PASS: no pattern added |
| R-08 arrows | PASS: navigation arrows appear on interaction to confirm the activated row; hidden at rest |
| R-09 capsules | PASS: existing action shapes retained; no badges added |
| R-10 glass | PASS: no blur or glass effect added |
| R-12 shadows | PASS: no shadows added |
| R-13 glow density | PASS: no glow added |
| R-14 repeated cards | PASS: menu remains a list of destinations, with no cards |
| R-19 motion purpose | PASS: finite 110ms confirmation; labels stay stationary; reduced motion immediate |
| R-22 illustration purpose | PASS: no illustrations added |

| Liveliness | Status and evidence |
| --- | --- |
| Explicit dials | PASS: ENERGY 2 / RHYTHM 2 / MOTION 2 recorded before implementation |
| Consistent dials | PASS: compact rows and one small contextual feedback effect |
| Focal point | PASS: existing cobalt project CTA remains primary |
| Structural whitespace | PASS: row dividers organize destinations; 12px gap separates distinct actions |
| Deliberate accent | PASS: cobalt is used for action/selection feedback |
| Identity motif | PASS: Katalhys wordmark, cobalt/ink and existing forward-arrow gesture retained |
| Design read | PASS: existing identity plus the selected text/underline feedback was stated before coding |

| Craftsmanship and quality locks | Status and evidence |
| --- | --- |
| C-1 intentionality | PASS: each treatment has a navigation or separation purpose described above |
| C-2 completeness | PASS: every changed interactive element activated during EN/ID checks |
| C-3 content-driven composition | PASS: existing six-destination navigation retained |
| C-4 resilience | PASS: touch, keyboard, reduced motion, modifiers, cancellation, Back and four widths checked |
| C-5 evidence | PASS: no invented content or customer proof |
| R-05 layout rhythm | PASS: compact navigation list retained; no page sections added |
| R-11 radius variation | PASS: navigation rows stay flat; existing action shapes retained |
| R-15 CTA wording | PASS: owner's existing project CTA retained |
| R-16 copy | PASS: no marketing copy added |
| R-20 identity | PASS: existing Katalhys type, logo and cobalt/ink treatment retained |
| R-21 theme purpose | PASS: existing light menu retained |
| R-29 palette | PASS: existing brand tokens only |
| R-30 cloning | PASS: references informed duration and feedback, not a copied page composition |
| R-31 written reasons | PASS: divider, underline, arrow, duration, gap and native exceptions documented above |
