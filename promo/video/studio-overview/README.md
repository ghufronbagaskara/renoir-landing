# Katalhys studio overview

The Claude Design source has been adapted to current DESIGN.md and logo 09. Nine scenes, 25.5 s, 1080 × 1920, 60 fps: Hook → Team → four services → Work → Process → Start.

- Entry: `source/Katalhys Promo.dc.html`
- Composition: `source/katalhys-promo.jsx`
- Current logo SVGs, GeneralSans/Inter, and the existing React 18.3.1 / Babel 7.29.0 runtime are local.
- The four service scenes use current brand colors and AI-integrated internal-system positioning.
- The former social handle and development URL have been removed; the CTA uses Katalhys and Link di bio.
- The original procedural music is unchanged, now named `source/katalhys-music-v2.wav`; its generator is `source/katalhys-music-gen.js`.

```powershell
node render-60fps.mjs
node render-60fps.mjs --fps 30
node render-60fps.mjs --from 8 --to 12 --out renders/clip.mp4
```

The renderer serves source locally, opens installed Chrome through Playwright, waits for fonts/images, removes the preview scale, and seeks every exact frame through the composition's own export event. FFmpeg encodes H.264 High / CRF 16 / yuv420p and AAC 256 kbps, normalises audio to -14 LUFS, and fades its final 0.6 s.

Output: `renders/katalhys-studio-overview-60fps.mp4`. No network is required during rendering. See ../README.md for the five-video review page and verification command.
