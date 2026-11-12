# Notes and search mobile refinement

22 October 2026. The owner requested smaller, denser Notes cards and a deliberately composed mobile search dialog: balanced margins, centered placement, shorter text treatment and thumbnails beside Recent Notes. The existing Katalhys palette and GeneralSans/Inter direction apply, with ENERGY 2 / RHYTHM 2 / MOTION 2. Antislop continues during implementation as selected earlier.

## Findings and decisions

At a 394×852 viewport, Notes cards measured about 335–349px tall. Category, full date and author were three separate rows. The phone search dialog began 10px from the left but left roughly 32px of content-viewport space on the right; it was positioned against the bottom, with a roughly 750px height. The dialog used the desktop hierarchy and a single long column of service links.

- Notes retain two columns. Phone headings are 14px, card padding 10px, and image-to-text spacing 8px. A category row sits above a flex byline containing a localized short date and the existing author credit. Dates retain machine-readable `datetime` and a full-date `title`. At 394px the byline fits one row, making metadata two rows. Narrower phones may wrap the byline naturally. Titles, descriptions and author attribution are not truncated; native summary disclosures remain available.
- Summary and reading controls share one 44px footer row on phones. The native disclosure keeps its text/plus cue, while the reading link uses an outlined arrow circle with its full accessible label and tooltip. Opening a summary gives the paragraph the full card width. Desktop reading-label presentation remains available.
- Final EN card heights at 394px are about 255–266px, compared with 335–349px before. An intermediate metadata-only pass measured 299–310px; sharing the footer row removes another 44px. Localized titles keep their natural height. Reading links and summary controls retain 44px targets. Existing diagram images remain intact.
- The phone dialog uses a percentage-based width with balanced 16px content-viewport gutters, automatic centering on both axes, and a stable height capped at 580px or available viewport space. The height stays constant between default, result and empty states so the input does not jump while typing. This also removes the stretched empty area caused by an auto-height positioned dialog constrained on both vertical sides.
- The phone header uses a 20px title and 44px close control. The input remains 16px to avoid shrinking mobile field text. A focus outline replaces the template's input/anchor/button focus reset. Defaults and results scroll internally on short screens while the heading, input and close control remain available.
- Four service links form a compact two-column layout. Recent Notes use the existing thumbnail variants at 56×40px beside 13px complete titles. Images are decorative within their labeled links and retain intrinsic dimensions and lazy loading. Desktop recent links also gain the thumbnails; the desktop search composition remains two columns.

Files: `NotesView.astro` owns the metadata markup/date formatting; `SearchOverlay.astro` renders existing thumbnails; `_site.scss` owns shared metadata/thumbnail/focus styles; `_inner-mobile.scss` owns the phone composition. `check-notes-search-mobile.mjs` covers geometry and functional states. No new dependencies, generated media or client-side search behavior were introduced.

The separate [six-studio business research](../2026-10-22-competitor-research.md) identifies proposed content/offer improvements. Those proposals are not new public claims or features in this UI change.

## Verification

The focused Chrome check covers EN/ID at 320×568, 360×780, 394×852, 430×932, 767×852 and 1440×1000. It checks two-column cards, complete contained headings, compact metadata, summary expansion, centered dialog geometry, stable height while searching, 16px input text, visible focus, thumbnail placement, result/empty states, ArrowDown navigation, Escape and focus restoration. A 394×400 case checks internally scrolling content and a real Recent Notes destination. Additional cases cover content-catalog fallback, a failed search service, the close button and backdrop closing.

Screenshots are under ignored `.work-capture/mobile-polish/notes-search/`. Card and dialog screenshots are reviewed in both locales. The tests emulate browser sizes; physical mobile keyboards and Safari remain unverified.

Final production result: **30 focused scenarios passed, no page errors**. Every service path and all three Recent Notes thumbnails were clicked in EN/ID; each reached its real detail route. The compact reading control opened a note at all six viewport sizes in both locales. Escape, the close button and backdrop closing were exercised. `bun test` passed 17 tests; `bun run check` returned zero errors/warnings and five existing hints; `bun run build` succeeded. Link and copy guards each checked 45 pages. `git diff --check` passed. No formatter command is configured.

## Antislop delivery gate

Scope: Notes card composition and search dialog. The six-studio research records observations and explicitly labeled recommendations, with no new public business claims.

