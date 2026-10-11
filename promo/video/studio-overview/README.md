# Studio overview — 60 fps render of the Claude Design promo

`source/` is the unmodified Claude Design export ("Video promo website Renoir.zip"), except
`motionEditor` is set to `false` in `Renoir Promo.dc.html`. Nine scenes, 25.5 s, 1080×1920:
Hook → Team → four services → Work → Process → Start.

Claude Design's own download gives 30 fps and no audio. `render-60fps.mjs` renders it again:

1. serves `source/` over a local HTTP server (the runtime fetches the `.jsx` files),
2. opens it in headless Chromium (Playwright from the repo), removes the fit-to-window scale,
3. seeks every frame through the design's own export event (`data-om-seek-to-time-frame`, `sync: true`),
   so frame *n* is the exact render at `n / fps`,
4. pipes PNG frames into FFmpeg with `source/renoir-music-v2.wav`
   (H.264 High, CRF 16, yuv420p, AAC 256k, loudness normalised to −14 LUFS, 0.6 s fade-out).

```bash
node render-60fps.mjs                 # renders/renoir-studio-overview-60fps.mp4 (~4 min)
node render-60fps.mjs --fps 30        # any other frame rate
node render-60fps.mjs --from 8 --to 12 --out renders/clip.mp4   # a range, for quick checks
```

Needs network on first run: the runtime loads React/Babel from unpkg and fonts from Fontshare/Google Fonts.

Music: `renoir-music-v2.wav` is synthesised by `source/renoir-music-gen.js` (original procedural score,
no third-party recordings).
