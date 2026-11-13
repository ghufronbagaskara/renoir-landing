# AGENTS.md | Katalhys landing

Single source of context for AI agents working on this repo. Read it fully before changing anything, and
**update it in the same change** whenever you alter something it describes (stack, commands, structure,
conventions, infra, TODOs). Add a line to the changelog at the bottom.

## 1. What this is

Marketing site for **Katalhys**, formerly Renoir, a digital studio. Historical company brief: [`docs/renoir-run.md`](docs/renoir-run.md). Current identity: [`docs/brand/katalhys-identity.md`](docs/brand/katalhys-identity.md). The selected identity is implemented for local review; co-owner approval is pending.

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Clone 12 pages of the purchased **Averix** HTML template into Astro, as close to the original as possible, with high performance; working navigation (no dead links), working contact form, static search, IaC + CI ready to deploy | **Done** (not deployed yet) |
| 2 | Katalhys identity, bilingual copy, four services and UI polish; approve final logo/client proof before launch | In progress; co-owner identity approval pending |
| 3 | SEO + GEO (metadata, structured data, sitemap, OG images, heading hierarchy, AI-crawler readability). Use the `astro-seo` skill | In progress; final domain/proof pending |

During phase 1 the template's look wins over the brief when they conflict.

## 2. Stack

- **Astro 7** (`astro.config.mjs`), TypeScript, Bun (package manager + scripts). Node ≥ 22.12. The `.mjs` config and `vite.environments.astro.optimizeDeps` avoid Vite's Windows CJS module-runner failure.
- **Alchemy v2** (`alchemy@2.0.0-beta.77`, Effect-based IaC) deploying to **Cloudflare Workers (free plan)**.
- **Effect 4** — pinned to `4.0.0-rc.112` via `overrides` in `package.json`. Alchemy beta.77 breaks on rc.115
  (`Config.string` was renamed). Bump Effect only together with Alchemy.
- Cloudflare: Worker + static assets, **Turnstile** (spam; real widget on `prod` only), **Rate Limiting binding**, Workers Logs, **D1** (`LeadsDB`: leads + admin accounts, `migrations/`).
- Leads are stored in **D1** (primary record, managed at `/admin/`) and also go to **Telegram** (instant push) and a **Google Sheet + email** via an Apps Script web app (`scripts/leads-apps-script.gs`).
- **Pagefind** static search (index built after the Astro build).
- **Sharp** and **Playwright** are dev dependencies for preparing and reviewing Work screenshots; neither runs on the deployed site.
- **Swiper** (lazy) on the client. GSAP remains installed but is no longer imported for page entrance;
  heading text stays static and native CSS/TypeScript handles purposeful diagram and interaction motion. No jQuery,
  no Bootstrap JS, no UI framework islands.
- Styling: the template's own SCSS (Dart Sass) + stock **Bootstrap 5.2.3 CSS** (the template's version).
  At build all CSS is **inlined into each page and purged per page**, including unused keyframes (`purge-unused-css` integration in
  `astro.config.mjs`): no render-blocking stylesheet request, roughly 55–90 KB raw CSS per page instead of ~350 KB.
- TypeScript is pinned to **6.x**: `astro check` can't use TypeScript 7's native compiler yet.

## 3. Commands

```bash
bun install
bun run dev            # astro dev (no Worker runtime: /api/contact won't work here)
bun run check          # astro check (types for .astro/.ts, incl. alchemy.run.ts)
bun test               # contact handler tests (src/server/contact.test.ts)
bun run build          # production build through Alchemy's Cloudflare Astro adapter (scripts/build.ts) → dist/client + dist/server
bun run serve          # serve dist/client locally on :4322 like Cloudflare's asset layer (no /api)
bun run check:links    # after build: fail on any broken internal link or href="#"
bun run check:copy     # after build: guard against banned/template copy and invalid metadata
bun run check:seo      # after build: sitemap, pages, canonical, reciprocal hreflang, JSON-LD, llms.txt, robots
bun run test:browser  # after build: every Chrome check below against scripts/serve.ts, then test:e2e (local only, not in CI)
bun run test:e2e      # after build: built Worker in local workerd + fresh D1 + rate limit + assets: contact API, admin, browser flows (no cloud)
node scripts/check-funnel.mjs # questionnaire EN/ID (keyboard/pointer/branch/resume/channel), no-JS form, cookie choice, menu panels, trust pages
node scripts/check-home-refresh.mjs # after build + serve: Chrome EN/ID responsive/fallback checks
node scripts/check-home-feedback.mjs # Chrome ring, autoplay/pause, hover, search and inner navbar checks
node scripts/check-work-badges.mjs # Chrome EN/ID Work badge containment, filtering and responsive navigation
node scripts/check-mobile-layout.mjs # built-page EN/ID mobile/tablet/desktop layout and touch/keyboard/fallback checks
node scripts/check-mobile-density.mjs # phone section/component height budgets, expanded states, logo and navigation
node scripts/check-offcanvas-feedback.mjs # EN/ID menu spacing, press feedback, destinations, native exceptions and keyboard/touch
node scripts/check-work-mobile-feedback.mjs # EN/ID header contrast, fixed CTA, eight Work pairs, AI sections and filtered service links
node scripts/check-notes-search-mobile.mjs # compact Notes metadata, centered search, thumbnails, keyboard, fallback and error states
bun test scripts/check-deploy-env.test.ts # CI credential/stage preflight, without cloud calls
node scripts/check-motion.mjs # stable headings, finite diagrams and motion fallbacks across 24 route/viewport cases
bun alchemy deploy     # deploy personal dev stage   ← ASK THE OWNER BEFORE EVERY DEPLOY
bun alchemy deploy --stage prod
bun alchemy destroy --stage <stage>
bun run images:mirror  # one-off: download demo images (already done; output committed in src/assets/img)
bun run images:optimize# convert new jpg/png in src/assets/img to WebP (deletes originals)
bun run images:editorial # ignored editorial masters → final WebP crops, proof composites, locale OG
bun run brand:assets    # shared Katalhys geometry → color/white/mono SVGs + white-background favicon/touch icon
bun run icons:subset   # regenerate Font Awesome subset after adding/removing fa-* icons
cd promo/video/<name> && bunx hyperframes@0.8.166 check   # promo videos (HyperFrames); render: ... render --quality high --output renders/<name>.mp4
node --experimental-strip-types scripts/capture-work-sources.ts <slug> <url> [desktop-path] [mobile-path]
bun scripts/compose-work-images.ts <slug>  # ignored raw PNG → full-size desktop/mobile + supporting WebP, 9:5 pair WebP, OG JPEG
```

Rules:
- **Never deploy (or run `alchemy dev`, which provisions cloud resources) without explicit owner confirmation**, one deploy at a time.
- Never tell the owner to export `CLOUDFLARE_ACCOUNT_ID`/`CLOUDFLARE_API_TOKEN` locally. Alchemy stores credentials in profiles under `~/.alchemy/`; the first `bun alchemy deploy` prompts for OAuth or an API token. CI uses GitHub secrets.
- **Never add an adapter** (e.g. `@astrojs/cloudflare`) to `astro.config.mjs`: Alchemy injects its own and a declared adapter fails the build.
- Plain `astro build` fails by design (the `/api/contact` route needs the adapter). Use `bun run build`.
- The last line of `bun run build` on Windows may print `GetQueuedCompletionStatusEx ... ERROR_ABANDONED_WAIT_0` — workerd shutdown noise after a successful build.

## 4. Layout

