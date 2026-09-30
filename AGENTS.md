# AGENTS.md — Renoir landing

Single source of context for AI agents working on this repo. Read it fully before changing anything, and
**update it in the same change** whenever you alter something it describes (stack, commands, structure,
conventions, infra, TODOs). Add a line to the changelog at the bottom.

## 1. What this is

Marketing site for **Renoir**, a digital studio. Brand/company brief: [`docs/renoir-run.md`](docs/renoir-run.md).

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Clone 12 pages of the purchased **Averix** HTML template into Astro, as close to the original as possible, with high performance; working navigation (no dead links), working contact form, static search, IaC + CI ready to deploy | **Done** (not deployed yet) |
| 2 | Renoir positioning, bilingual copy, four services and UI polish; replace demo imagery and approve final logo/client proof before launch | In progress |
| 3 | SEO + GEO (metadata, structured data, sitemap, OG images, heading hierarchy, AI-crawler readability). Use the `astro-seo` skill | In progress; final domain/proof pending |

During phase 1 the template's look wins over the brief when they conflict.

## 2. Stack

- **Astro 7** (`astro.config.mjs`), TypeScript, Bun (package manager + scripts). Node ≥ 22.12. The `.mjs` config and `vite.environments.astro.optimizeDeps` avoid Vite's Windows CJS module-runner failure.
- **Alchemy v2** (`alchemy@2.0.0-beta.77`, Effect-based IaC) deploying to **Cloudflare Workers (free plan)**.
- **Effect 4** — pinned to `4.0.0-rc.112` via `overrides` in `package.json`. Alchemy beta.77 breaks on rc.115
  (`Config.string` was renamed). Bump Effect only together with Alchemy.
- Cloudflare: Worker + static assets, **Turnstile** (spam; real widget on `prod` only), **Rate Limiting binding**, Workers Logs. No database.
- Leads go to **Telegram** (instant push) and a **Google Sheet + email** via an Apps Script web app (`scripts/leads-apps-script.gs`).
- **Pagefind** static search (index built after the Astro build).
- **Sharp** and **Playwright** are dev dependencies for preparing and reviewing Work screenshots; neither runs on the deployed site.
- **GSAP** (core + ScrollTrigger + SplitText, loaded lazily) and **Swiper** (lazy) on the client. No jQuery,
  no Bootstrap JS, no UI framework islands.
