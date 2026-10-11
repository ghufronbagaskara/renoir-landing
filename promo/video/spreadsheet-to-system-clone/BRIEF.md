---
workflow: product-launch-video
flow: companion
storyboard: no
message: "Renoir: four services, from design through launch and care"
destination: instagram-story
aspect: "9:16"
canvas: 1080x1920
length: 28.5s
fps: 60
language: mixed (English headlines, Indonesian detail)
audience: Indonesian business owners and operations leads (inherited; awaiting refinement)
cta: "Ceritakan masalahnya · Link di bio"
status: render-approved
source: ../spreadsheet-to-system
---

# Renoir studio profile clone

The owner requested a separate clone, then selected **Renoir's profile and four services** as its focus.
The original project's composition, exports, caches and history stay independent.

Retain the spreadsheet hook, original 28.5-second music excerpt, Joint transitions, brand lockup,
website phone capture and CTA. Replace the eight-second order walkthrough and simultaneous service
grid with four consecutive, larger service frames. Introduce Renoir before those frames.

Each service has approximately three seconds: entrance, readable hold, exit. Screenshots remain
real founder work from the source assets. They demonstrate work, not quantified client outcomes.
Deployment is explicitly a service-scope illustration; it makes no live uptime or server-health claim.

Audience and CTA inherit the source until the owner refines them. No final domain is invented.
Keep public asset/permission approval as a launch prerequisite, as recorded in the root AGENTS.md.

## Preview and export

Use Bun to run the pinned CLI (0.8.145). Run `bun run check`, then
`bunx hyperframes@0.8.145 preview --background --port 3017`.
The owner approved the MP4 export on 2026-10-11. Render at 60 fps with the pinned CLI:
`bunx hyperframes@0.8.145 render --fps 60 --quality high --output renders/spreadsheet-to-system-clone.mp4`.
The editable preview remains available for subsequent revisions.

Current timing and visual decisions: `STORYBOARD-clone.md`. The copied `STORYBOARD-v2.md` is source
reference, not approval of this clone.

