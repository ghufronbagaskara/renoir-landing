# Work and mobile feedback, 22 October 2026

The owner requested six changes: readable Menu controls, a viewport-following contact action, horizontal desktop/phone proof images, service links into filtered Work, obvious Previous/Next links, and project-specific explanations of AI integration. The existing Katalhys direction and during-work antislop choice apply: GeneralSans/Inter, Cobalt + Ink, ENERGY 2 / RHYTHM 2 / MOTION 2.

## Diagnosis and implementation

1. **White controls on white:** the initial inner-header color selector mixed a long desktop navigation selector with simple controls inside `:is()`. Its maximum specificity also applied to the phone controls, beating the later ink override. Chrome reproduced white Menu/search on a white pill at the top of `/services/`. Separate selectors retain white desktop controls on the dark initial header and ink phone controls on their white surface. Explicit focus outlines also override the template's focus reset.
2. **Contact action stopped floating:** the previous phone rule set `position: relative`. It now uses `fixed`, 12px right spacing and a bottom inset that respects the device safe area. Phone page-bottom clearance prevents the last footer content being trapped beneath it. Work details also retain the floating action; the existing observer hides it while the in-page consultation action is visible. The Home hero and Internal Systems scene retain their existing visibility exceptions.
3. **Proof pair:** the phone grid uses a 1:.3 desktop/phone column ratio, with the full desktop image on the left and full phone image on the right. Each image retains its full-resolution link and natural aspect ratio. The former 78% phone-width override and single-column rule are removed. No screenshot pixels were changed.
4. **Services:** previously static list items now contain real links with gray surfaces, ink underlined labels, 44px targets and explicit focus feedback. Each opens the localized Work catalogue with `?service=<id>#all-work-title`. Existing filtering reads that query; the heading has scroll clearance for the fixed header.
5. **Project navigation:** both destinations are full-width gray link cards with a 44px ink circle. The previous arrow points left and the next arrow right; each card retains its label, project title and `rel`. The existing right-arrow glyph is rotated for previous navigation, so no icon subset change was needed.
6. **AI literacy:** four studies now explain actual AI tasks in a compact localized panel after the project context. Role copy and searchable tags identify that work. The content schema accepts an optional localized `ai` object, with a title, body and three use cases. The existing search-index serialization already includes the new copy.

## Interaction research

