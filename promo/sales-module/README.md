# Sales playbook showcase

Companion material for the field-project internal-system study. The owner supplied
`C:/Users/ghufr/Downloads/modul-sales-proteksindo.html` and confirmed on 28 October
2026 that its data is demo/simulation. The original stays unchanged. This resource
demonstrates a document and its interactions; it does not connect to a live CRM or
claim sales results for Katalhys.

## Deliverables

- `public/resources/sales-playbook/index.html`: standalone HTML with embedded
  fonts, brand SVGs, licensed Lucide icons, CSS and JavaScript
- `public/resources/sales-playbook/modul-sales.pdf`: complete static companion,
  including tables, all seven workflow stages and all six quiz answers
- `/resources/sales-playbook/`: prepared static website path after a future deploy

Ten chapters retain the source material. HTML adds chapter navigation, estimator
validation, client filtering, a locally saved checklist and a scored quiz. The
PDF contains the default estimator scenario; interactive controls run in HTML.
The HTML can also be opened directly from disk without fetching external assets.
Its sibling PDF must accompany it for the download link to work.

The design uses the existing Cobalt + Ink palette and exact Katalhys geometry.
HTML uses General Sans and Inter. PDF uses the existing Inter face throughout:
ReportLab cannot embed the supplied CFF General Sans face. No dependency or
lockfile change was needed. Existing `fontverter` (installed through the current
font tooling), Sharp, lxml, ReportLab and pypdf are authoring tools only.

## Sources and data limits

Ignored working files live in `.work-capture/sales-module/`. `source.html` is a
byte-preserving backup of the supplied file; `provenance.json` records its SHA256,
the demo-data confirmation and the number of anonymized names. Never publish that
working directory. `body.html` and `data.json` feed the static export.

All 36 matrix clients and one client in the prose have anonymous identifiers.
Public content uses a functional project name. Original JavaScript is parsed as
literal data rather than executed. The enhanced resource includes visible
simulation and source labels, dated 28 October 2026, plus `noindex,follow` metadata.
That metadata is an indexing preference, not access control.

Preserved source limits:

- 80 records exclude four Demo RAP records; 59 completed projects feed benchmarks
- Health, margin and RAP values came from the 25 September brief, not a new audit
- Cancellation comparisons contain 65 contracts and six cancellations; the status
  summary has 66 completed/cancelled records and seven cancellations. The source
  does not explain the difference. Both HTML and PDF disclose it
- Project data does not capture every prospect or rejected offer, so it cannot
  establish conversion rates or sales growth
- Duration calculations omit mobilization, drying and site constraints. They are
  discussion scenarios requiring project-team review, not schedule guarantees

## Regenerate and preview

Run from the repository root with the bundled workspace runtimes:

```powershell
$salesPython = "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe"
$salesNode = "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe"
& $salesPython promo/sales-module/build.py
& $salesPython promo/sales-module/pdf.py
& $salesNode promo/sales-module/check.mjs
& $salesPython promo/sales-module/check_pdf.py
& $salesNode promo/sales-module/serve.mjs
```

Preview: `http://127.0.0.1:4393/`. The loopback-only server serves only the resource
HTML, PDF and icon license. It does not expose the repository. Stop it with Ctrl+C.

`build.py` reads the preserved backup rather than silently replacing it from
Downloads. A revised source requires deliberately updating that backup and
reviewing anonymization and source assumptions again. Both scripts resolve paths
from their own location. `check_pdf.py` also confirms the Downloads original still
matches the backup.

## Verification

On 29 October 2026, assert-based checks passed for estimator results and invalid
inputs, filter logic, dataset totals, chapter/quiz/checklist coverage, anonymous
public text, unique IDs, local links, PDF content and the untouched original.
The final PDF has 14 pages. Poppler renders were reviewed for pagination and
table/answer readability.

Codex's built-in browser was used at 320, 390, 768 and 1440px. Checks covered
page overflow, phone navigation, estimator changes and invalid values, product
filtering, checklist persistence after reload, a complete six-question quiz and
retry. Browser screenshots and the PDF inspection renders remain ignored under
`.work-capture/sales-module/`. No separate Chrome or Playwright browser was opened.

Repository validation passed: `bun test` (17 tests), `bun run check` (zero errors
and warnings, nine existing hints in other authoring scripts), `bun run build`,
and the link/copy guards on 46 built pages. In the restricted authoring session,
Astro telemetry was disabled with `ASTRO_TELEMETRY_DISABLED=1`; Alchemy's local
prerender registry used `XDG_STATE_HOME` inside the ignored working directory.
These process-local settings avoid writes outside the workspace and make no
cloud changes. The final PDF was synchronized to the built resource directory
after its last pagination repair and checked byte-for-byte.

No-JavaScript content is prerendered and structurally checked; an actual
JavaScript-disabled session and physical phones were not tested. No live data,
public deployment, contact submissions, commit or push are part of this change.
