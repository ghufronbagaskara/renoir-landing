# Clone draft review

2026-10-11. Source: `../spreadsheet-to-system`; original composition not edited.

- Technical PASS: `bun run check` executed; final output says `Check passed`. Zero lint errors,
  runtime errors and held layout errors. Preview at port 3017 returned HTTP 200.
- Purpose PASS: four consecutive service chapters replace the simultaneous grid and detailed
  order walkthrough; existing Work images are larger, and Renoir is named before the services.
  Paper/ink/cobalt, Joint wipes and the spreadsheet motif preserve the source's identity.
- Liveliness PASS: ENERGY 2 / RHYTHM 2 / MOTION 2 declared in `STORYBOARD-clone.md`;
  snapshots reviewed at 4.35, 6.6, 9.65, 12.7, 15.85, 22.1 and 27 seconds. The visible frames
  show the brand introduction, each of four services, website and CTA respectively.
- Evidence PASS: existing founder-work screenshots reused; no new statistics, testimonials,
  uptime or live-status claims. Deployment panel describes scope. CTA points viewers to the
  existing link-in-bio route; this film is not an interactive application.

## Limits of this review

Final check reports 8 lint warnings about monolithic scene organization, and 24 contrast
warnings on the overlapping opening spreadsheet and decorative outline text. Layout reports
56 informational findings on temporary reveals, intended overlays and screenshot cropping;
there are no held layout errors or warnings. This is a reviewed draft, not a claim that every
individual transition frame satisfies an accessibility audit.

The additional `appearsBy` motion audit ran too long and was interrupted. Its proposed assertions
are kept in `motion-review.reference.json`; they are not a passing test and do not run as part of
the standard gate.

## Approved render

The owner requested the export on 2026-10-11. Render completed successfully using the pinned
HyperFrames 0.8.145 CLI and `--fps 60 --quality high`.

- Output: `renders/spreadsheet-to-system-clone.mp4`, 50,677,748 bytes (48.3 MiB).
- ffprobe PASS: H.264, 1080 × 1920, 60/1 fps, 1,710 frames, 28.500 seconds; AAC audio, 28.500 seconds.
- Decode PASS: `ffmpeg -v error -i renders/spreadsheet-to-system-clone.mp4 -f null NUL` completed
  with no decode errors. A frame extracted at 27 seconds was visually reviewed.
- Pipeline: screenshot capture, hardware GPU; render completed in 2m 3.5s.

Editable Studio preview remains available; this export does not publish the video or website.

The copied assets still need the owner's publication/permission review before launch, as in
the original brief. Audience and link-in-bio CTA await refinement with the owner.

Root website build/tests are not relevant to this change: no website source or dependencies changed.
Root AGENTS.md received the clone changelog entry. Clone metadata, composition, brief and storyboard
changed; root lockfiles were not edited.
