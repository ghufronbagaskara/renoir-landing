# Katalhys promo videos

All five authored variants now use the current identity from the root DESIGN.md: flowing logo 09, Cobalt + Ink, GeneralSans and Inter. The original source backup is in ignored `.work-capture/video-before-rebrand/`. Earlier rendered MP4s remain historical; use the Katalhys filenames below.

| Video | Source | Final MP4 | Duration |
| --- | --- | --- | --- |
| Where's the answer? | spreadsheet-to-system/index.html | spreadsheet-to-system/renders/katalhys-spreadsheet-to-system-60fps.mp4 | 28.5 s |
| Four services | spreadsheet-to-system-clone/index.html | spreadsheet-to-system-clone/renders/katalhys-four-services-60fps.mp4 | 28.5 s |
| Delivered running | delivered-running/index.html | delivered-running/renders/katalhys-delivered-running-60fps.mp4 | 27 s |
| Studio overview | studio-overview/source/Katalhys Promo.dc.html | studio-overview/renders/katalhys-studio-overview-60fps.mp4 | 25.5 s |
| Original story / v1 | spreadsheet-to-system/archive/index-v1.html | spreadsheet-to-system/renders/katalhys-spreadsheet-to-system-v1-60fps.mp4 | 22 s |

Final output: 1080 × 1920, 60 fps, H.264 video and AAC audio. Music/SFX and scene lengths are preserved. New service copy describes AI assistance as an offer; the existing founder-project screenshots remain project evidence and do not claim that those screens already contain an AI interface. The phone sequence uses a fresh capture of the local Katalhys homepage.

## Render and review

HyperFrames projects pin 0.8.166. From each project directory:

```powershell
bun run check
bunx hyperframes@0.8.166 preview --background
bunx hyperframes@0.8.166 render --fps 60 --quality delivery --workers 2 --output renders/<filename>.mp4
```

For v1, run from spreadsheet-to-system with `--composition archive/index-v1.html`. Its relative asset paths resolve to the shared assets folder.

Studio overview retains its original frame-seek renderer, with local React/Babel, bundled fonts and approved SVGs. See its README.

```powershell
node promo/video/studio-overview/render-60fps.mjs
node promo/video/check-renders.mjs
node promo/video/serve-review.mjs
```

Open http://127.0.0.1:4395/review.html to play all five MP4s. Generated caches, snapshots and new render outputs are ignored by Git; sources and local runtime assets remain versionable.

## Verification

Rebrand review includes native-size frame samples, current-logo geometry, no old brand in active HTML/JSX, local asset loading and complete-file FFmpeg decoding. `check-renders.mjs` asserts dimensions, frame rate/count, duration and both codecs, and writes `renders/verification.json`.

HyperFrames check reports zero errors. Its remaining warnings concern the existing single-file scene structure, illustrative spreadsheet/outline contrast, and the masked line bounds during the short Live → Choice transition. They do not constitute a claim that every frame is WCAG certified. The brand reveal, service copy and CTA frames are inspected separately.

2026-10-17: all main projects and the original story variant migrated to Katalhys; no deployment or publishing.

Final local verification on 2026-10-17: all five MP4s passed metadata/frame-count assertions and full FFmpeg decoding. Chrome played and sought all five with no media errors; the review page had no horizontal overflow at 1440px and 412px. Mean audio levels were -14.5 to -15.7 dBFS (signal check, not a loudness certification). Social-platform recompression has not been tested.
