# Katalhys identity

Selected by the owner on 2026-10-15 for implementation and local review. Co-owner approval is pending before launch. This is a vector reconstruction of logo 08, using the selected palette 10 instead of the exploration's copper accent.

## Palette

| Role | Color | Use |
| --- | --- | --- |
| Primary | `#173E72` | Navy sections, links, main symbol |
| Accent | `#64D6F2` | Primary actions, separate logo block, focus on dark surfaces |
| Text | `#16283C` | Body/headings on light surfaces and text on cyan |
| Secondary | `#566678` | Supporting text on light surfaces |
| Background | `#F6FAFF` | Page canvas |
| Panel | `#E7EFF8` | Supporting panels and soft selected states |

White is used for dark-surface text and the white logo. Cyan is not a body-text color on white. Existing `renoir-*` CSS names remain internal compatibility names; they now resolve to this palette. Error states retain a distinct red.

## Logo

The stepped solid form suggests a stable structure with room for movement. The separate block can represent a focused intervention or a new part of a business system. This interpretation connects the shape to Katalhys's catalyst role without promising business results or worldwide visual uniqueness.

- `src/data/brand.ts`: shared paths and palette
- `src/components/ui/BrandMark.astro`: color, white, and current-color variants
- `public/brand/katalhys-symbol.svg`: navy/cyan symbol, transparent background
- `public/brand/katalhys-symbol-white.svg`: both parts white, transparent background
- `public/brand/katalhys-symbol-mono.svg`: both parts ink, transparent background
- `public/favicon.svg` and `public/favicon.png`: color symbol inside an opaque white square with padding
- `public/apple-touch-icon.png`: opaque white 180px touch icon

Run `bun run brand:assets` after changing geometry or palette. Keep SCSS tokens in `_site.scss` and `utils/_colors.scss` aligned with `brandColors`. Keep the symbol proportionate; do not stretch, add shadows, or close the internal opening. Keep the name beside it in the header, menu, and footer. The white version retains the opening as transparent negative space.

## Website scope

Both languages use Katalhys in visible brand names, metadata, structured data, search, and AI-readable summaries. The About name paragraph now describes the catalyst role. Other approved service copy is preserved. Pronunciation guidance and the former painter origin story have been removed.

`bun run images:editorial` composites the shared SVG and bundled GeneralSans lettering onto existing blank photographic masters, refreshes explanatory Notes diagrams, and produces `public/og/katalhys-en.jpg` and `katalhys-id.jpg`. Actual Work screens remain authentic project proof.

The intended canonical fallback is `https://katalhys.com`. Cloudflare resource names, credentials, bindings, and deployment stages remain unchanged. Domain ownership, DNS, Turnstile domains, and co-owner approval must be resolved before deployment. Historical Renoir promotional material remains outside this website rebrand.

## Local validation on 2026-10-15

- `bun test`: 9 tests passed
- `bun run check`: 0 errors, 0 warnings, 4 existing hints in promo/optimization sources
- `bun run build`, `check:links`, and `check:copy`: passed on 45 pages
- Browser review: 60 EN/ID route and viewport combinations at 390, 768, and 1440px, with no horizontal overflow, broken images, or browser errors
- Mobile menu and Pagefind search passed; homepage identity and heading remained visible without JavaScript
- All shipped editorial WebPs and SVG exports decoded; favicon pixels were fully opaque with a white corner
- Header/footer logo variants and cyan action text were checked in computed styles and screenshots

The pipeline writes completed binary assets to a sibling temporary file and renames them into place, avoiding Windows locks encountered when overwriting images directly. No production deployment or live form submission was performed. This review does not establish site-wide Core Web Vitals or trademark uniqueness.