```
alchemy.run.ts              Stack "renoir-landing": Turnstile widget (prod), D1 LeadsDB, Website.Astro (+ PR preview comment)
migrations/                 D1 schema: leads, lead_events, admin_users, admin_sessions (applied by Alchemy on deploy)
stacks/github.ts            One-off stack: CI API token + GitHub secrets + Workers subdomain variable (admin profile)
.github/workflows/deploy.yml  push main → prod; PR → pr-<n> preview; PR closed → destroy preview
astro.config.mjs            site/trailingSlash/prefetch + integrations: purge-unused-css, pagefind-index
scripts/                    build, serve, check-links, mirror/optimize images, subset icons, leads-apps-script.gs (Sheet sink, installed by hand)
public/_headers             noindex on *.workers.dev, immutable /_astro/*, security headers
docs/renoir-run.md          brand brief (phase 2 input)
docs/design/inner-pages/    research: 12 reference screenshots, inner-page audit, four service storyboards and isolated EN/ID prototype; `node docs/design/inner-pages/serve.mjs` on :4391. Internal Systems pilot integrated into ServiceView; remaining designs await implementation
promo/gambar/<NN-post>/     Instagram posts: index.html canvas → `node promo/gambar/render.mjs <dir>` → numbered JPEGs in renders/ (see promo/gambar/README.md)
promo/gambar/kartu-nama/    Katalhys business cards: personalized fronts, shared studio and services back, Canva import PPTX and print proof; contact source and regeneration in its README
promo/pitch-deck/           Indonesian client deck, latest v7: 30 main + 10 optional slides, editable PPTX, SVG ornaments, one concurrent whole-page animation per slide, PDF, notes and linked local demo sales module; source/regeneration/QA in its README
promo/sales-module/         demo sales playbook authoring, local preview and checks; standalone HTML + static PDF under public/resources/sales-playbook/; see its README for source limits and regeneration
promo/video/<name>/         social videos: HyperFrames projects (HTML+GSAP → MP4; BRIEF.md, CREDITS.md) and studio-overview (adapted Claude Design source + render-60fps.mjs). Review: promo/video/README.md + review.html. Skills in .claude/skills/hyperframes*
averix-modern-...-utc/      original template (git-ignored, licensed). Source of truth for phase-1 markup
src/
  assets/img/**             final editorial WebP, real Work screenshots, and remaining icon SVGs
  assets/fonts/             GeneralSans woff2 + generated Font Awesome subsets
  content/*.ts              bilingual services, quiz copy (`quiz.ts`), how-we-work/legal copy (`trust.ts`), eight founder portfolio projects, and ordered Work feature stories
  content.config.ts         collection schemas (astro/zod; Astro requires Zod here)
  data/site.ts nav.ts        site configuration (WhatsApp unset), the ONLY nav definition
  layouts/BaseLayout.astro  head, header (home/inner), offcanvas, search overlay, breadcrumb, footer, global scripts
  components/layout/        Header*, NavMenu, Offcanvas, SearchOverlay, Footer, Breadcrumb, LangSwitch
  components/ui/            Img, Accordion, ContactForm, WorksWheel
  components/sections/      one component per template section (home/, about/, services/, pricing/, team/, blog/, shared/)
  pages/                    routes (all prerendered except api/contact.ts and admin/*)
  server/db.ts auth.ts admin.ts  D1 lead store, admin password/session auth, admin page guard (+ db.test.ts)
  layouts/AdminLayout.astro private admin shell (inline styles, no site CSS/JS)
  lib/quiz.ts               questionnaire codes + deterministic recommendation, shared by page script and API
  server/contact.ts         contact form Effect program + Turnstile/Telegram/webhook helpers (+ contact.test.ts)
  scripts/*.ts              client modules (vanilla TS)
  styles/                   template SCSS + _site.scss (our additions) + _inner-mobile.scss (shared + inner mobile variants) + global.scss
  env.d.ts                  types for `cloudflare:workers` env bindings — keep in sync with alchemy.run.ts
```

### Routes (template page → route)

| Template | Route | Source |
| --- | --- | --- |
| index.html | `/` | `pages/index.astro` + `sections/home/*` |
| about-us.html | `/about/`, `/id/tentang/` | `views/AboutView.astro` |
| service.html / service-details.html | `/services/`, `/services/[slug]/` | `services` collection |
| portfolio.html / portfolio-details.html | `/portfolio/…`, `/id/karya/…` | 8 bilingual, indexable founder project studies |
| blog-standard.html / blog-details.html | `/notes/`, `/notes/[slug]/` and Indonesian `/id/catatan/…` | `notes` collection, 2-column index |
| contact.html | `/contact/` | form + map |
| — | `/start/`, `/id/mulai/` | Find your first step questionnaire (`views/QuizView.astro`) |
| — | `/how-we-work/`, `/id/cara-kerja/` | scope, revisions, handover, 30-day bug fixing (`views/DocView.astro`) |
| — | `/privacy/` `/terms/` `/cookies/` + `/id/privasi/` `/id/syarat/` `/id/cookie/` | legal drafts (`content/trust.ts`) |
| — | `/admin/` (+ `login/`, `setup/`, `users/`, `leads/<id>/`) | on-demand, private, noindex |
| — | `/404.html` | not indexed by search |
| — | `/api/contact` | on-demand (Worker) |

Team, pricing, and other unused template pages are not public routes. English and Indonesian routes share views and copy keys. Work credits identify the founder's role and avoid invented client results.

## 5. Conventions

- **Owner's copy preference: no closing periods in headings.** Never end page titles, H1–H6 headings,
  hero headlines, card titles, short UI labels or CTA labels with a full stop (`.`). Apply this to both
  EN/ID website copy and Renoir promotional artwork, including Instagram slides. When a headline spans
  multiple lines or uses separate short sentences, omit the closing period from each headline phrase
  (e.g. `One studio` / `From sketch to running`, not `One studio.` / `From sketch to running.`).
  Body paragraphs retain normal sentence punctuation; meaningful question marks may remain.
  Preserve owner-approved wording when enhancing visuals: do not rewrite existing copy unless asked.
- Client privacy: use functional names for internal-system projects and keep the expert-profile client anonymous in public text, metadata and search. Marketing-site names may remain. The owner explicitly retains existing screenshot logos/text; do not redact those pixels automatically. `check:copy` guards private client names in public HTML and the search catalog.
- Work catalogue thumbnails establish a relative positioning context for their absolute service badges; keep the mobile static badge override.
- Mobile composition: `_inner-mobile.scss` owns 16px gutters, shared compact engagement/FAQ/footer rules and inner-page details. Phone sections use a 24px vertical register with smaller reading/heading scales and natural content height. Header controls retain 44px targets in one rounded search/Menu group; language switching remains in the offcanvas. The logo has no white background and the wordmark turns ink after leaving the hero. Home services expose four choices in two columns and a shorter detail stage; Home Process uses four native stage disclosures. Desktop pairs the compact list with a lazy editorial WebP and an overlaid detail card. Smaller screens show the selected deliverables inline. The dedicated Process page keeps its storyboard. Home Work keeps approach/service detail in a native disclosure, closed initially with JS on phones and open on desktop/no-JS; tab changes close it on phones. The shared contact CTA is fixed to the viewport on phones and desktop, with safe-area spacing and reserved phone page-bottom clearance. It remains hidden on Internal Systems and while the Work consultation link is visible. Service inquiry labels are visible, with 16px field text. Preserve the owner-requested two-column Work/Notes catalogues. Decisions, reference research, measured section budgets and limits: `docs/design/mobile/section-density.md`; latest Work/header/CTA feedback: `docs/design/mobile/2026-10-22-work-feedback.md`.

- `.astro` first. Client code = small vanilla TS modules in `src/scripts`, imported from a component `<script>`
  (Astro bundles/dedupes them). No framework islands.
- Offcanvas links keep native anchors. Ordinary same-origin page clicks show a 110ms ink/underline response before navigation; reduced motion, modified clicks, downloads, new tabs and same-page anchors stay immediate/native. Escape/close cancels pending navigation. Mobile action buttons share a wrapping 12px-gap row. Interaction research and QA: `docs/design/mobile/offcanvas-feedback.md`.
- Notes keep the two-column phone grid with 14px titles and a compact category/date/author block. Dates use localized short months and retain the full date in the time element's title. Search uses a centered native dialog on phones, with balanced percentage-based width, a stable height capped at 580px, safe-area viewport limits and internally scrolling defaults/results. Phone service paths use two columns; Recent Notes use existing thumbnails beside smaller titles. Keep 44px controls, 16px input text and explicit focus. UI decisions/checks: `docs/design/mobile/2026-10-22-notes-search.md`. Six-site business comparison and proposed priorities: `docs/design/2026-10-22-competitor-research.md`; research does not authorize publishing new pricing or response-time promises.
- **Keep the template's markup and class names** (`si-*`, Bootstrap grid) so the template SCSS keeps working.
  When semantics require a different element, extend the SCSS selector instead of restyling
  (e.g. `h1, .h1{`, `h3, .h3{`, `h1, .sidebar-heading{`).