- Styling: the template's own SCSS (Dart Sass) + stock **Bootstrap 5.2.3 CSS** (the template's version).
  At build all CSS is **inlined into each page and purged per page** (`purge-unused-css` integration in
  `astro.config.mjs`): no render-blocking stylesheet request, ~60–75 KB raw CSS per page instead of ~350 KB.
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
bun alchemy deploy     # deploy personal dev stage   ← ASK THE OWNER BEFORE EVERY DEPLOY
bun alchemy deploy --stage prod
bun alchemy destroy --stage <stage>
bun run images:mirror  # one-off: download demo images (already done; output committed in src/assets/img)
bun run images:optimize# convert new jpg/png in src/assets/img to WebP (deletes originals)
bun run images:editorial # ignored editorial masters → final WebP crops, proof composites, locale OG
bun run icons:subset   # regenerate Font Awesome subset after adding/removing fa-* icons
node --experimental-strip-types scripts/capture-work-sources.ts <slug> <url> [desktop-path] [mobile-path]
bun scripts/compose-work-images.ts <slug>  # ignored raw PNG → full-size desktop/mobile + supporting WebP, 9:5 pair WebP, OG JPEG
```

Rules:
- **Never deploy (or run `alchemy dev`, which provisions cloud resources) without explicit owner confirmation**, one deploy at a time.
- Never tell the owner to export `CLOUDFLARE_ACCOUNT_ID`/`CLOUDFLARE_API_TOKEN` locally. Alchemy stores credentials in profiles (`~/.alchemy/profiles.json`); the first `bun alchemy deploy` prompts for OAuth or an API token. CI uses GitHub secrets.
- **Never add an adapter** (e.g. `@astrojs/cloudflare`) to `astro.config.mjs`: Alchemy injects its own and a declared adapter fails the build.
- Plain `astro build` fails by design (the `/api/contact` route needs the adapter). Use `bun run build`.
- The last line of `bun run build` on Windows may print `GetQueuedCompletionStatusEx ... ERROR_ABANDONED_WAIT_0` — workerd shutdown noise after a successful build.

## 4. Layout

```
alchemy.run.ts              Stack "renoir-landing": Turnstile widget (prod), Website.Astro (+ PR preview comment)
stacks/github.ts            One-off stack: CI API token + GitHub secrets (run manually with an admin profile)
.github/workflows/deploy.yml  push main → prod; PR → pr-<n> preview; PR closed → destroy preview
astro.config.mjs            site/trailingSlash/prefetch + integrations: purge-unused-css, pagefind-index
scripts/                    build, serve, check-links, mirror/optimize images, subset icons, leads-apps-script.gs (Sheet sink, installed by hand)
public/_headers             noindex on *.workers.dev, immutable /_astro/*, security headers
docs/renoir-run.md          brand brief (phase 2 input)
averix-modern-...-utc/      original template (git-ignored, licensed). Source of truth for phase-1 markup
src/
  assets/img/**             final editorial WebP, real Work screenshots, and remaining icon SVGs
  assets/fonts/             GeneralSans woff2 + generated Font Awesome subsets
  content/*.ts              bilingual services, eight founder portfolio projects, and ordered Work feature stories
  content.config.ts         collection schemas (astro/zod; Astro requires Zod here)
  data/site.ts nav.ts        site configuration (WhatsApp unset), the ONLY nav definition
  layouts/BaseLayout.astro  head, header (home/inner), offcanvas, search overlay, breadcrumb, footer, global scripts
  components/layout/        Header*, NavMenu, Offcanvas, SearchOverlay, Footer, Breadcrumb, LangSwitch
  components/ui/            Img, Accordion, ContactForm
  components/sections/      one component per template section (home/, about/, services/, pricing/, team/, blog/, shared/)
  pages/                    routes (all prerendered except api/contact.ts)
  server/contact.ts         contact form Effect program + Turnstile/Telegram/webhook helpers (+ contact.test.ts)
  scripts/*.ts              client modules (vanilla TS)
  styles/                   template SCSS (utils/theme/components/layout) + _site.scss (our additions) + global.scss
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
| — | `/404.html` | not indexed by search |
| — | `/api/contact` | on-demand (Worker) |

Team, pricing, and other unused template pages are not public routes. English and Indonesian routes share views and copy keys. Work credits identify the founder's role and avoid invented client results.

## 5. Conventions

- `.astro` first. Client code = small vanilla TS modules in `src/scripts`, imported from a component `<script>`
  (Astro bundles/dedupes them). No framework islands.
- **Keep the template's markup and class names** (`si-*`, Bootstrap grid) so the template SCSS keeps working.
  When semantics require a different element, extend the SCSS selector instead of restyling
  (e.g. `h1, .h1{`, `h3, .h3{`, `h1, .sidebar-heading{`).
- Anchors without a destination must not use `href="#"`: use `<a class="no-href">` (the class stops Bootstrap's
  `a:not([href]):not([class])` reset) or a real `<button>`. `bun run check:links` enforces this.
- Navigation comes only from `src/data/nav.ts`. Add a route there only once the page exists.
- Images: put final files under `src/assets/img/<section>/`, reference with `<Img src="section/name.webp" />`.
  Legacy .jpg/.png names resolve to `.webp`. CSS backgrounds use `imageUrl()`
  from `~/lib/images`. Hero/LCP images: `loading="eager" fetchpriority="high"`. Never use `astro:assets`
  `<Image>`/`getImage` — Alchemy's adapter forces the passthrough image service, so nothing would be optimised.
- Editorial masters live in ignored `.work-capture/renoir-visual/`; `scripts/compose-editorial-images.ts` makes
  the shipped WebP variants and locale OG JPEGs. Prompts and crop roles are in `docs/brand/editorial-image-system.md`.
  Service detail heroes are material illustrations; supporting images use actual Work screenshots with localized
  alt text and captions. The process diagram is SVG, and shared page bands use CSS and The Joint geometry.
- Work screenshots: raw PNGs live in ignored `.work-capture/<slug>/`. `scripts/compose-work-images.ts` keeps
  desktop/mobile and curated supporting screens at source resolution as high-quality WebP under
  `src/assets/img/work/<slug>/`; it also makes a 1800×1000 desktop-and-mobile `pair.webp` for cards and an OG JPEG.
  The detail view shows both full-resolution screens and ordered feature screens from `portfolio-features.ts`.
  On narrow Work details, the global floating CTA is hidden so it cannot cover image captions; the in-page CTA remains.
  Redactions are defined in `scripts/work-redactions.json`; check every asset for private data before publication.
  The Order & Field Sales mobile hero is the real Sales Dashboard captured against a separate demo SQLite
  database inside ignored `.work-capture/order-sales/`. Never migrate or seed the source application's database.
- Brand: `src/components/ui/BrandMark.astro` and `public/favicon.svg` share the single-colour The Joint
  geometry. Keep the wordmark beside the symbol in header, offcanvas, and footer. The About name image is
  an editorial illustration (`about/porcelain-editorial.webp`), not historical proof.
- Icons: Font Awesome Pro classes from the template (`fa-sharp fa-regular fa-arrow-right`, `fa-brands …`).
  After adding a new `fa-*` class run `bun run icons:subset`.
- Runtime-added classes must appear as strings in the JS (PurgeCSS scans each page's HTML + all built JS) or be
  added to the safelist in `astro.config.mjs`. Symptom of a miss: a style works in `bun run dev` but not after
  `bun run build`.
- Fonts: GeneralSans (headings) + Inter Variable (body, via `@fontsource-variable/inter`). GeneralSans
  Semibold is preloaded in `BaseLayout`; Inter uses the metric-matched `"Inter Fallback"` face
  (`utils/_typography.scss`) so the swap causes no layout shift. Keep both measures when changing fonts.
- Performance budget (Lighthouse mobile, local `bun run serve`): Performance ≥ 95, CLS 0, TBT < 100 ms.
  Above-the-fold decorative images that can become LCP get `loading="eager"`; the single most likely LCP
  image gets `fetchpriority="high"`; large eager images that aren't LCP on mobile get `fetchpriority="low"`.
- Accessibility baseline: labels for every field, `aria-expanded`/`aria-controls` on toggles, `inert` on
  background content while overlays are open, Esc closes, visible focus, `prefers-reduced-motion` honoured.
- Pages must `export const prerender = true;` (Alchemy builds with `output: "server"`; unmarked pages would
  render on demand in the Worker).

### Animation rules (non-blocking)

- Nothing is hidden by CSS before JS runs; content is readable without JS.
- On phones (≤767px), `src/scripts/anim.ts` uses IntersectionObserver and one native opacity/transform
  animation per revealed element. GSAP is not downloaded for these mobile reveals.
- On larger screens, GSAP (`src/scripts/anim.ts`) is dynamically imported after `load` + `requestIdleCallback`, only when the
  page has `.si-text-revel-anim`, `.si_fade_anim` or `.si-char-animation`. Tweens run once. SplitText splits
  `words,chars` only (a `lines` split reflows text → CLS). Reveals start at `top 92%` so late elements (footer
  heading) appear early. No ScrollSmoother, no smooth/lag scroll, no pinning, no scroll-jacking, no preloader.
- Image parallax = the template's `data-speed` (portfolio cards `.8`) using ScrollSmoother's
  exact formula `y = (1 - speed) * (scrollY + innerHeight/2 - frameCenterY)` inside the `.fix`
  (overflow-hidden) frame — measured identical to the live demo. The editorial hero has separate desktop and
  mobile compositions and no parallax. Implemented without GSAP at the top of `anim.ts` (runs immediately, passive
  rAF-throttled scroll listener, remeasures on body resize), so there is no jump when GSAP loads.
- **Never enable `scroll-behavior: smooth`** (template and Bootstrap both did; overridden in `_site.scss`):
  ScrollTrigger.refresh() jumps the scroll position and a smooth behavior turns that into broken trigger
  positions. Trigger positions refresh on body resize (ResizeObserver in `anim.ts`).
- In `bun run dev`, `window.ScrollTrigger` is exposed for debugging.
- Magic cursor (`src/scripts/cursor.ts`) only on `(hover: hover) and (pointer: fine)`; its rAF loop stops when idle.
- Swiper (`src/scripts/sliders.ts`) is imported and initialised per slider when it comes within one viewport
  (IntersectionObserver), so it never competes with first paint. Home Work uses `homeRank` ordering (four
  entries, independent of `featuredRank` on Work), with three cards visible at ≥1280px, two at ≥768px, one
  below. Autoplay pauses on hover, focus, hidden tabs and reduced motion; a pause/resume control is present.
- About fit rows and Services engagement dividers use the one-time `src/scripts/reveal-lines.ts` observer;
  content remains visible without JavaScript. Process reveals reuse the lazy GSAP path above.

## 6. Contact form & API

- UI: `components/ui/ContactForm.astro` (variants `contact`, `service`).
  Hidden honeypot `company_website`, hidden `source` (`contact` | `service:<id>`). Build type includes `design`.
- Client (`scripts/contact-form.ts`): on first focus `GET /api/contact` → `{ sitekey }`, then loads Turnstile
  (explicit render, `interaction-only`). Submit via `fetch` (JSON). Without JS the form POSTs and gets a 303
  back to `/contact/?sent=1` or `?error=<key>`.
- Endpoint `pages/api/contact.ts` (`prerender = false`) reads bindings via `import { env } from "cloudflare:workers"`
  and runs `handleContact` from `server/contact.ts`:
  decode with `effect/Schema` → honeypot (fake success) → rate limit (5/min per IP) → Turnstile verify →
  deliver to every sink in parallel (Telegram, Apps Script webhook). Success = at least one sink delivered; none → 500
  (so a lead is never silently dropped). The visitor IP is used for rate limit/Turnstile only and never sent to a sink.
  Status mapping: 200 sent · 400 invalid · 403 captcha · 429 rate_limited · 500 error.
- Sheet sink: Apps Script checks a shared secret sent in the body (it can't read headers), escapes formula-like cells,
  appends a row (`status`/`replied_at`/`next_step` columns for follow-up) and emails `NOTIFY_EMAIL`.

## 7. Infrastructure

- Stack `renoir-landing` (`alchemy.run.ts`), state stored in Cloudflare (`Cloudflare.state()`).
- `Cloudflare.Website.Astro("Website")` with `astro.output = "server"` (**not** `"static"`: static = assets-only
  deploy with no Worker, which drops `/api/contact`), `sessionKVBindingName: false`,
  `assets: { notFoundHandling: "404-page", htmlHandling: "auto-trailing-slash" }`. Prerendered pages are served
  by the asset layer without invoking the Worker (keeps the free-plan request quota for the API).
- Bindings: `THROTTLE` (RateLimit ns 1001, 5/60s), `TURNSTILE_SITEKEY`, `TURNSTILE_SECRET`, `TELEGRAM_BOT_TOKEN`,
  `TELEGRAM_CHAT_ID`, `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET`. Typed in `src/env.d.ts`. `observability` is on (Workers Logs).
- Turnstile's free plan caps widgets per account, so only `prod` creates one; other stages use Cloudflare's always-pass test keys.
- Config via `effect/Config` (`.env` locally, GitHub secrets in CI; see `.env.example`):
  `WORKERS_DEV_SUBDOMAIN` (required for prod; Turnstile allowed domain), the four lead-sink values above,
  `GITHUB_OWNER`/`GITHUB_REPO` (PR preview comments).
- No custom domain yet: every stage lives on `*.workers.dev`. When a domain exists, add it to the Turnstile
  `domains`, set `astro.site`, and attach the domain to the Website (see Alchemy custom-domains guide).
- Stages: personal default stage locally, `prod` from `main`, `pr-<n>` previews (destroyed when the PR closes).
- CI secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (created by `stacks/github.ts`), plus
  `WORKERS_DEV_SUBDOMAIN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET` added manually.
  The CI token already carries Zone/DNS/Workers Routes permissions for the custom domain; re-run `stacks/github.ts` after changing them.
- CI runs `bun test`, `bun run check`, then `bun run build && check:links && check:copy` before deploying.
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

- Public-page stock photography has been replaced with editorial material, real founder-project screenshots, and
  SVG/CSS geometry. `docs/brand/editorial-image-system.md` records the generation brief. Final approval of all
  public assets and Work permissions is still required before launch.
- The Joint SVG now accompanies the Renoir wordmark and replaces the favicon. The owner should review this
  direction before launch. Raster explorations and the porcelain illustration source live in `docs/brand/`.
  WhatsApp remains conditional on a verified contact-center number; `site.whatsapp` is currently `null`.
- Work now presents eight founder projects with EN/ID detail pages, paired desktop/mobile screens, feature stories, service filters, project OG images, and sitemap entries. The operations-control study still uses a sanitized architecture diagram and requires owner-provided Komodo access for its final dashboard screenshot. Client logo marquee and testimonials stay unpublished until real names/assets/quotes and permission exist.
- SEO/GEO implementation is partial; verify final domain, OG assets and actual business details before launch.
- Swiper chunk is ~80 KB (the `swiper/modules` barrel isn't tree-shaken); loaded lazily, acceptable for now.
- Accordion panels open/close instantly (Bootstrap's height animation not reproduced).
- Search needs the built `/pagefind/` index: it doesn't work under `bun run dev`.
- Nothing has been deployed yet; the contact flow is covered by unit tests only. After the first deploy, submit each form variant once and check Telegram, the Sheet row and the email.
- Analytics not wired yet: plan is Cloudflare Web Analytics (CWV) + Umami Cloud (events, `data-domains` = prod host), Search Console + Bing Webmaster, Better Stack uptime on `/` and `GET /api/contact`.
- Local Lighthouse mobile on 2026-09-29 measured Home performance 89, CLS 0, TBT 230 ms before the final hero
  priority hint; a second run varied substantially (69 / 0 / 1000 ms). Both identified ScrollTrigger as a long task.
  After native mobile reveals, the local result was 87 / 0 / 270 ms. ScrollTrigger no longer loads on phones;
  style/layout work from the template remains above the TBT budget and needs a separate performance pass.

## Changelog

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
