# Lead funnel, trust pages and admin (2026-11-13)

Branch `v2-katalhys-seo-lead-funnel`. Source research: [DewataTech audit](../research/2026-11-10-dewatatech-audit-dan-roadmap-katalhys.md), [client SEO/GEO](../research/2026-11-10-dewatatech-client-seo-geo.md), and the Fanos Coatings landing (`fanoscoatings-landing`: single-source facts, full FAQ in `llms.txt`, post-build SEO guard).

## Owner decisions

| Topic | Decision |
| --- | --- |
| Lead storage and admin | Cloudflare D1 is the primary lead record. `/admin/` uses the site's own email + password login. Telegram and the Sheet webhook remain notification sinks |
| Quiz result | No prices. Recommend a service path, explain why, give a first step, what to prepare, and one relevant project |
| Legal identity | Katalhys has a PT/CV and NIB. `site.legal` holds entity name, NIB and address; each line renders only once filled, so no placeholder reaches public HTML |
| Guarantee | Written scope and acceptance criteria, 30-day bug fixing after launch, full source/access handover. No ranking, traffic or revenue promises |

## What we take from DewataTech, and what we skip

| DewataTech | Katalhys |
| --- | --- |
| Branching "where do I start?" quiz with a result before contact | `/start/` · `/id/mulai/`: four questions, deterministic result, then an optional brief by email or WhatsApp |
| Package/price comparison, configurators | Skipped: pricing is not approved for publication |
| Guarantee, revision and work-terms pages | `/how-we-work/` · `/id/cara-kerja/`: stages, client inputs, revisions, handover, 30-day bug fixing, exclusions |
| Privacy, Terms, Cookie policy, cookie banner with Reject/Settings/Accept, footer "Manage cookies" | Three legal pages per locale and a consent manager that stores the choice locally. No optional tags exist yet; analytics will read the stored consent when added |
| Mega-menu overlay | Desktop dropdown panels for Services and Resources; grouped offcanvas sections on phones |
| `llms.txt` with facts, catalogue and full FAQ; FAQ JSON-LD from the same data | Facts, guarantee and FAQ come from one module and feed pages, JSON-LD and `llms*.txt` |
| Location pages, ads offers, OTA calculators | Skipped: no matching service or proof |

## Data

- `leads`: id (client UUID, idempotent insert), timestamps, source, locale, name, email, whatsapp, preferred channel, company, build type, message, timeline, budget, quiz answers/recommendation, status (`new` → `contacted` → `qualified` → `won`/`lost`), notes, next follow-up, user agent. No IP.
- `lead_events`: status/notes changes with the acting admin.
- `admin_users`, `admin_sessions`: PBKDF2-SHA256 password hashes; session tokens stored as SHA-256 hashes; `__Host-` HttpOnly, Secure, SameSite=Strict cookie; same-origin check on every POST; login rate limit; `no-store` and `noindex` on all admin responses.
- First account: `/admin/setup/` works only while no admin exists and requires the `ADMIN_SETUP_TOKEN` secret.

## Verification (2026-11-13)

- `bun test`: contact, quiz and D1/auth tests (in-memory SQLite with the real migration).
- `bun run check`, `bun run build`, `check:links`, `check:copy`, `check:seo` pass on 55 built pages.
- `check-funnel.mjs` (15 scenarios) plus the existing offcanvas, mobile layout, Notes/search, Work, motion and Home feedback checks pass. `check-home-refresh` (headless video timeout) and `check-mobile-density` (Home Problem 896px at 320px) fail identically on the v1 baseline build.
- Not verified: the Worker runtime. D1 writes through `/api/contact`, admin login and setup need a deployed stage.

## Deferred to the owner (blocking or external)

Analytics/pixels (consent hooks are ready), official WhatsApp number, legal entity/NIB/address values, final legal text approval, custom domain and Search Console, deployment.