- Anchors without a destination must not use `href="#"`: use `<a class="no-href">` (the class stops Bootstrap's
  `a:not([href]):not([class])` reset) or a real `<button>`. `bun run check:links` enforces this.
- Navigation comes only from `src/data/nav.ts`. Add a route there only once the page exists. Desktop top level: Services, Work, Resources/Panduan, About (Home is offcanvas-only; the logo links home) plus a cobalt-outlined “Your first step / Langkah awal” pill before the CTA. Every parent is a real link (Services → services index, Resources → Notes). Panels follow the DewataTech pattern: a guiding question, icon cards with a benefit line (`nav.serviceLines`) and badge (“+ AI” on internal systems), one cobalt featured next step, and a footer row of secondary links. Panels anchor to the right edge of the header pill (860px max) and open on hover/focus; a pseudo-element bridges the gap. `serviceLinks()` in `nav.ts` is shared with Home. Icon names in nav data are literal `fa-*` classes so `icons:subset` finds them. Offcanvas groups use the existing `.si-menu-close` toggles.
- Home “Start here / Mulai dari sini” (`sections/home/Paths.astro`, right after the hero): four service cards from `serviceLinks()` and a pill row to the quiz (primary), Work, how we work, process, Notes and contact. The hero adds a quiz text link under its two actions.
- Funnel/trust styles live in `_funnel.scss`. Do not group pseudo-classes with runtime classes inside `:is()` (e.g. `:is(:hover, .is-open)`): production PurgeCSS drops the whole rule. Use plain selector lists.
- Cookie choice: `ConsentBanner.astro` + `scripts/consent.ts` store `katalhys.consent.v1` in localStorage and dispatch `consent:change`; `window.katalhysConsent.get()/open()`. Only necessary storage exists today. Any future analytics/marketing loader must wait for the matching category and update `/cookies/`.
- Questionnaire: seven questions (business type, goal, current setup, goal-specific branch, team size, timing, first-stage budget), result before contact, no prices. The result adds a first-step size (`scopeOf`: mapping/focused/phased), a sector example, a first-call agenda and the closest real project (`proofOf`). Answers stay in sessionStorage for the tab. The contact step submits to `/api/contact` with `source=quiz`; the server re-derives the recommendation from validated codes. Pointer choices auto-advance; keyboard users confirm with Next. Without JS all questions render as one form.
- Legal identity, contact email, bug-fix days and lead retention live in `src/data/site.ts`. `legal.entity`/`nib`/`address` render in the footer, legal pages, JSON-LD and llms-full only once filled.
- Images: put final files under `src/assets/img/<section>/`, reference with `<Img src="section/name.webp" />`.
  Legacy .jpg/.png names resolve to `.webp`. CSS backgrounds use `imageUrl()`
  from `~/lib/images`. Hero/LCP images: `loading="eager" fetchpriority="high"`. Never use `astro:assets`
  `<Image>`/`getImage` — Alchemy's adapter forces the passthrough image service, so nothing would be optimised.
- Editorial masters live in ignored `.work-capture/renoir-visual/`; `scripts/compose-editorial-images.ts` makes
  the shipped WebP variants and locale OG JPEGs. Prompts and crop roles are in `docs/brand/editorial-image-system.md`.
  Campaign photographs receive the exact Katalhys SVG and site typography through Sharp/Playwright, rather than generated lettering.
  Service heroes and supporting images use actual Work screenshots with localized alt text and captions.
  Internal Systems additionally opens with `sections/services/InternalFlow.astro`: a labeled conceptual order
  scene under `assets/img/services/internal-flow/`, scoped SCSS and native TypeScript playback (finite 8s,
  selectable stages, pause/replay, viewport/visibility pause and reduced-motion/no-JS/image-error fallbacks).
  Work screenshots remain separate proof. The floating contact CTA is hidden on these pages so it cannot cover
  the stage controls; the in-page CTA targets the existing form. Other service artwork retains its presentation.
  Home uses four generated conceptual service illustrations (not product proof) and five existing project
  thumbnails under `assets/img/home-refresh/` in `ui/WorksWheel.astro`. Only the four services have text/links;
  the five project images are decorative. The compact cobalt section starts as a slowly rotating ring driven by one animation on the orbit. Image drag adjusts it manually. Click a service image, tab, or previous/next to open its preview. Desktop uses the perspective view; phones show one selected illustration above the full detail copy. Hover or focus on an image reveals its service name. Dragging an open service changes its selection without navigating.
  The hero uses the owner-provided video, transcoded to local H.264 under `src/assets/video/`, emitted as hashed `/_astro/` URLs with immutable caching, with responsive
  WebP posters, a play/pause control and reduced-motion/save-data/no-JS/error fallbacks. A 506×900 portrait video preserves the desktop center crop on narrow portrait screens; wider viewports use the 1600×900 source. Automatic playback waits for document load, font readiness, poster decode and the next paint; explicit play stays immediate. Video pauses outside
  the viewport and in hidden tabs. A dark scrim improves contrast; the three hero facts were removed.
  Home restores its separate wordmark and right-hand white navigation pill; mobile controls remain aligned
  in one rounded search/Menu group, with language switching inside the mobile menu. The logo has no white backing. Inner pages use the same floating navigation after scrolling. Home composition styles live in `_home-refresh.scss` and load from HomeView.
  Prompts, source video, asset roles and verification notes: `docs/design/home-refresh/README.md`.
  Home benefits now uses `sections/home/Benefits.astro`: the approved ink/document layout, five inline SVG
  topic icons, a conceptual handover illustration and the existing EN/ID title/tag/body copy. The left caption
  describes design files, source code and access/documentation; it is artwork, not software proof. Styles are
  component-scoped, text stays static, and no JavaScript or external assets are needed. The old shared Rows
  component has been removed after its sole Home caller was replaced. Research and integration notes:
  `docs/design/motion-refresh/README.md`.
  Home Problem uses three localized tabs in Problem.astro to show scattered order updates, a shared record and AI assistance. The panels show a source inbox, a sample order record and a draft awaiting review. Desktop pairs stacked controls with a preview. Phones put compact tabs above the preview. The shared keyboard tab helper switches panels on demand. Rotation runs in view at eight seconds per stage with a countdown bar, stops on manual selection, offers a pause control, and starts paused with reduced motion. All panels remain readable without JavaScript, and the real-project proof link remains separate.
  Home Notes uses tinted cards, intact white diagram panels and equivalent image/title/read-note links; the existing rail behavior remains.
  Notes use explanatory diagrams with EN/ID labels and four WebP sizes. Process scenes are SVG with HTML labels;
  shared page bands use CSS and Katalhys geometry. `images:editorial` runs through Node TypeScript stripping.
- Work screenshots: raw PNGs live in ignored `.work-capture/<slug>/`. `scripts/compose-work-images.ts` keeps
  desktop/mobile and curated supporting screens at source resolution as high-quality WebP under
  `src/assets/img/work/<slug>/`; it also makes a 1800×1000 desktop-and-mobile `pair.webp` for cards and an OG JPEG.
  Work catalogue cards additionally select 720px `pair-mobile.webp` through srcset; regenerate these after replacing
  any pair with `node docs/design/mobile/prepare-work-thumbnails.mjs`. Home Work and related cards select 720/1800px covers; Work details retain full-resolution original links. The same script makes four 320px service/engagement previews; mobile uses those while desktop proof keeps its original.
  The detail view shows both full-resolution screens and ordered feature screens from `portfolio-features.ts`.
  Work detail hero screens remain side by side on phones, with desktop left and phone right; full-resolution links remain. Service chips link to the localized Work catalogue's `service` filter. Previous/next cards expose 44px directional arrow circles. Four source-audited studies include optional localized `ai` copy with three grounded use cases: order-sales, industrial-coatings, field-projects and activity-review. Other studies retain their verified scope; do not infer AI integration from a company/program name. Audit sources: `docs/design/mobile/2026-10-22-work-feedback.md`.
  Redactions are defined in `scripts/work-redactions.json`; check every asset for private data before publication.
  The Order & Field Sales hero pairs Beranda Operasional on desktop with regional and 12-month Sales charts on mobile. The supporting screens show an external delivery in the five-stage order workflow, the strategic report, and the Sales funnel. All were captured in Codex browser against a separate demo SQLite database inside ignored `.work-capture/order-sales/`. Never migrate or seed the source application's database.
