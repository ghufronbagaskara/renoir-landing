// Render the Claude Design export in ./source to a 1080x1920 MP4 at any frame rate, with its music.
// Uses the design's own seek protocol ('data-om-seek-to-time-frame', sync) so every frame is the exact
// deterministic render at t = n / fps.
//
//   node render-60fps.mjs [--fps 60] [--out renders/renoir-studio-overview-60fps.mp4] [--from 0] [--to <dur>]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(join(here, "../../../package.json"))("playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = Number(arg("fps", 60));
const OUT = join(here, arg("out", `renders/renoir-studio-overview-${FPS}fps.mp4`));
const SRC = join(here, "source");
const MUSIC = join(SRC, "renoir-music-v2.wav");

// Static server for ./source (the runtime fetches the .jsx files, so file:// will not work).
const types = { ".html": "text/html", ".js": "text/javascript", ".jsx": "text/plain", ".wav": "audio/wav", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([\\/])+/, "");
  const file = join(SRC, path);
  if (!file.startsWith(SRC)) return res.writeHead(403).end();
  try { const body = await readFile(file); res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" }).end(body); }
  catch { res.writeHead(404).end(); }
}).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const url = `http://127.0.0.1:${server.address().port}/Renoir%20Promo.dc.html`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 2200 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
const STAGE = "svg[data-om-exportable-video-with-duration-secs]";
await page.waitForSelector(STAGE, { timeout: 120000 });
// Native size: drop the fit-to-window scale and the preview shadow.
await page.addStyleTag({ content: `${STAGE}{transform:none!important;box-shadow:none!important}` });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
});
await page.waitForFunction((s) => document.querySelector(s)?.hasAttribute("data-om-sync-seek"), STAGE, { timeout: 60000 });
const duration = Number(await page.$eval(STAGE, (el) => el.getAttribute("data-om-exportable-video-with-duration-secs")));
const from = Number(arg("from", 0)), to = Math.min(duration, Number(arg("to", duration)));
const box = await page.$eval(STAGE, (el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
if (Math.round(box.width) !== 1080 || Math.round(box.height) !== 1920) throw new Error("stage is not 1080x1920: " + JSON.stringify(box));

const frames = Math.round((to - from) * FPS);
console.log(`duration ${duration}s · rendering ${from}-${to}s · ${frames} frames @ ${FPS}fps → ${OUT}`);

const ff = spawn("ffmpeg", [
  "-v", "error", "-y",
  "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
  "-ss", String(from), "-i", MUSIC,
  "-map", "0:v", "-map", "1:a",
  "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", String(FPS),
  "-af", `loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st=${Math.max(0, to - from - 0.6)}:d=0.6`,
  "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
  "-t", String(to - from), "-movflags", "+faststart", OUT,
], { stdio: ["pipe", "inherit", "inherit"] });
const ffDone = new Promise((res, rej) => ff.on("close", (c) => (c ? rej(new Error("ffmpeg exit " + c)) : res())));

const t0 = Date.now();
for (let n = 0; n < frames; n++) {
  const t = from + n / FPS;
  await page.$eval(STAGE, (el, time) => {
    el.dispatchEvent(new CustomEvent("data-om-seek-to-time-frame", { detail: { time, sync: true, playing: false } }));
  }, t);
  const png = await page.screenshot({ type: "png", clip: box });
  if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
  if (n % FPS === 0) process.stdout.write(`\r${(t).toFixed(1)}s / ${to}s  ${((Date.now() - t0) / 1000).toFixed(0)}s elapsed`);
}
ff.stdin.end();
await ffDone;
await browser.close();
server.close();
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s → ${OUT}`);
