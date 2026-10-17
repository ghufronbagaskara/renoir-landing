# Home refresh — 16 October 2026

Implemented locally at the owner's request. No deployment, dependency changes, or React/Tailwind migration.

## Composition

- Hero: existing Katalhys two-line EN/ID headline, bottom-centered over the owner's monochrome video. The primary CTA opens the existing contact route; the secondary CTA goes to selected Work. A dark scrim keeps white copy legible; the three engagement statements were removed at the owner's request.
- Navigation: the original separate wordmark and right-hand white pill return. Mobile retains a compact rectangular control group with aligned buttons. Inner pages begin with a dark header and switch to the same floating composition after 20px of scroll. Shared navigation styling lives in `_site.scss`.
- Problem: one static source-to-workflow canvas replaces the scattered thumbnails. Chat, spreadsheet and document questions connect to a status/owner/next-action record; conceptual AI tasks and human review remain explicit. A separate real-project proof link retains the original screenshot. [Research](../problem-refresh/research.md). The shared internal-system offer retains operator-focused AI positioning. The shared internal-system offer, engagement list and EN/ID service detail now explain information search, summaries and follow-ups, with AI tasks/data/review agreed in scope. Existing portfolio studies have not been relabeled as AI implementations.
- Services: `src/components/ui/WorksWheel.astro`, `src/scripts/works-wheel.ts`, and the native tab helper. Nine images appear in the ring, but exactly four services have selectable text, descriptions and detail links. Five existing project images only support the visual. The compact cobalt section defaults to a ring: native scroll and image drag rotate it without opening a service. Tabs and previous/next open services. Drag in an open view changes service; hovering/focusing a service image reveals a real detail link. Project images remain decorative. The overview control restores the ring.
- Work: five `homeRank` projects use native tabs with a four-second rotation while in view, retaining their existing copy, service tags, paired screenshots and case-study routes. Field Project Monitoring is fourth; Deployment & Operations is fifth. Internal client names and the expert-profile client are anonymous in public copy; marketing names and screenshot pixels remain at the owner’s request. A 500ms opacity crossfade paints the old panel beneath the incoming white panel, with all panels sharing a stable grid stage. Inactive panels remain invisible, inert and aria-hidden; their layout reserves the largest panel height. Only selected and next covers explicitly warm/decode when the section enters view or selection changes, and clipped tabs scroll within their own horizontal list. The final project retains its honest architecture-diagram caption. Hover over controls, keyboard focus, hidden/offscreen state and the explicit pause control stop rotation; reduced motion starts paused. No invented dates or numerical outcomes.
- Questions: Home reuses the Process FAQ with its localized source-code/access/documentation handover card and desktop hover expansion. Existing questions and answers are retained; keyboard, touch, reduced-motion and no-JavaScript behavior use the existing shared accordion. Home-only phone rules keep toggle icons centered inside left-aligned question buttons and leave space below the handover card.
- Notes: tinted cards and white diagram panels separate articles from the white section. Each image, title and localized read-note button leads to the same article. Existing copy, diagrams and rail behavior remain.
- Footer: ink `#17191C`, white copy and mark. Shared across EN/ID routes.
- Styling: `src/styles/_home-refresh.scss`, imported by HomeView. GeneralSans, Inter, cobalt and the established site tokens are retained. The runtime `is-enhanced` class is safelisted by the existing PurgeCSS integration.

## Video

Owner-provided source: [particle-wave MP4](https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4).

Original: HEVC, 1920×1080, 24fps, 10.04s, 9,488,614 bytes. Local optimized asset: H.264, 1600×900, 24fps, no audio, fast-start MP4, 1,937,283 bytes (about 80% smaller), at `src/assets/video/katalhys-hero.mp4`, emitted as a hashed `/_astro/` asset. The original remains in ignored `.work-capture/home-refresh/hero-source.mp4`.

Conversion uses the installed FFmpeg: `ffmpeg -i <source> -an -vf scale=1600:-2 -c:v libx264 -preset medium -crf 26 -pix_fmt yuv420p -movflags +faststart <output>`.

Responsive WebP posters under `src/assets/img/home-refresh/` come from the source at 1s. A 506×900 portrait crop is 582,410 bytes (about 70% smaller than the desktop encode), with matching 241 frames/24fps/10.04s and no audio. It is selected only at max-width 767px and max-aspect-ratio 9/16; wider/landscape screens retain the original framing. Native video controls pause/resume; playback stops offscreen and in hidden tabs. Automatic playback waits for document load, font readiness, poster decoding and the next paint; explicit play bypasses that gate. Reduced-motion and save-data start on the poster without requesting the video, unless the visitor explicitly starts it. No-JS and failed-video states retain the poster and content.

## Image assets

Four original service artworks were generated with the built-in imagegen tool, one prompt per asset. They are conceptual illustrations, not delivered software or proof of client results. Masters were copied into ignored `.work-capture/home-refresh/`; originals remain at the tool's generated-image location. Shipped 800px WebP exports:

- `src/assets/img/home-refresh/service-marketing.webp`
- `src/assets/img/home-refresh/service-internal.webp`
- `src/assets/img/home-refresh/service-design.webp`
- `src/assets/img/home-refresh/service-care.webp`

Five 720×496 contain-fit WebP thumbnails reuse the existing `desktop.webp` screens from Order & Field Sales, Field Projects, MAXY AI, Industrial Coatings and Expert Profile. Original Work assets are unchanged. These nine wheel images have empty alt text; service information and links remain separate, readable HTML.