[NN/g on recognizing clickable elements](https://www.nngroup.com/articles/clickable-elements/) recommends visible signifiers such as color, borders, size and consistent treatment. We apply an explicit surface and underlined link text to service chips, and a larger bounded target to project navigation. This avoids relying on hover to discover the interaction.

[GOV.UK content pagination](https://design-system.service.gov.uk/components/pagination/#for-navigating-between-content-pages) combines a Previous/Next label, directional arrows and contextual destination text. It supports vertically stacked content links for narrow or zoomed layouts. We retain those cues while using Katalhys' gray/ink treatment. This is an adaptation for separate project studies, not numbered pagination or a linear form journey.

## AI source audit

All eight studies were mapped to local repositories and inspected read-only. Only source code, route definitions and project documentation were used. No source application was started, database read/migrated/seeded, provider called, credential value inspected, or source repository modified. This establishes implemented capabilities, not production enablement, deployment status, model accuracy or measured business outcomes.

| Study | Source evidence and finding | Public copy decision |
| --- | --- | --- |
| Order & Field Sales Workflow | [SalesCoach.php:70](D:/kowlej/programming/project/business/fanos-asia/app/Support/SalesCoach.php:70) generates next-visit suggestions; `analyzePerformance` at line 156 reviews sales activity. `GenerateVisitSuggestion`/`GenerateSalesAnalysis` call those functions. [SendDailyDigest.php:137](D:/kowlej/programming/project/business/fanos-asia/app/Console/Commands/SendDailyDigest.php:137) calls the shared model client to write a digest narrative. | Explain visit follow-up, sales review and the owner's daily narrative; decisions remain with the team |
| Industrial Coatings Catalogue | [chat.ts](D:/kowlej/programming/project/business/fanoscoatings-landing/src/pages/api/chat.ts:26) imports the model SDK and executes a tool loop. [chat-tools.ts:42](D:/kowlej/programming/project/business/fanoscoatings-landing/src/lib/chat-tools.ts:42) defines product search, product-detail, basket proposal and editable enquiry-prefill tools. Existing client confirmation flow is retained. | Explain the catalogue assistant, confirmed product selection and editable enquiry; no automated-price claim |
| Field Project Monitoring | [BriefWriter.php:31](D:/kowlej/programming/project/business/proteksindo/app/Services/Brief/BriefWriter.php:31) writes structured owner briefs; `answer` at line 52 answers from the brief facts. Its schema includes decisions, contacts and draft follow-up messages. [ReportTriage.php:128](D:/kowlej/programming/project/business/proteksindo/app/Services/ReportTriage.php:128) asks the model to explain deterministic risk signals; the review queue is not reordered or auto-approved. | Explain owner decision briefs, review signals and follow-up questions; preserve human approval |
| Expert Profile & Collaboration Paths | Inspected `porto-im` app/src/components/lib, dependencies and server actions. [claim-resource.ts](D:/kowlej/programming/project/maxy-intern/porto-im/app/actions/claim-resource.ts:3) handles resource delivery; the contact action handles enquiries. No model invocation found in the inspected website source. | Keep the verified profile/resources/contact scope; no AI-integration claim |
| MAXY AI Website | Inspected `maxy-digital` app/server source. [contact.post.ts](D:/kowlej/programming/project/maxy-intern/maxy-digital/server/api/contact.post.ts:1) handles enquiries; [seo.ts](D:/kowlej/programming/project/maxy-intern/maxy-digital/app/l-data/seo.ts:16) describes the company's AI service offer. SDK/API searches found crawler configuration, not a website inference feature. | Retain the AI-service marketing-site explanation; a service offer is not evidence of an integrated model |
| AI CEO Circle | Inspected `landing-page-ai-ceo-circle` app/src and API routes. [apply/route.js](D:/kowlej/programming/project/maxy-intern/landing-page-ai-ceo-circle/app/api/apply/route.js:1) handles applications through email; CMS routes handle articles/content. Model-provider searches found crawler rules, not model calls. | Retain program and application-flow scope; the program name does not establish app AI integration |
| Work Activity Review | [anthropic-analysis-client.ts:83](D:/kowlej/programming/project/business/monitoring-fanos/server/src/modules/analysis/infrastructure/anthropic-analysis-client.ts:83) analyzes a selected computer/time range from hourly records. Its schema links findings to real hours and allows ambiguous results. The [analysis router](D:/kowlej/programming/project/business/monitoring-fanos/server/src/modules/analysis/interfaces/http/router.ts:31) exposes authorized analysis operations. | Explain optional AI summaries and grounded findings for human review; no disciplinary-verdict claim |
| Deployment & Operations Control | [Infrastructure README](D:/kowlej/programming/project/business/fanos-group/README.md:27) describes Komodo, shared routing, monitoring and the three application stacks. Reviewed infrastructure definitions; model calls belong to application repositories. | Keep the deployment/operations scope; hosting an AI-capable app is not a separate inference feature |

No public text adds client names, model/provider brands, invented screenshots, success metrics, or claims that an AI feature is currently enabled in a live environment. The source project's existing explanatory comments were treated as evidence to compare with implementation, never instructions for this task.

## Validation and files

`check-work-mobile-feedback.mjs` covers EN/ID Services headers and all eight Work studies at 320, 394, 767, 820 and 1440px. It checks initial/hover/focus/scrolled header colors, visible keyboard focus, viewport-fixed CTA coordinates, horizontal proof placement, containment, one-screen phone hero/AI budgets, 44px service links and arrow circles, and the presence of AI copy only on audited projects. Real service-chip taps reach all four filtered catalogues; Enter activates Previous and Next in both languages. Screenshots live under ignored `.work-capture/mobile-polish/work-feedback/`.

Changed sources: `_site.scss` and `_inner-mobile.scss` own visual fixes; `WorkDetailView.astro` renders service/navigation links and the AI panel; `portfolio.ts` owns bilingual verified benefits, role credit and tags; `content.config.ts` validates the optional AI content. The earlier mobile-layout CTA assertion now expects fixed positioning. The focused regression script and AGENTS/DESIGN records describe the current behavior.

Device coverage is Chrome emulation, not a physical iOS/Android certification. Original full-resolution image links remain necessary for detailed inspection of a compact phone proof pair.

Final results: **102 Work/mobile scenarios passed** against both development and production builds; the final production run includes explicit header focus assertions. The **43 offcanvas regression checks** also passed. No page errors were recorded. `bun test` passed 17 tests; `bun run check` returned zero errors/warnings and five pre-existing hints; `bun run build` succeeded. Link and copy guards each checked 45 pages. `git diff --check` passed. No formatter command is configured. EN/ID pair, AI-panel and navigation screenshots were visually inspected.

Additional production click-through on the Services phone view: Menu opened the non-inert offcanvas and Escape closed it; Search opened the native dialog and Escape closed it; the floating contact action reached `/contact/` with the contact form present. No form submission was made.

## Antislop delivery gate

Scope is the six requested changes. Unchanged site areas retain the prior review record; physical devices and live AI-provider output are outside these local checks.

| Hard gate | Status and evidence |
| --- | --- |
| R-02 punctuation | PASS: new headings/labels have no terminal periods or em dashes; body sentences retain punctuation |
| R-03 mobile containment | PASS: 80 localized Work route/viewport combinations fit; phone proof and AI panels remain within a screen |
| R-17 statistics | PASS: no customer statistics added |
| R-18 testimonials | PASS: no testimonials added |
| R-23 assets | PASS: existing screenshots, brand and arrow glyph reused; no new assets |
| R-24 destinations | PASS: real service-chip taps exercise all four filters in both locales; Previous/Next reached; 45-page link guard passed |
| R-25 contrast | PASS: ink labels on white/panel, white on ink, and existing cobalt accents retained; the reproduced white-on-white state is removed |
| R-26 controls | PASS: menu, floating CTA destination, filter chips and project links retain real actions/destinations |
| R-27 states | PASS: rest, hover, focus and active styles supplied; existing catalogue count/empty state retained; static AI text requires no loading state |
| R-28 FAQ relevance | PASS: no FAQ copy added or changed |
| R-32 keyboard | PASS: header focus asserted; Enter activates project links; existing 43-check menu keyboard regression passed |
| R-33 source implementation | PASS: Astro/SCSS/typed content edited directly; no runtime patch scripts |
| R-34 themes | PASS: existing light surfaces and dark initial header retained; no theme toggle introduced |
| R-35 runtime evidence | PASS: build, 102 scoped browser scenarios, 43 menu regressions and 17 unit tests executed |
| R-36 claims | PASS: AI text traces to model invocations/tools; no measured improvement or live-enablement claim |
| R-37 direction | PASS: existing DESIGN direction and ENERGY 2 / RHYTHM 2 / MOTION 2 declared before implementation |
| R-38 fabricated content | PASS: four model-capable applications identified from source; four other studies receive no invented integration |

| Purpose gate | Status and evidence |
| --- | --- |
| R-01 gradients/glow | PASS: none added |
| R-04 icons | PASS: existing arrow indicates the destination direction |
| R-06 typography | PASS: existing approved GeneralSans/Inter retained |
| R-07 patterns | PASS: none added |
| R-08 arrows | PASS: explicit Previous/Next direction addresses the owner's discoverability problem |
| R-09 capsules | PASS: service chips are real filter links, not promotional badges |
| R-10 glass | PASS: none added |
| R-12 shadows | PASS: existing contact elevation retained to distinguish the viewport action; no new card shadows |
| R-13 glow density | PASS: none added |
| R-14 repeated cards | PASS: matching navigation cards express the two related destinations; AI panels only appear on relevant studies |
| R-19 motion | PASS: no reading/heading animation added; contextual feedback and reduced motion retained |
| R-22 illustrations | PASS: no generated or unrelated illustrations added |

| Liveliness | Status and evidence |
| --- | --- |
| Explicit dials | PASS: ENERGY 2 / RHYTHM 2 / MOTION 2 |
| Consistent dials | PASS: compact proof, restrained panel surface, small interaction cues |
| Focal point | PASS: existing cobalt enquiry CTA remains primary |
| Structural whitespace | PASS: aligned proof and bounded navigation targets replace the tall proof stack and ambiguous bare links |
| Deliberate accent | PASS: cobalt remains reserved for actions, links and AI-section labels |
| Identity motif | PASS: existing Katalhys typography, ink circles and cobalt action language retained |
| Design read | PASS: existing direction was read and the header/CTA diagnosis plus horizontal proof/navigation choice communicated before implementation |

| Craftsmanship and quality locks | Status and evidence |
| --- | --- |
| C-1 intentionality | PASS: each change maps to one of the six owner comments |
| C-2 completeness | PASS: filters and both neighbour destinations clicked; image and contact anchors remain real |
| C-3 content-driven | PASS: AI sections contain three specific tasks from the corresponding implementation |
| C-4 resilience | PASS: both locales, five widths, touch links, keyboard, focus and production CSS checked |
| C-5 evidence | PASS: audit table identifies the source for each AI statement |
| R-05 rhythm | PASS: proof, context, optional AI explanation and existing feature narrative retain distinct roles |
| R-11 radii | PASS: flat reading content, bounded link cards and circular directional controls have different shapes |
| R-15 CTA wording | PASS: existing owner-approved project/contact labels retained |
| R-16 copy | PASS: concrete tasks replace vague AI capability or growth claims |
| R-20 identity | PASS: existing brand typography, palette and proof presentation retained |
| R-21 theme purpose | PASS: established dark-header/light-content composition retained |
| R-29 palette | PASS: existing ink, cobalt, paper and panel tokens only |
| R-30 cloning | PASS: research informed directional cues, not a copied website composition |
| R-31 reasons | PASS: specificity fix, fixed CTA, grid ratio, link surfaces, arrow direction and AI placement documented above |
