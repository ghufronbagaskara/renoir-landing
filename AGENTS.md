# AGENTS.md — Renoir landing

Single source of context for AI agents working on this repo. Read it fully before changing anything, and
**update it in the same change** whenever you alter something it describes (stack, commands, structure,
conventions, infra, TODOs). Add a line to the changelog at the bottom.

## 1. What this is

Marketing site for **Renoir**, a digital studio. Brand/company brief: [`docs/renoir-run.md`](docs/renoir-run.md).

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Clone 12 pages of the purchased **Averix** HTML template into Astro, as close to the original as possible, with high performance; working navigation (no dead links), working contact form, static search, IaC + CI ready to deploy | **Done** (not deployed yet) |
| 2 | Replace template content/branding with Renoir (copy, images, colours, logo). The brief wins over the template from here on | Not started |
| 3 | SEO + GEO (metadata, structured data, sitemap, OG images, heading hierarchy, AI-crawler readability). Use the `astro-seo` skill | Not started |

During phase 1 the template's look wins over the brief when they conflict.

## 2. Stack

- **Astro 7** (`astro.config.ts`), TypeScript, Bun (package manager + scripts). Node ≥ 22.12.
- **Alchemy v2** (`alchemy@2.0.0-beta.77`, Effect-based IaC) deploying to **Cloudflare Workers (free plan)**.
- **Effect 4** — pinned to `4.0.0-rc.112` via `overrides` in `package.json`. Alchemy beta.77 breaks on rc.115
  (`Config.string` was renamed). Bump Effect only together with Alchemy.
- Cloudflare: Worker + static assets, **D1** (contact submissions), **Turnstile** (spam), **Rate Limiting binding**.
- **Resend** for contact notification emails (optional; submissions are stored regardless).
- **Pagefind** static search (index built after the Astro build).
- **GSAP** (core + ScrollTrigger + SplitText, loaded lazily) and **Swiper** (lazy) on the client. No jQuery,
  no Bootstrap JS, no UI framework islands.
