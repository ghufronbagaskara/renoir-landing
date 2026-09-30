# Editorial image system

The material images give Renoir a recognisable visual language without pretending to show a client project. Product proof always uses real screenshots in `src/assets/img/work/`. The name-story porcelain image is an editorial illustration, not an archive photograph.

## Shared generation direction

Editorial photograph of a physically plausible object. Use tactile porcelain, paper, brushed metal, or ink; deliberate asymmetry, natural material imperfections, controlled directional light, cool paper, near-black ink, and one restrained cobalt detail. No people, office, laptop, server rack, glowing circuitry, gradient, fake interface, legible text, or generated logo. The Joint is drawn separately from `src/components/ui/BrandMark.astro`.

| Master in `.work-capture/renoir-visual/` | Subject |
| --- | --- |
| `hero-desktop.png`, `hero-mobile.png` | Three distinct planes of ivory porcelain, dark brushed metal, and a thin cobalt enamel seam meet in one crafted junction on cool paper. The mobile portrait is recomposed to keep the complete object in view. |
| `about-process.png` | Raw porcelain edges, graphite measurement marks, and paper, with the work still visibly in progress. |
| `about-result.png` | A finished porcelain and metal connection with one cobalt seam, seen from a different angle and distance. |
| `about-cta.png` | A close view of cobalt pigment entering a seam in matte dark porcelain; quiet space in the centre for the HTML CTA. |
| `service-marketing.png` | Precisely folded blank paper formats of different sizes forming a clear hierarchy, with one cobalt registration edge. |
| `service-internal.png` | A physical route assembled from ivory ceramic sections and fine dark channels, joined by one cobalt handoff piece. |
| `service-design.png` | Cut paper proportions, material samples, and one cobalt ink mark moving from rough arrangement to resolved form. |
| `service-care.png` | Three brushed-metal conduits meeting in one machined dark joint with a small cobalt locking piece. |
| `note-bought.png` | Repeated blank die-cut paper modules beside one individually fitted paper form, marked by a cobalt edge. |
| `note-running.png` | A finished physical connector continuing beyond the frame beside blank handover sheets. |
| `note-speed.png` | A metal caliper measuring a small porcelain component with a cobalt edge. |

Raw masters stay in the ignored capture directory. `bun run images:editorial` uses Sharp to make final WebP crops in `src/assets/img/editorial/` and two locale-specific OG JPEGs. Each Note uses one master for its article, list, card, and sidebar sizes. The Home problem block uses contained composites from real MAXY AI and Order & Field Sales screenshots. The Process illustration and shared page marks are SVG/CSS, so they do not add raster requests.

Before replacing an asset, inspect desktop, tablet, and phone crops. Reject fake writing, shiny plastic surfaces, cut-off subjects, and repeated compositions. Keep screenshot captions and alt text accurate to the real product.