- Brand: `src/data/brand.ts` owns the flowing logo 09 geometry, its navy/cyan gradient, and the Cobalt + Ink website palette. `brandArtwork()` shares the SVG paths and paint across the component and asset generators. `BrandMark.astro`
  supports color, white, and current-color variants. Header/offcanvas on light surfaces use color; the initial dark inner header
  and footer use white; the inner header returns to color after it floats. The shared EN/ID footer uses the ink background (`#17191C`), compact typography and spacing, and 44px mobile link targets. Keep the Katalhys wordmark beside the symbol. `bun run brand:assets` exports
  symbol-only SVGs under `public/brand/` and opaque white-background favicon/touch icons. Existing `renoir-*`
  CSS tokens/classes and infrastructure names remain for compatibility. Primary actions are cobalt with white text;
  inverse actions on cobalt use white with cobalt text. Color symbols retain navy `#173E72` to cyan `#64D6F2`;
  white and current-color versions omit gradients. Inline color marks use unique gradient IDs. Favicon URLs carry
  `?v=09` to refresh cached icons. Name pronunciation is not part of brand content.
  About uses real founder-project software screenshots; porcelain imagery is prohibited on public pages.
- Icons: Font Awesome Pro classes from the template (`fa-sharp fa-regular fa-arrow-right`, `fa-brands …`).
  After adding a new `fa-*` class run `bun run icons:subset`.