| Hard gate | Status and evidence |
| --- | --- |
| R-02 punctuation | PASS: existing titles/headings retained; no em dash or terminal heading periods added |
| R-03 mobile containment | PASS: six viewport sizes, full headings, compact cards and centered non-overflowing dialog checked |
| R-17 statistics | PASS: no statistics added to the UI; local size/test measurements are identified as such |
| R-18 testimonials | PASS: none added |
| R-23 assets | PASS: existing three note thumbnails reused with decorative empty alt text inside labeled links |
| R-24 destinations | PASS: all four service paths and three note thumbnail destinations clicked in each locale; link guard checked 45 pages |
| R-25 contrast | PASS: existing ink/muted text and cobalt focus on white/panel retained; palette pairs were measured in the earlier mobile audit |
| R-26 controls | PASS: Summary opens, reading control navigates, search returns results, recent/path links navigate, and all close mechanisms work |
| R-27 states | PASS: defaults, loading/results, empty, unavailable and catalog fallback states exercised |
| R-28 FAQ relevance | PASS: no FAQ changes |
| R-32 keyboard | PASS: automatic input focus, visible form focus, ArrowDown, Escape and opener focus restoration checked |
| R-33 source implementation | PASS: direct Astro/SCSS edits; no runtime layout patching |
| R-34 themes | PASS: existing paper dialog/ink backdrop treatment retained; no new theme toggle |
| R-35 runtime proof | PASS: 30 browser scenarios, build, typecheck, 17 unit tests and 45-page link/copy guards executed |
| R-36 claims | PASS: research separates observed site presentation from unverified business performance; no new sales promises published |
| R-37 direction | PASS: existing identity and ENERGY 2 / RHYTHM 2 / MOTION 2 applied; during-work antislop preference preserved |
| R-38 fabrication | PASS: only existing note content/images and service routes used |

| Purpose gate | Status and evidence |
| --- | --- |
| R-01 gradients/glow | PASS: no gradients or glow added |
| R-04 icons | PASS: existing reading arrow and disclosure cue identify distinct actions |
| R-06 typography | PASS: existing GeneralSans/Inter retained; smaller phone reading hierarchy specified |
| R-07 patterns | PASS: no background pattern added |
| R-08 arrows | PASS: reading arrow is the compact navigation control, with a full accessible label |
| R-09 capsules | PASS: circle is an actionable reading target; no promotional badges added |
| R-10 glass | PASS: existing dialog backdrop retained; no additional glass surfaces |
| R-12 shadows | PASS: existing modal elevation retained; no card shadows added |
| R-13 glow density | PASS: no glow added |
| R-14 repeated cards | PASS: consistent two-column article index retained as requested; titles keep natural height |
| R-19 motion | PASS: no heading/reading animation added; existing reduced-motion behavior retained |
| R-22 illustrations | PASS: existing article diagrams are relevant, owned content; no new illustration assets |

| Liveliness | Status and evidence |
| --- | --- |
| Explicit dials | PASS: ENERGY 2 / RHYTHM 2 / MOTION 2 |
| Consistent dials | PASS: quiet card surfaces, compact metadata, small blue action cues |
| Focal point | PASS: search input leads the dialog; article title/diagram leads each card |
| Structural whitespace | PASS: two-row metadata and one action row replace separate stacked blocks |
| Deliberate accent | PASS: existing cobalt marks input focus and actions |
| Identity motif | PASS: GeneralSans titles, ink/panel surfaces and cobalt arrows stay consistent with Katalhys |
| Design read | PASS: compact mobile intent and centering/thumbnail choices stated before implementation |

| Craftsmanship and quality locks | Status and evidence |
| --- | --- |
| C-1 intentionality | PASS: each change addresses card density or modal alignment/readability |
| C-2 completeness | PASS: every dialog destination clicked; compact card reading control and native disclosure exercised |
| C-3 content-driven | PASS: existing categories, dates, authors, article titles and service choices retained |
| C-4 resilience | PASS: EN/ID, short screens, result/error/fallback states and keyboard checked |
| C-5 evidence | PASS: size claims are measured locally; competitor observations link to primary sources |
| R-05 layout rhythm | PASS: editorial index and search paths/recents have distinct content roles |
| R-11 radii | PASS: rectangular input/path rows, bounded dialog/cards and circular reading control use different shapes |
| R-15 CTA wording | PASS: existing reading label retained in desktop text and phone accessible labels/tooltips |
| R-16 copy | PASS: no marketing buzzwords added |
| R-20 identity | PASS: existing site type, palette and explanatory note diagrams retained |
| R-21 theme purpose | PASS: existing light search surface retained |
| R-29 palette | PASS: existing tokens only |
| R-30 cloning | PASS: no competitor interface copied; research recommendations are separate from this UI change |
| R-31 reasons | PASS: compact metadata, shared footer, stable modal height, percentage width and thumbnail placement documented above |
