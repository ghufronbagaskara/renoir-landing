# Instagram images

One folder per post: `NN-post-name/` with `index.html` (the design), `assets/`, `CAPTION.md` and `renders/`.

```bash
node promo/gambar/render.mjs promo/gambar/01-hello-renoir
```

`index.html` contains a single `#canvas` with `data-slides`, `data-w`, `data-h`. Slide *i* is the region
`x = i × w`, so a carousel can be designed as one continuous strip (elements may cross slide edges).
Slides are captured at 2× with Playwright, downsampled with Lanczos (Sharp) and saved as
`renders/<post-name>-NN.jpg` (JPEG q95, 4:4:4). Feed posts use 1080×1350 (4:5); keep cover content inside
the centre 3:4 area for the profile grid. Posting is manual (Meta Business Suite).

Rules: Renoir palette (paper `#f5f7fb`, ink `#17191c`, one cobalt `#1d4ed8`), General Sans + Inter, The Joint
mark, real Work screenshots, no invented metrics, no tool names, no pronunciation guide.

The three designs share `carousel.css`. Custom explanatory SVGs live in
`01-hello-renoir/assets/illustrations/` and are reused through relative paths. Keep the three folders
together when editing or rendering. Final JPEGs are standalone. Original sources and renders are backed
up in ignored `.work-capture/instagram-before/`.

Each `CAPTION.md` contains Indonesian posting copy and seven separate alt texts. Upload only the numbered
01–07 JPEGs, not panorama or preview images. `preview-all.jpg` shows all 21 slides;
`preview-covers.jpg` shows the three covers. Render checks image decoding, slide count and text bounds
before exporting. Review evidence and design reasons are in `REVIEW.md`.

| # | Folder | Format | Story |
|---|--------|--------|-------|
| 1 | `01-hello-renoir` | carousel, 7 slides | Introduction: who Renoir is, four services, who it is for, why Renoir, how to start |
| 2 | `02-why-renoir` | carousel, 7 slides | Origin: building systems for real companies exposed three problems; Renoir answers all three |
| 3 | `03-sketch-to-running` | carousel, 7 slides, panorama | One studio from sketch to running, told through the Industrial Coatings catalogue |