The complete prompt set is in [prompts.json](./prompts.json).

## Verification

Run the production build with `bun run build`, then `bun run serve`. Execute `node scripts/check-home-refresh.mjs` (optional base URL argument) against the built asset server. This uses the installed Playwright package and Chrome; it writes ignored screenshots to `.work-capture/home-refresh/qa/`.

The regression check covers EN/ID at 1440, 1240, 820, 412 and 320px: restored desktop pill/aligned mobile navigation, the desktop/mobile menu breakpoint, menu/Escape/background inert state, video pause/resume and viewport pause, nine decorative wheel images, four service tabs/links, keyboard selection, horizontal drag, finite transforms, production CSS geometry, native page scroll, four Work tabs, loaded images, dark footer, and browser errors. Additional cases cover reduced motion with explicit video opt-in, save-data, all panels readable without JS, and failed-video poster fallback.

Final validation passed all 14 browser scenarios, `bun run check` (0 errors, 4 hints in untouched files), 9 contact tests, the Alchemy-backed local build, and the link/copy guards across 45 pages. No formatter is configured; the diff whitespace check passes.

Lighthouse mobile, local built-page runs on 2026-10-16:

| Locale | Performance | Accessibility | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- |
| ID | 97 | 100 | 2.48s | 0ms | 0.000086 |
| EN | 99 | 100 | 1.96s | 5.5ms | 0.000085 |

The first ID run measured 87 with a 3.78s LCP. Removing the mobile entrance delay, using the preloaded heading weight, and avoiding a duplicate video-poster request produced the final values above. CLS is below 0.001 but is not exactly zero; Lighthouse attributes the remaining tiny shift to a font swap. These are individual local runs, not site-wide or deployed CWV guarantees. Raw JSON reports and screenshots are in ignored `.work-capture/home-refresh/`.

Publication still requires the existing owner/co-owner brand and asset permissions. No deployment was performed.

## Feedback verification — 17 October

`node scripts/check-home-feedback.mjs` additionally checks scroll rotation without opening, drag starting on an actual service image without accidental navigation, hover links, compact/cobalt services and white Work, four-second rotation and pause, stable 500ms crossfades, rapid selection cleanup and reduced-motion selection, Home engagement and FAQ hover/handover, short About headings and dark/light menu-icon contrast, EN/ID service/Work/Notes search with and without Pagefind, dark breadcrumbs and inner floating navigation. The catalog endpoint also makes search usable under `bun run dev`. Fallback uses all query words and title ranking rather than Pagefind's full-text algorithm.

The October 16 Lighthouse scores above are a historical baseline, not a fresh measurement of the feedback changes. Presentation-tool research is separate: `docs/research/presentation-tools-2026-10-17.md`; no deck or new external integration was created.

## Motion audit — 17 October

Generic heading/character entrance has been removed across shared components. Native image parallax remains; Process linework draws once and project selection crossfades in place. See `docs/design/motion-refresh/README.md` and `node scripts/check-motion.mjs`. Benefits redesign remains an isolated research preview.

Final feedback/motion verification on 17 October: 10 unit tests, zero type errors/warnings (four pre-existing hints), successful production build, 45-page link/copy guards and Chrome suites for 14 Home scenarios, 3 feedback scenarios and 26 motion scenarios. Search query initialization is ordered after shared overlay handlers. No deployment or fresh Lighthouse claim.

## Work display refinement — 2026-10-17

The owner requested four-second automatic selection, smoother changes, and Proteksindo at position four. This uses the existing field-projects screenshots and case study; Work catalogue feature order is unchanged. The native tab helper and service wheel selection logic are unchanged. Work alone adds a layered 500ms opacity transition, with the previous panel painted under the new white panel. Reduced motion cancels transitions and changes selection immediately. Grid sizing reserves all panel dimensions to prevent page movement; hidden panels remain invisible/inert/aria-hidden. The scoped display override is needed because Bootstrap sets hidden elements to display:none!important. No global smooth scrolling is enabled; only clipped tabs scroll locally.

### Verifikasi refinement Work

Build final berhasil setelah satu pengulangan terpisah untuk error penutupan workerd Windows. Astro check: 0 error/0 warning (5 hint dari file lama). Unit test: 10 lulus. Link dan copy guards: 45 halaman lulus. Chrome: 14 skenario refresh Home, 3 skenario feedback EN/ID/reduced motion, serta 6 pemeriksaan khusus hasil build (EN/ID × 1440/412/320px) lulus. Pemeriksaan mencakup batas sebelum/selepas empat detik, crossfade 500ms dengan panel lama tetap terlukis namun inert/aria-hidden, pembersihan saat klik cepat, wrap keyboard lima project, tinggi stage tetap, tab aktif terlihat di scroller, dan screenshot Proteksindo yang benar. Screenshot: `.work-capture/project-refresh/`. Lighthouse belum diukur ulang; tidak ada deployment.

### Performance verification - 17 October 2026

The integrated Problem/Notes and runtime/media build was checked in Chrome. Home EN/ID each scored 92 in three cold mobile Lighthouse runs, with accessibility 100, CLS 0 and TBT below 100ms. Transfer dropped about 59% to 1.16 MB; the >=95 Home performance goal remains open. Seven inner routes scored 95-97 in single final runs. These results supersede the earlier Home lab scores above. Evidence, methods and remaining limits: [performance report](../../performance/2026-10-17.md). No deployment.