- Runtime-added classes must appear as strings in the JS (PurgeCSS scans each page's HTML + all built JS) or be
  added to the safelist in `astro.config.mjs`. Symptom of a miss: a style works in `bun run dev` but not after
  `bun run build`.
- Fonts: GeneralSans (headings) + Inter Variable (body, via `@fontsource-variable/inter`). Home section labels use a local uppercase Caveat Brush WOFF2 subset from Fontsource, with its OFL license alongside the file. GeneralSans
  Semibold and the existing Inter Latin variable file are preloaded in `BaseLayout`; Inter uses the metric-matched `"Inter Fallback"` face
  (`utils/_typography.scss`) so the swap causes no layout shift. Keep both measures when changing fonts.
- Performance budget (Lighthouse mobile, local `bun run serve`): Performance ≥ 95, CLS 0, TBT < 100 ms.
  Above-the-fold decorative images that can become LCP get `loading="eager"`; the single most likely LCP
  image gets `fetchpriority="high"`; large eager images that aren't LCP on mobile get `fetchpriority="low"`.
- Accessibility baseline: labels for every field, `aria-expanded`/`aria-controls` on toggles, `inert` on
  background content while overlays are open, Esc closes, visible focus, `prefers-reduced-motion` honoured.
- Pages must `export const prerender = true;` (Alchemy builds with `output: "server"`; unmarked pages would
  render on demand in the Worker).

### Animation rules (non-blocking)

- Heading and reading text stay still and visible; no character splitting, generic entrance or scroll-driven text fill.
  The old `si-text-revel-anim`, `si_fade_anim` and unused character-animation branch are removed.
- `src/scripts/anim.ts` only runs native image parallax using the existing `data-speed` formula. It is passive,
  rAF-throttled, skips offscreen images and reduced motion, and remeasures on body resize. No GSAP, SplitText
  or ScrollTrigger download for page entrance. Their installed dependencies are unchanged.
- ProcessStoryboard labels/boxes stay visible; SVG strokes draw once over 650ms with 110ms stage delays,
  using the existing reveal-lines observer. Engagement title label/dividers use small line cues. About fit
  dividers and hover/focus responses remain. Reduced motion/no-JS retain complete static content.
- Hero copy stays static over its controllable video. Work selection crossfades in place over 500ms; the shared grid reserves the tallest panel to prevent layout jumps.
- Never enable `scroll-behavior: smooth`; native scroll and keyboard focus must retain predictable positions.
  There is no pinning, scroll capture, lag scroll, preloader or custom cursor.
- Home service ring turns once every 90 seconds in view. Hover, focus, pointer hold, explicit pause, a selected preview, or a hidden tab stops rotation. Reduced motion starts paused and keeps selection immediate. Scrolling has no effect on the angle.
- Home Work uses five native tabs in `homeRank` order, advancing every four seconds in view. Field Project Monitoring (field-projects) is fourth and operations-control is fifth. Hover over
  controls, focus within content, hidden tabs, offscreen state and explicit pause stop rotation. Reduced motion
  starts paused. Arrows/Home/End select tabs; no-JS keeps every panel readable. Work crossfades keep the outgoing panel inert/aria-hidden while it is painted beneath the next panel. Inactive panels reserve stage height using a scoped Bootstrap hidden-display override; visibility/inert keep them inaccessible. Only selected and next covers explicitly warm/decode when Work enters view or selection changes, and clipped active tabs scroll horizontally within their own control. Swiper remains lazy on other pages.
- The tab helper enhances only its owning wheel/Work root; wheel geometry comes from ResizeObserver contentRect rather than eager layout reads.
- Runtime enhancement uses safelisted `is-*` classes. Preserve production PurgeCSS geometry.
- InternalFlow schedules the next two-second stage boundary instead of running an eight-second rAF loop. Wheel semantic attributes update on selection; ring frames only write changing transforms. Hover disclosures return early for an already selected row. These changes retain timing, pause, keyboard/touch and reduced-motion behavior.
- Performance audit and measured before/after results: `docs/performance/2026-10-17.md`.
- Audit, per-section rationale and benefits integration: `docs/design/motion-refresh/README.md`.
  The approved document concept is enhanced and integrated into both Home locales; the separate preview preserves the original proposal.

### Promo video identity and rendering

- All four video projects and the archived v1 story source follow DESIGN.md and logo 09. The two curved fields enter separately and settle into the exact shared geometry; white variants stay white on ink. Service copy may describe AI assistance as an offer without claiming those capabilities are present in the existing Work screenshots.
- HyperFrames projects pin 0.8.166. Studio overview uses its original seek renderer with local React/Babel, fonts and SVGs. Render all five at 1080×1920 / 60fps with their existing audio. Source/output mapping and commands: promo/video/README.md; player: promo/video/review.html.
- Generated video caches, snapshots and new renders are Git-ignored. Run node promo/video/check-renders.mjs after rendering: it checks source identity, dimensions, frame rate/count, duration, H.264/AAC and full-file decoding. Existing archived MP4s remain historical; use the Katalhys output names.

## 6. Contact form & API

- UI: `components/ui/ContactForm.astro` (variants `contact`, `service`).
  Hidden honeypot `company_website`, hidden `source` (`contact` | `service:<id>` | `quiz`). Build types: marketing, internal, design, care, both, unsure.
- Quiz submissions add `channel` (`email` | `whatsapp`), `whatsapp`, `quiz_industry/goal/current/detail/size/timing`, the regular `budget` field and a client `submission_id` (UUID). Stored quiz JSON includes the derived recommendation and scope. Email is required only for the email channel; contact/service sources still require `build_type` and a 10+ character message.
- Use the canonical `/api/contact/` (trailing slash) in forms and fetches; `/api/contact` answers 308 because of `trailingSlash: "always"`.
  Astro's origin check rejects cross-site form POSTs (403), so API tests must send `Origin`.
- Client (`scripts/contact-form.ts`): on first focus `GET /api/contact/` → `{ sitekey }`, then loads Turnstile
  (explicit render, `interaction-only`). Submit waits up to 10s for the widget token, so a fast visitor does not get a captcha error. Submit via `fetch` (JSON). Without JS the form POSTs and gets a 303
  back to `/contact/?sent=1` or `?error=<key>`.
- Endpoint `pages/api/contact.ts` (`prerender = false`) reads bindings via `import { env } from "cloudflare:workers"`
  and runs `handleContact` from `server/contact.ts`:
  decode with `effect/Schema` → honeypot (fake success) → rate limit (5/min per IP) → Turnstile verify →
  cross-field rules (channel, quiz branch, derived recommendation) → deliver to every sink in parallel (D1 `INSERT OR IGNORE` by submission id, Telegram, Apps Script webhook). Success = at least one sink delivered; none → 500
  (so a lead is never silently dropped). The visitor IP is used for rate limit/Turnstile only and never sent to a sink.
  Status mapping: 200 sent · 400 invalid · 403 captcha · 429 rate_limited · 500 error.
- Sheet sink: Apps Script checks a shared secret sent in the body (it can't read headers), escapes formula-like cells,
  appends a row (`status`/`replied_at`/`next_step` columns for follow-up, then `whatsapp`/`channel`/`recommendation`/`id`) and emails `NOTIFY_EMAIL`. Redeploy the Apps Script after changing it.
- Admin (`/admin/`): Indonesian UI. Lead list with status tabs/counts, source filter, search, pagination; detail with quiz answers, status (`new → contacted → qualified → won/lost`), notes, follow-up date, change history and permanent delete (type HAPUS). Accounts page adds users, deactivates others (never yourself) and changes your password (other sessions end). Auth: PBKDF2-SHA256 (100k), 32-byte session token stored as SHA-256, `__Host-katalhys_admin` HttpOnly/Secure/SameSite=Strict cookie (7 days), Origin check on every POST, login/setup rate limit, `no-store` + `noindex`. First account: set `ADMIN_SETUP_TOKEN`, deploy, open `/admin/setup/` (works only while no account exists), then clear the token.

## 7. Infrastructure

- Stack `renoir-landing` (`alchemy.run.ts`), state stored in Cloudflare (`Cloudflare.state()`).
- `Cloudflare.Website.Astro("Website")` with `astro.output = "server"` (**not** `"static"`: static = assets-only
  deploy with no Worker, which drops `/api/contact`), `sessionKVBindingName: false`,
  `assets: { notFoundHandling: "404-page", htmlHandling: "auto-trailing-slash", runWorkerFirst: ["/api/*", "/admin", "/admin/*"] }`.
  Worker-first routing is required: browser navigations (and no-JS form posts) that match no asset are otherwise
  answered with the 404 page by the asset layer before the Worker runs (`assets_navigation_prefers_asset_serving`).
  Keep the same list in `scripts/e2e-worker.ts`. Prerendered pages are served
  by the asset layer without invoking the Worker (keeps the free-plan request quota for the API).
- Bindings: `THROTTLE` (RateLimit ns 1001, 5/60s), `TURNSTILE_SITEKEY`, `TURNSTILE_SECRET`, `TELEGRAM_BOT_TOKEN`,
  `TELEGRAM_CHAT_ID`, `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET`, `DB` (D1 `LeadsDB`, migrations applied on deploy; each PR preview gets its own), `ADMIN_SETUP_TOKEN`. Typed in `src/env.d.ts`. `observability` is on (Workers Logs).
- Turnstile's free plan caps widgets per account, so only `prod` creates one; other stages use Cloudflare's always-pass test keys.
- Config via `effect/Config` (`.env` locally, GitHub secrets in CI; see `.env.example`):
  `WORKERS_DEV_SUBDOMAIN` (required for prod; Turnstile allowed domain), the four lead-sink values above, optional `ADMIN_SETUP_TOKEN`,
  `GITHUB_OWNER`/`GITHUB_REPO` (PR preview comments).
- No custom domain yet: every stage lives on `*.workers.dev`. When a domain exists, add it to the Turnstile
  `domains`, set `astro.site`, and attach the domain to the Website (see Alchemy custom-domains guide).
- Stages: personal default stage locally, `prod` from `main`, `pr-<n>` previews (destroyed when the PR closes).
- CI secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (declared in `stacks/github.ts`); contact secrets `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET` are configured separately.
  The setup stack also publishes `WORKERS_DEV_SUBDOMAIN` as a repository variable; workflow reads variables before legacy account/subdomain secrets. CI token includes Secrets Store access and separate account/zone resource scopes. This describes declared configuration, not verified remote secret availability.
- CI runs `bun test`, `bun run check`, then `bun run build && check:links && check:copy` before deploying. `scripts/check-deploy-env.ts` rejects missing credentials, a missing automatic GitHub token for PRs, malformed production hosts and non-PR cleanup targets before cloud commands. Both cloud steps pass `secrets.GITHUB_TOKEN` for the PR comment provider. One workflow handles main production, trusted PR previews, PR cleanup and manual production dispatch on main. Stage-based concurrency serializes a PR preview with its cleanup; fork/Dependabot PRs run code checks without cloud writes. Setup, routine updates and manual recovery: `docs/deployment.md`.
- Free plan limits to keep in mind: 100k Worker requests/day, 10 ms CPU per request, 3 MB compressed Worker
  bundle (currently ~0.9 MB uncompressed server output), 20k static asset files.
- Docs: https://alchemy.run/llms.txt (guides index), https://alchemy.run/llms-full.txt (resource reference).
  The installed sources in `node_modules/alchemy/src` and `node_modules/@alchemy.run/frontend-frameworks/src/astro/README.md`
  are more current than the website in places (e.g. `locals.runtime.env` is gone; use `cloudflare:workers`).

## 8. Agent skills (`.agents/skills`, symlinked into `.claude/skills`)

| Skill | Use for |
| --- | --- |
| astro, astro-framework, docs-lookup | Astro APIs (version-sensitive: this is Astro 7) |
| astro-best-practices | baseline for every component/page change |
| create-component, migrate | converting template markup into components |
| content-collection | services/team/portfolio/blog data |
| astro-seo | phase 3 |
| copywriting | any user-facing copy (source of truth: `docs/renoir-run.md`, approved text: `docs/copy/copy-deck.md`) |
| cloudflare | choosing Cloudflare products (domains, email, caching…) |
| workers-best-practices | runtime code in `/api/*`. Ignore its wrangler config advice: IaC is Alchemy |

Removed as conflicting/duplicate: `astro-expert`, `add-integration` (could add an adapter that breaks the Alchemy build).

## 9. Known gaps / TODO

- Performance audit on 2026-10-17: final Home EN/ID each scored 92 in three cold mobile lab runs, accessibility 100, CLS 0 and TBT below 100ms; the >=95 Home target remains open. Home transfer fell about 59% to 1.16 MB. Seven inner routes scored 95-97 in single final runs. Full methods, caveats and source changes: docs/performance/2026-10-17.md. These results supersede older Home performance samples below; physical devices and deployed CWV remain unverified.

- Home refresh local built-page Lighthouse on 2026-10-16 measured ID 97 / EN 99 performance,
  accessibility 100, TBT 0 / 5.5ms and LCP 2.48 / 1.96s. CLS is below 0.001 (about 0.000086),
  rather than exactly zero; a tiny font-swap shift remains. These are individual local runs,
  not site-wide or deployed CWV guarantees. Details and Chrome checks: `docs/design/home-refresh/README.md`.

- Internal Systems EN/ID now includes the approved conceptual order scene. Local built-page Lighthouse on
  2026-10-11 measured ID 97 / EN 98 performance, accessibility 100, CLS 0 and TBT 0ms in both final runs;
  these are not site-wide or deployed CWV guarantees. Integration checks and remaining limits:
  `docs/design/inner-pages/implementation.md`. Other inner-page designs remain pending.

- Public-page stock photography has been replaced with Renoir campaign artwork, real founder-project screenshots, and
  SVG/CSS geometry. `docs/brand/editorial-image-system.md` records the generation brief. Final approval of all
  public assets and Work permissions is still required before launch.
- Katalhys flowing logo 09 and the confirmed Cobalt + Ink website palette are implemented for local review; co-owner approval is pending before launch.
  The intended canonical domain is `katalhys.com`; verify ownership, DNS, and Turnstile configuration before deployment.
  Historical Renoir explorations remain archived. All five active promo video variants now use Katalhys logo 09, Cobalt + Ink and GeneralSans/Inter; original source backups are under ignored .work-capture/video-before-rebrand/.
  WhatsApp remains conditional on a verified contact-center number; `site.whatsapp` is currently `null`.
- Work now presents eight founder projects with EN/ID detail pages, paired desktop/mobile screens, feature stories, service filters, project OG images, and sitemap entries. The operations-control study still uses a sanitized architecture diagram and requires owner-provided Komodo access for its final dashboard screenshot. Client logo marquee and testimonials stay unpublished until real names/assets/quotes and permission exist.
- SEO/GEO implementation is partial; verify final domain, OG assets and actual business details before launch.
- Swiper chunk is ~80 KB (the `swiper/modules` barrel isn't tree-shaken); loaded lazily, acceptable for now.
- Home and Process FAQs share the localized handover card and desktop hover expansion; Home/Services/Process engagement panels also animate on desktop hover. Keyboard/touch activation remains available, with reduced-motion and no-JS fallbacks. Other accordions keep their existing click behavior. About breadcrumbs use the short About / Tentang label; menu bars inherit the button color on dark and scrolled light headers.
- Search prefers the built `/pagefind/` full-text index. A prerendered `/search-index.json` catalog covers all
  localized public pages, services, project studies/features and Notes content when Pagefind is unavailable
  (including development). Fallback matches all query words, normalizes accents and prioritizes titles.
  There is no product collection; product/project examples belong to Work.
- The owner reports an earlier manual CLI deployment; live Cloudflare resources and stage were not verified in this audit. GitHub runs #4/#5/#6 failed because CI credentials/config were unavailable, after code/build gates passed. The local default Cloudflare OAuth profile is present but expired; the owner reports failed refresh and denied browser authorization. Reconfigure that provider through Alchemy, using a scoped stored API token if OAuth remains unavailable. GitHub CLI and the Alchemy GitHub/admin setup profile are not authenticated. Remote setup and a successful CI deploy remain pending owner-approved setup; contact delivery still needs a live submission check for each form variant.
- Lead funnel: `test:e2e` runs the built Worker in local workerd with a fresh D1 (contact API, idempotency, rate limit, admin setup/login/list/detail/update/delete/accounts/logout, phone and desktop browser submissions through Turnstile test keys). Still unverified on Cloudflare itself: a deployed stage, the CI token's new `D1 Write` permission (rerun `stacks/github.ts` before the next CI deploy) and live Telegram/Sheet delivery. Before launch: fill `site.legal`, approve legal text and `leadRetentionMonths`, set `site.whatsapp`/`email`, redeploy the Apps Script.
- Analytics not wired yet: plan is Cloudflare Web Analytics (CWV) + Umami Cloud (events, `data-domains` = prod host), Search Console + Bing Webmaster, Better Stack uptime on `/` and `GET /api/contact`.
- Local Lighthouse mobile on 2026-09-29 measured Home performance 89, CLS 0, TBT 230 ms before the final hero
  priority hint; a second run varied substantially (69 / 0 / 1000 ms). Both identified ScrollTrigger as a long task.
  After native mobile reveals, the local result was 87 / 0 / 270 ms. ScrollTrigger no longer loads on phones;
  style/layout work from the template remains above the TBT budget and needs a separate performance pass.
- Campaign image review on 2026-10-01 checked 66 EN/ID route/viewport combinations without broken images or
  horizontal overflow. Three local mobile Lighthouse runs measured 94/93/94 performance, CLS 0 throughout,
  and TBT 104/0/0 ms. The performance >=95 gate is still unmet; the final run's LCP was 2.78 seconds.
  Shipped editorial assets total 0.79 MB (previously 1.73 MB); `_astro` assets total 8.22 MB (previously 9.26 MB).

## Changelog

- 2026-11-14 - Removed the E2E GitHub workflow at the owner's request; `bun run test:browser` stays a local pre-push check. CI keeps unit tests, types and build/link/copy/SEO guards.

- 2026-11-14 - Added `test:e2e` (built Worker in local workerd + D1, 14 API/admin/browser scenarios) and `test:browser` (all Chrome suites + E2E), run locally before pushing. Fixed issues it found: `/api` and `/admin` were unreachable by browser navigation on Cloudflare's asset layer (now `runWorkerFirst`), forms posted to the 308-redirecting `/api/contact` (now `/api/contact/`), and fast submits could fail Turnstile (submit now waits for the token). Compacted Home Paths, Problem, Process and Work and the Order & Field Sales phone feature to one phone screen; fixed the hero-video check scrolling away from the hero. All suites pass. No deployment.

- 2026-11-14 - Rebuilt the desktop menu after reviewing DewataTech's live navigation: guiding question, icon service cards with benefit lines and an AI badge, featured quiz card, footer links, header quiz pill, all parents as links. Added Home “Start here” with the four services and key-page buttons, plus a hero quiz link. Deepened the questionnaire to seven questions with first-step size, sector example, first-call agenda and industry-matched proof; server validation, admin labels, tests and `check-funnel.mjs` follow. No deployment.

- 2026-11-13 - Added the DewataTech-informed lead funnel: Find your first step EN/ID questionnaire (result before contact, no prices, email or WhatsApp reply), D1 lead store with idempotent submits, password-protected Indonesian admin for leads and accounts, how-we-work page with 30-day bug fixing, privacy/terms/cookie drafts, cookie choice banner, desktop Services/Resources menu panels and footer legal row. Organization JSON-LD gains an unpriced OfferCatalog; sitemap, llms.txt and llms-full cover the new pages; `check:seo` and `check-funnel.mjs` guard them. Plan and decisions: `docs/design/2026-11-13-lead-funnel-plan.md`. No deployment.

- 2026-10-29 - Resumed the client deck as v7 from the owner's manually edited v6, preserving all 39 existing slide IDs/text and adding a demo sales-module appendix. Delivered 40-slide PPTX/PDF and portable companion files, retained one automatic whole-page effect per slide, verified package/font/layout/content continuity, rendered through PowerPoint and inspected desktop Slide Show. Contacts remain placeholders. No source-app, database, dependency or deployment changes.

- 2026-10-29 - Added a Katalhys sales-module showcase at `/resources/sales-playbook/`: ten chapters, anonymous demo clients, a duration estimator, product filter, local checklist, scored quiz and complete PDF companion. Reused existing brand fonts, geometry and Lucide assets; disclosed source-date and cancellation-denominator limits. Original supplied HTML remains untouched. Source, preview and checks are documented under `promo/sales-module/`; no dependency changes or deployment.

- 2026-10-25 - Audited every client-deck slide and revised v3 to 28 main slides plus 9 appendices. Removed the expert-profile study and reused assets from this deck only; varied service/case layouts and copy. Ran Proteksindo against an isolated demo database, added 16 synthetic projects with at least two cards per Kanban stage, and captured five screens. Added explicit Slide Show animation enablement, 37 Push transitions, 42 image effects and a PowerPoint-rendered motion sample. Source, audit, checks and UI-automation limits are documented under promo/pitch-deck; no source-app database writes, site dependencies, commit or deploy.

- 2026-10-24 - Installed the owner-requested sales-enablement, frontend-slides and presentation-design skills in the user skill directory and applied their narrative/editorial principles to the native PPTX. Completed v2 with AI Powered Software House positioning, varied ink/cobalt layouts, original illustrations/screenshots, 38 transitions and 59 image effects. Restored all 38 slides to the live visual preview; editable PPTX/PDF and validation limits are documented in promo/pitch-deck/README.md. No site dependencies, commit, deployment or source-app data changes.

- 2026-10-24 - Recorded the owner's pitch-deck positioning change to AI Powered Software House and rejection of the initial plain visual direction. Added a source-checked skills.sh comparison at `docs/research/pitch-deck-skills-2026-10-24.md`; external skills remain uninstalled. The revised local deck candidate is a draft pending visual selection and final animation/QA; earlier validation applies to v1 only.

- 2026-10-24 - Added the Indonesian Katalhys client pitch-deck source under `promo/pitch-deck/`: 29 main slides plus 9 optional discussion slides, original Work screenshots, founder-role credits, speaker notes, native PowerPoint fade transitions and image animations. Authoring/export commands and limitations are in its README; generated output and private checks are ignored. No dependency changes, source-project startup, or deployment.

- 2026-10-19 - Applied the owner's denser mobile direction after measuring each Home section and reusable inner component. Reflowed the Problem canvas into three compact sources, scaled benefits artwork and full copy, shortened expanded service stages, added native Work detail disclosure, tightened engagement/FAQ/Notes and footer, and replaced individual navbar boxes with one search/Menu control group. Removed the logo backing and retained ink wordmark after the hero. Researched live Linear/Vercel/Framer/Stripe mobile headers and added section/state/component height checks; no dependencies or deployment.

- 2026-10-19 - Refined mobile scale across shared navigation, overlays, engagement/FAQ/footer, Home service/Work/Process composition, service inquiry and Work/Notes details. Reused native Process disclosures, corrected mobile FAQ icon specificity, exposed service choices in two columns and moved the Home phone contact CTA into document flow. Added built-page route/viewport and touch/keyboard/fallback checks. Approved copy and existing desktop compositions retained; no dependency changes or deployment.

- 2026-10-17 - Audited generic text entrance across seven heading owners and image/process fade hooks; removed character splitting and translation-based text entrance across EN/ID. Added finite process-line drawing and in-place project crossfades. Documented component research and an isolated bilingual benefits preview; live benefit rows await design selection. No dependency changes or deployment.

- 2026-10-17 - Applied Home feedback: restored separate-logo navigation and floating inner-page navigation, dark breadcrumb, darker video with hero facts removed, compact cobalt service ring with native scroll/image drag and service hover links, white Work with three-second rotation and accessible pause, Home engagement hover and a content search fallback. Added focused Chrome checks and presentation-tools research; no dependency changes or deployment.

- 2026-10-15 - Replaced the stepped logo with the selected flowing logo 09, shared navy/cyan SVG gradients, white/mono variants and refreshed white-background icons. Applied the confirmed Cobalt + Ink palette to website UI, explanatory diagrams and campaign artwork; updated the EN/ID logo meaning and regenerated OG assets. Separated the 404 return button from heading decoration to prevent mobile overflow. Infrastructure preserved; no deployment.

- 2026-10-15 - Applied the selected Katalhys logo 08 and Midnight Blue + Cyan palette for local review; added shared SVG geometry, color/white/mono exports, white-background favicon/touch icons, localized brand metadata and regenerated campaign/Notes/OG artwork. Removed obsolete name pronunciation and porcelain origin story. Co-owner identity approval and production domain configuration remain pending; no deployment.

- 2026-10-12 - Recorded the owner's no-closing-period rule for EN/ID website headings and promotional titles; applied it to the three enhanced Instagram carousels while keeping their restored original wording, captions and current visual design. Regenerated the 21 JPEGs and previews.

- 2026-10-12 - Restored original copywriting for all three Instagram carousels from `.work-capture/instagram-before`, including 21 headings, main slide copy, CTAs and the three caption bodies. Enhanced SVGs/screenshots retained; spacing adjusted for the restored text, alt texts synchronized, JPEGs and previews regenerated.

- 2026-10-11 - Enhanced all three `promo/gambar` carousels: shared `carousel.css`, six custom service/workflow SVGs, larger real project screenshots, Indonesian copy and per-slide alt text, 21 regenerated 1080x1350 JPEGs and combined previews. The renderer validates image loading and text bounds; original versions are backed up under ignored `.work-capture/instagram-before`. Fixed inner mobile Services pressed/hover/focus colors and split descriptions into a lead sentence and supporting text without removing copy.

- 2026-10-11 — Added Instagram posts #1 `01-hello-renoir` (introduction: who, services, fit, why Renoir, how to start) and #2 `02-why-renoir` (origin story: three recurring problems and Renoir's answer), each seven slides with caption and alt text; the earlier panorama moved to post #3.

- 2026-10-11 — Added `promo/gambar/` Instagram pipeline (`render.mjs`: HTML canvas → 2× Playwright capture → Lanczos 1080×1350 JPEG) and post #3 `03-sketch-to-running` (first drafted as #1), a seven-slide panorama carousel through the Industrial Coatings project, with caption and alt text.

- 2026-10-11 — Integrated the approved Internal Systems concept into its existing EN/ID service pages after the owner's three-minute timer: native four-stage playback, mobile focus crops and accessible static/error states; original proof, metadata and contact flow preserved. No deployment.

- 2026-10-11 — Added inner-page visual research and isolated Internal Systems concept review: 12 attributed references, component audit, four EN/ID storyboards, AI-generated 3D concept artwork and an interactive review prototype. Logo/palette/fonts preserved; production integration awaits design review.

- 2026-10-11 — Rendered the owner-approved `spreadsheet-to-system-clone` MP4 at 1080×1920, 60 fps, 28.5s with music/SFX; verified H.264/AAC metadata and full-file decoding. Original video project remains unchanged.

- 2026-10-11 — Added independent `promo/video/spreadsheet-to-system-clone` draft: earlier Renoir introduction, four sequential service showcases, larger Work imagery, clearer service-scope panel and CTA. Original project remains unchanged; clone storyboard and preview await owner review before export.

- 2026-10-11 — Added `promo/video/delivered-running`: third IG Story (27s, 60 fps, consideration stage) contrasting a vendor zip handover with a Renoir handover receipt and running system; spec in its `STORYBOARD.md`, Mixkit "Motivating Mornings" in `CREDITS.md`.

- 2026-10-11 — Rebuilt `promo/video/spreadsheet-to-system` as v2 "Where's the answer?" (28.5s, 60 fps, spec in its `STORYBOARD-v2.md`): `#REF!` macro hook, spreadsheet data matching the Order & Field Sales system, real screens answering the hook's questions, bento services, grain/edge labels. v1 kept in its `archive/`.

- 2026-10-11 — Added `promo/video/studio-overview`: the Claude Design promo export plus `render-60fps.mjs`, which re-renders it at 60 fps with its music via the design's seek event, Playwright and FFmpeg.
- 2026-10-11 — Added `promo/video/spreadsheet-to-system`: first 22s 1080×1920 Instagram Story promo built with HyperFrames (run via `bunx`), real Work screens, a mobile capture of `/id/`, Mixkit music/SFX (licences in its `CREDITS.md`).

- 2026-10-01 — Replaced abstract imagery with a photographic Renoir identity campaign, publication/print About images, authentic service screenshots, and localized Notes diagrams; restored bounded desktop hero parallax, added responsive hero sources, and removed retired raster assets.
- 2026-09-29 — Replaced public stock photography with material editorial WebP, a responsive hero, real Work proof on Home and service details, a process SVG, and locale OG artwork; curated Notes crops and removed unused template raster/SVG assets. Added the Sharp composition workflow and image brief.
- 2026-09-29 — Switched phone reveal animations to native IntersectionObserver/Web Animations so mobile pages do not download GSAP, SplitText, or ScrollTrigger for decorative motion.
- 2026-09-29 — Dropped D1 and Resend: leads now go to Telegram + Google Sheet/email (Apps Script) in parallel, IP no longer stored. Turnstile widget on prod only (test keys elsewhere), Workers Logs on, `public/_headers` (workers.dev noindex, immutable `/_astro/*`), CI runs build + link/copy guards, CI token gains custom-domain permissions.
- 2026-09-29 — Added The Joint SVG/favicon and editorial About illustration; refined About fit, Services interaction and engagement layout, home process reveals and four-project carousel; replaced the Order & Field Sales mobile hero with an isolated-demo Sales Dashboard capture.
- 2026-09-29 — Reworked Work cards around intact 9:5 desktop/mobile screenshot pairs and detail pages around full-size screens plus ordered feature stories; added a readable solid header on detail pages, source-resolution WebP processing, and targeted demo-screen redaction.
- 2026-09-28 — Replaced Concept Work data and layouts with eight bilingual founder project studies; added responsive screenshots, Sharp/Playwright capture workflow, project OG images, SEO indexing, and concise consultation CTAs.
- 2026-09-22 — Restored five bilingual, noindex Concept Projects and detail routes; added Work/Notes URL filters, featured work, sticky Notes rail, native command-palette search, service engagement rail, direct About navigation, cobalt CTA system, and The Joint logo concept sheet.
- 2026-09-22 — Removed the remaining public stock-avatar proof, added provisional logo-direction artwork and recorded the visual system in `DESIGN.md`; final proof assets remain gated on owner permission.
- 2026-09-21 — Phase-2 pass: bilingual four-service positioning, honest Work holding page, no fake team/testimonials/logos, responsive UI/navigation/Notes/search/contact refinements. Switched Astro config to `.mjs` with content dependency prebundling to restore local checks on Windows.
- 2026-09-17 — Parallax rewritten to ScrollSmoother's formula (no zoom); matches the demo's hero overlap.
- 2026-09-17 — Motion fixes: restored `data-speed` image parallax (hero, portfolio), earlier text reveals, removed smooth scroll-behavior, fixed invisible testimonial quote icon (`box-sizing: content-box`).
- 2026-09-17 — Phase 1: Astro 7 clone of 12 Averix pages, collections, contact API (Effect + D1 + Turnstile + Resend), Pagefind, PurgeCSS, WebP images, Alchemy stack + GitHub Actions CI, skills cleanup.


- 2026-10-11 — Replaced About porcelain imagery with real software proof, added service-specific engagement visuals and a localized FAQ handover package; enabled animated hover on inner-page disclosures, removed the custom pointer, and simplified the floating CTA to Make the call! / Hubungi. Porcelain imagery is prohibited on public pages.


The copy guard permits the owner-approved exclamation mark only in the floating CTA spans; other copy remains guarded.
- 2026-10-11 - Added mobile-only inner-page styling in src/styles/_inner-mobile.scss, scoped by BaseLayout inner-page class: compact service proof cards, native process disclosures, two-column Work/Notes, visible compact form labels, smaller About facts and footer. Inner mobile contact CTA is in document flow before the footer; Home remains unchanged. Research and responsive QA live in docs/design/mobile/.
- 2026-10-16 - Restored the shared EN/ID footer from cobalt to the existing ink background, preserving white copy, brand variants, links and layout. No deployment.
- 2026-10-16 - Rebuilt the EN/ID Home hero around the supplied optimized video, replaced the pill navbar with a single floating bar, introduced a nine-image/four-service wheel and four-project tabs, and aligned the internal-system offer around operator-assisting AI. Added generated service art, local video/posters, progressive fallbacks, and Chrome regression checks. No dependency changes or deployment.

- 2026-10-17 — Rebranded all five promo video variants to Katalhys logo 09, Cobalt + Ink and current service positioning; refreshed the website capture, adapted logo motion, localized studio runtime/fonts, and upgraded HyperFrames to 0.8.166. Added the five-video review page and MP4 verification command; no deployment or publishing.

- 2026-10-17 — Enhanced the owner-approved benefits concept and integrated it into both Home locales: five SVG topic icons, a handover-file illustration, complete existing benefit explanations and compact responsive spacing. Removed unused Rows, extended built-page Chrome checks and documented the composition; no dependencies or deployment.

- 2026-10-17 — Added the existing Proteksindo study as Home project four and moved operations to five. Changed autoplay from three to four seconds; added 500ms panel crossfades, stable stage sizing, inert outgoing content, in-view cover warming and local active-tab scrolling. Extended timing/transition/fallback checks; no dependencies or deployment.

- 2026-10-17 - Enabled the existing Process FAQ handover card and hover expansion on Home EN/ID, shortened About breadcrumbs to About / Tentang, and fixed menu bars inheriting ink on dark headers. Extended focused Chrome regressions; no dependencies or deployment.

- 2026-10-17 - Ran the requested performance swarm: responsive Work/service previews, smaller portrait hero and hashed caching, Inter preload, unused-keyframe pruning, stage timers and fewer hover/wheel writes. Anonymized internal/expert public copy while retaining marketing names and original screenshot pixels. Extended built-page guards; no dependency changes or deployment.

- 2026-10-17 - Integrated the researched Home Problem workflow composition and clearer Notes cards with linked images and per-note CTAs. Scoped tab initialization and removed wheel startup forced layout. EN/ID, phone, no-JS and reduced-motion checks retained; no dependencies or deployment.

- 2026-10-17 - Verified the integrated performance/design build: 15 Home, 26 motion, 11 runtime/visibility and 10 focused design scenarios, EN/ID feedback flows, 10 unit tests and 45-page link/copy guards. Recorded repeated Home results and the still-open >=95 Home score target; no deployment.

- 2026-10-17 - Fixed Work catalogue service badges escaping to the page origin by positioning their thumbnail container. Added EN/ID desktop/mobile containment and filter regression checks; navbar and mobile badge design retained. No deployment.

- 2026-10-17 - Diagnosed production/PR CI failures from unavailable runner configuration. Added descriptive run names, main-only manual dispatch, stage-based serialization, trusted-PR cloud writes and tested credential/cleanup guards. Extended the Alchemy setup stack with the Workers subdomain variable, Secrets Store permission and correct zone resource scope. Added docs/deployment.md; no commit, push, cloud deploy or resource deletion.

- 2026-10-17 - Investigated expired Cloudflare OAuth and denied reauthorization without exposing credentials or changing profiles. Documented reconfiguration with a scoped API token, protected prompts, same-account selection and a separate stored-token admin profile for CI setup. No authentication, dependency upgrade or cloud deploy executed.

- 2026-10-22 - Applied the owner's mobile offcanvas feedback: divided navigation rows, stationary ink text with a 110ms cobalt underline/arrow confirmation, explicit keyboard focus and a wrapping 12px-gap project/language row. Native navigation exceptions and reduced motion stay immediate; closing cancels pending navigation. Fixed production PurgeCSS removal of grouped pseudo-states and added 43 focused Chrome checks plus research/QA documentation. No dependencies or deployment.

- 2026-10-22 - Resolved white mobile Menu/search text caused by mixed-selector specificity, restored viewport-fixed phone CTAs, kept Work hero screens horizontal, linked service chips to catalogue filters and added directional project cards. Audited all eight source projects read-only and added EN/ID AI benefits, role credit and search tags to four verified integrations. Added Work/mobile regression coverage and updated the earlier CTA check; no source-project writes, dependencies or deployment.

- 2026-10-22 - Compacted Notes card headings and localized date/author metadata, centered and sized the phone search dialog, grouped service paths and added existing Recent Notes thumbnails. Retained native search, query results and fallback behavior; added focused responsive/state checks. Researched six comparable studios through live pages and primary sources, recording Katalhys gaps and proposed business priorities separately. No new assets, dependencies or deployment.

- 2026-10-25 - Revised pitch deck v4 with Ghufron/Elroy origin story, current Fanos and MAXY screenshots, isolated seeded Proteksindo data, and the real Coatings admin lead tracker with synthetic leads. Added code-generated SVG/native curves, selected licensed Lucide icons, and native PowerPoint QA; no website behavior, source application database, production service or deployment changes.

- 2026-10-25 - Refined pitch deck v5 copy and main speaker notes: Indonesian explanations with familiar English technical terms, concrete headlines, and guards against em/en dashes in editable text and notes. Kept v4 assets, native ornaments, project credit and PowerPoint motion. No website copy, dependencies or deployment changed.

- 2026-10-28 - Added docs/research/pitch-deck-enhancement-2026-10-28.md: source-backed review of the v5 deck, Indonesian client context, slide-specific priorities, two proposed pages and a timed presentation route. Research only; existing deck outputs and website behavior remain unchanged.

- 2026-11-10 - Documented the DewataTech funnel, public SEO, trust features, and proposed Katalhys quiz and lead workflow in docs/research/2026-11-10-dewatatech-audit-dan-roadmap-katalhys.md. Dispatched the separate client-site audit using the Antigravity prompt in the same directory.

- 2026-11-12 - Rebuilt Home Problem as a bilingual interactive order workflow inspired by Ailene, replaced the Home Process storyboard with compact disclosures and an editorial preview, and applied Caveat Brush to Home section labels.

- 2026-11-12 - Replaced the Home Process artwork with a generated studio photograph, restored the original hero label, expanded the three Home Problem scenes and added a visible eight-second countdown, and moved the Home service ring to slow automatic rotation with interaction pause.

- 2026-11-12 - Added two-sided Katalhys business cards for Ghufron Bagaskara (CTO) and Elroy (CEO) under `promo/gambar/kartu-nama/`. Includes editable Canva import, rendered PNGs, and a print proof. WhatsApp and LinkedIn fields await confirmed details.

- 2026-11-12 - Revised Katalhys business cards with the original color logo, personalized fronts and a shared Indonesian studio and services back. The v2 preview, Canva import and print proof live under `promo/gambar/kartu-nama/renders/v2/`; v1 exports remain available.

- 2026-11-12 - Compacted the shared EN/ID footer and recaptured all Order & Field Sales images from local Fanos checkout 72307ba with isolated simulation data. Refreshed the hero, supporting screens, cards, service/Home previews and OG image, and aligned the case study with the five-stage workflow.