- Styling: the template's own SCSS (Dart Sass) + stock **Bootstrap 5.2.3 CSS** (the template's version).
  At build all CSS is **inlined into each page and purged per page** (`purge-unused-css` integration in
  `astro.config.ts`): no render-blocking stylesheet request, ~60–75 KB raw CSS per page instead of ~350 KB.
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
bun alchemy deploy     # deploy personal dev stage   ← ASK THE OWNER BEFORE EVERY DEPLOY
bun alchemy deploy --stage prod
bun alchemy destroy --stage <stage>
bun run images:mirror  # one-off: download demo images (already done; output committed in src/assets/img)
bun run images:optimize# convert new jpg/png in src/assets/img to WebP (deletes originals)
bun run icons:subset   # regenerate Font Awesome subset after adding/removing fa-* icons
```

Rules:
- **Never deploy (or run `alchemy dev`, which provisions cloud resources) without explicit owner confirmation**, one deploy at a time.
- Never tell the owner to export `CLOUDFLARE_ACCOUNT_ID`/`CLOUDFLARE_API_TOKEN` locally. Alchemy stores credentials in profiles (`~/.alchemy/profiles.json`); the first `bun alchemy deploy` prompts for OAuth or an API token. CI uses GitHub secrets.
- **Never add an adapter** (e.g. `@astrojs/cloudflare`) to `astro.config.ts`: Alchemy injects its own and a declared adapter fails the build.
- Plain `astro build` fails by design (the `/api/contact` route needs the adapter). Use `bun run build`.
- The last line of `bun run build` on Windows may print `GetQueuedCompletionStatusEx ... ERROR_ABANDONED_WAIT_0` — workerd shutdown noise after a successful build.

## 4. Layout

```
alchemy.run.ts              Stack "renoir-landing": D1, Turnstile widget, Website.Astro (+ PR preview comment)
stacks/github.ts            One-off stack: CI API token + GitHub secrets (run manually with an admin profile)
.github/workflows/deploy.yml  push main → prod; PR → pr-<n> preview; PR closed → destroy preview
astro.config.ts             site/trailingSlash/prefetch + integrations: purge-unused-css, pagefind-index
migrations/                 D1 SQL migrations (applied by Alchemy on deploy)
scripts/                    build, serve, check-links, mirror/optimize images, subset icons
docs/renoir-run.md          brand brief (phase 2 input)
averix-modern-...-utc/      original template (git-ignored, licensed). Source of truth for phase-1 markup
src/
  assets/img/**             template images (WebP + SVG), same folder names as the template
  assets/fonts/             GeneralSans woff2 + generated Font Awesome subsets
  content/*.ts              placeholder data for collections (services, team, portfolio, blog)
  content.config.ts         collection schemas (astro/zod; Astro requires Zod here)
  data/site.ts nav.ts faq.ts  site-wide placeholders, the ONLY nav definition, shared FAQ
  layouts/BaseLayout.astro  head, header (home/inner), offcanvas, search overlay, breadcrumb, footer, global scripts
  components/layout/        Header*, NavMenu, Offcanvas, SearchOverlay, Footer, Breadcrumb, SocialIcons
  components/ui/            Img, Accordion, ContactForm
  components/sections/      one component per template section (home/, about/, services/, pricing/, team/, blog/, shared/)
  pages/                    routes (all prerendered except api/contact.ts)
  server/contact.ts         contact form Effect program + Turnstile/Resend helpers (+ contact.test.ts)
  scripts/*.ts              client modules (vanilla TS)
  styles/                   template SCSS (utils/theme/components/layout) + _site.scss (our additions) + global.scss
  env.d.ts                  types for `cloudflare:workers` env bindings — keep in sync with alchemy.run.ts
```

### Routes (template page → route)

| Template | Route | Source |
| --- | --- | --- |
| index.html | `/` | `pages/index.astro` + `sections/home/*` |
| about-us.html | `/about-us/` | `pages/about-us.astro` |
| service.html / service-details.html | `/services/`, `/services/[slug]/` | `services` collection |
| team.html / team-details.html | `/team/`, `/team/[slug]/` | `team` collection |
| pricing.html | `/pricing/` | static |
| portfolio.html / portfolio-details.html | `/portfolio/`, `/portfolio/[slug]/` | `portfolio` collection (prev/next wrap around) |
| blog-standard.html / blog-details.html | `/blog/`, `/blog/2/`…, `/blog/[slug]/` | `blog` collection, 3 posts per page |
| contact.html | `/contact/` | form + map |
| — | `/404.html` | not indexed by search |
| — | `/api/contact` | on-demand (Worker) |

Template pages NOT used (index-2/3, faq, blog grid) do not exist; never link to them.

## 5. Conventions

- `.astro` first. Client code = small vanilla TS modules in `src/scripts`, imported from a component `<script>`
  (Astro bundles/dedupes them). No framework islands.
- **Keep the template's markup and class names** (`si-*`, Bootstrap grid) so the template SCSS keeps working.
  When semantics require a different element, extend the SCSS selector instead of restyling
  (e.g. `h1, .h1{`, `h3, .h3{`, `h1, .sidebar-heading{`).
- Anchors without a destination must not use `href="#"`: use `<a class="no-href">` (the class stops Bootstrap's
  `a:not([href]):not([class])` reset) or a real `<button>`. `bun run check:links` enforces this.
- Navigation comes only from `src/data/nav.ts`. Add a route there only once the page exists.
- Images: put files under `src/assets/img/<section>/`, run `bun run images:optimize`, reference with
  `<Img src="section/name.jpg" />` (the template name; resolves to `.webp`). CSS backgrounds use `imageUrl()`
  from `~/lib/images`. Hero/LCP images: `loading="eager" fetchpriority="high"`. Never use `astro:assets`
  `<Image>`/`getImage` — Alchemy's adapter forces the passthrough image service, so nothing would be optimised.
- Icons: Font Awesome Pro classes from the template (`fa-sharp fa-regular fa-arrow-right`, `fa-brands …`).
  After adding a new `fa-*` class run `bun run icons:subset`.
- Runtime-added classes must appear as strings in the JS (PurgeCSS scans each page's HTML + all built JS) or be
  added to the safelist in `astro.config.ts`. Symptom of a miss: a style works in `bun run dev` but not after
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
- GSAP (`src/scripts/anim.ts`) is dynamically imported after `load` + `requestIdleCallback`, only when the
  page has `.si-text-revel-anim`, `.si_fade_anim` or `.si-char-animation`. Tweens run once. SplitText splits
  `words,chars` only (a `lines` split reflows text → CLS). Reveals start at `top 92%` so late elements (footer
  heading) appear early. No ScrollSmoother, no smooth/lag scroll, no pinning, no scroll-jacking, no preloader.
- Image parallax = the template's `data-speed` (hero banner `.4`, portfolio cards `.8`) using ScrollSmoother's
  exact formula `y = (1 - speed) * (scrollY + innerHeight/2 - frameCenterY)` inside the `.fix`
  (overflow-hidden) frame — measured identical to the live demo. The hero photo starts pulled up behind the
  hero content and drifts down. Implemented without GSAP at the top of `anim.ts` (runs immediately, passive
  rAF-throttled scroll listener, remeasures on body resize), so there is no jump when GSAP loads.
- **Never enable `scroll-behavior: smooth`** (template and Bootstrap both did; overridden in `_site.scss`):
  ScrollTrigger.refresh() jumps the scroll position and a smooth behavior turns that into broken trigger
  positions. Trigger positions refresh on body resize (ResizeObserver in `anim.ts`).
- In `bun run dev`, `window.ScrollTrigger` is exposed for debugging.
- Magic cursor (`src/scripts/cursor.ts`) only on `(hover: hover) and (pointer: fine)`; its rAF loop stops when idle.
- Swiper (`src/scripts/sliders.ts`) is imported and initialised per slider when it comes within one viewport
  (IntersectionObserver), so it never competes with first paint.

## 6. Contact form & API

- UI: `components/ui/ContactForm.astro` (variants `contact`, `team`, `service` — the three template skins).
  Hidden honeypot `company_website`, hidden `source` (`contact` | `service:<id>` | `team:<id>`).
- Client (`scripts/contact-form.ts`): on first focus `GET /api/contact` → `{ sitekey }`, then loads Turnstile
  (explicit render, `interaction-only`). Submit via `fetch` (JSON). Without JS the form POSTs and gets a 303
  back to `/contact/?sent=1` or `?error=<key>`.
- Endpoint `pages/api/contact.ts` (`prerender = false`) reads bindings via `import { env } from "cloudflare:workers"`
  and runs `handleContact` from `server/contact.ts`:
  decode with `effect/Schema` → honeypot (fake success) → rate limit (5/min per IP) → Turnstile verify →
  insert into D1 → Resend email (best effort; result recorded in `email_sent`/`email_error`).
  Status mapping: 200 sent · 400 invalid · 403 captcha · 429 rate_limited · 500 error.
- Table `contact_submissions` — see `migrations/0001_contact_submissions.sql`. New schema changes = new numbered file.

## 7. Infrastructure

- Stack `renoir-landing` (`alchemy.run.ts`), state stored in Cloudflare (`Cloudflare.state()`).
- `Cloudflare.Website.Astro("Website")` with `astro.output = "server"` (**not** `"static"`: static = assets-only
  deploy with no Worker, which drops `/api/contact`), `sessionKVBindingName: false`,
  `assets: { notFoundHandling: "404-page", htmlHandling: "auto-trailing-slash" }`. Prerendered pages are served
  by the asset layer without invoking the Worker (keeps the free-plan request quota for the API).
- Bindings: `DB` (D1 `ContactDB`), `THROTTLE` (RateLimit ns 1001, 5/60s), `TURNSTILE_SITEKEY`, `TURNSTILE_SECRET`,
  `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. Typed in `src/env.d.ts`.
- Config via `effect/Config` (`.env` locally, GitHub secrets in CI; see `.env.example`):
  `WORKERS_DEV_SUBDOMAIN` (required; Turnstile allowed domain), `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
  `CONTACT_FROM_EMAIL`, `GITHUB_OWNER`/`GITHUB_REPO` (PR preview comments).
- No custom domain yet: every stage lives on `*.workers.dev`. When a domain exists, add it to the Turnstile
  `domains`, set `astro.site`, and attach the domain to the Website (see Alchemy custom-domains guide).
- Stages: personal default stage locally, `prod` from `main`, `pr-<n>` previews (destroyed when the PR closes).
- CI secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (created by `stacks/github.ts`), plus
  `WORKERS_DEV_SUBDOMAIN`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` added manually.
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
| cloudflare | choosing Cloudflare products (domains, email, caching…) |
| workers-best-practices | runtime code in `/api/*`. Ignore its wrangler config advice: IaC is Alchemy |

Removed as conflicting/duplicate: `astro-expert`, `add-integration` (could add an adapter that breaks the Alchemy build).

## 9. Known gaps / TODO

- **Demo images are preview-licensed placeholders** (mirrored from html.sthemeit.com). Replace all of them before go-live (phase 2).
- All copy, names, emails, phones, addresses, social URLs (platform home pages) are template placeholders (`src/data/*`, `src/content/*`).
- SEO/GEO not done (phase 3): the template uses several decorative `<h1>`s per page (hero/about/counters/footer), no structured data, no sitemap, placeholder `site` URL (`SITE_URL` env / `astro.site`).
- Swiper chunk is ~80 KB (the `swiper/modules` barrel isn't tree-shaken); loaded lazily, acceptable for now.
- Accordion panels open/close instantly (Bootstrap's height animation not reproduced).
- Search needs the built `/pagefind/` index: it doesn't work under `bun run dev`.
- Nothing has been deployed yet; the contact flow is covered by unit tests only. After the first deploy, submit each form variant once and check the D1 row + email.

## Changelog

- 2026-09-17 — Parallax rewritten to ScrollSmoother's formula (no zoom); matches the demo's hero overlap.
- 2026-09-17 — Motion fixes: restored `data-speed` image parallax (hero, portfolio), earlier text reveals, removed smooth scroll-behavior, fixed invisible testimonial quote icon (`box-sizing: content-box`).
- 2026-09-17 — Phase 1: Astro 7 clone of 12 Averix pages, collections, contact API (Effect + D1 + Turnstile + Resend), Pagefind, PurgeCSS, WebP images, Alchemy stack + GitHub Actions CI, skills cleanup.
