# Carousel enhancement review

Audience: owners of established businesses evaluating a digital studio. Direction: Renoir's existing
General Sans/Inter typography, The Joint mark, paper/ink/cobalt palette. ENERGY 3 / RHYTHM 2 / MOTION 1
(static exported images). Headlines establish the focal point; proof, diagrams and captions follow.

## What changed and why

- Post 1 introduces the studio with a real operations screenshot, then shows four distinct service
  illustrations. An ownership receipt and example inquiry make the offer concrete.
- Post 2 connects the founder's existing systems experience to website structure, handover and project
  responsibility. Copy describes the studio's approach without claiming every vendor fails.
- Post 3 gives original project screens their own frames. Desktop and mobile no longer overlap; the
  catalogue crop shows categories instead of an oversized page banner. Concept diagrams are labeled
  separately from project evidence. The fake monitoring status/chart is removed.
- At the owner's request on 2026-10-12, original English headlines and Indonesian main copy/CTAs were
  restored from `.work-capture/instagram-before`. All 21 headings and three caption bodies were checked
  against that backup. Per-slide alt texts describe the enhanced images and restored headings.
  The owner's subsequent punctuation preference removes closing periods from headings and headline
  phrases while preserving their original words. Body paragraph punctuation is retained. The renderer
  now rejects closing periods in headings and CTA labels before export.
- SVG arrows explain dependencies and workflow. Document/check/warehouse/truck shapes explain order
  handling; browser/envelope explains inquiry; connected identity/interface shapes explain design;
  code/server/monitor/backup explains care. None of the diagrams claims actual project measurements.
- A four-service grid enables direct comparison. Other slides vary between screenshots, connected
  diagrams, a handover receipt and an example conversation. Whitespace separates these content roles.

## Validation

- PASS, hard gate: 21 JPEGs rendered at 1080 × 1350; image decoding and text bounds checked by
  `render.mjs`. All slides visually inspected in `preview-all.jpg`. Original project screenshots carry
  founder credits; order-system screenshot carries a simulated-data caption. No invented statistics,
  testimonials, terminal output or monitoring claims.
- PASS, purpose gate: illustrations explain the services listed above; arrows indicate connections;
  service cards compare four real services; type and colors preserve the existing brand. No decorative
  glow, gradients, glass panels or motion.
- PASS, liveliness: ENERGY 3 / RHYTHM 2 / MOTION 1; large headlines, alternating paper/ink/cobalt,
  the repeated Joint mark and varied diagram/proof/receipt compositions support those settings.
- PASS, craft: all 21 slides inspected; diagram and screenshot roles labeled; caption and alt text
  rewritten for each post; renderer rejects missing images and overflowing text. Poster CTA is printed
  copy directing readers to the bio, not an interactive web control.

Primary colors: ink on paper ≈16.4:1, muted on paper ≈6.3:1, white on cobalt ≈6.7:1;
white on ink ≈17.6:1. Embedded project screenshots retain their source typography/colors and function as
supporting evidence rather than required slide copy.

## Remaining limits

The owner-requested copy restoration retains the enhanced SVGs and project frames. Only line wrapping,
the case cover/result sizing, footer counters and CTA contrast were adjusted to fit the original text.
All 21 JPEGs and combined previews were regenerated after restoration. Hard/purpose/liveliness/craft
gate: PASS with the same brand direction, explicit owner-approved voice, existing asset roles, renderer
text/font/image checks and final contact-sheet inspection. Website production code did not change in
this restoration.

No Instagram upload or account changes performed. Physical-device reading and Instagram recompression
are not tested. Ensure the account bio leads to Renoir's contact destination before posting. Source
screenshots retain their original customer brand; publication permissions remain the owner's existing
pre-launch check.
