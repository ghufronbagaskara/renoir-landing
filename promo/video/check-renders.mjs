import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const videos = [
  ["spreadsheet-to-system/index.html", "spreadsheet-to-system/renders/katalhys-spreadsheet-to-system-60fps.mp4", 28.5],
  ["spreadsheet-to-system-clone/index.html", "spreadsheet-to-system-clone/renders/katalhys-four-services-60fps.mp4", 28.5],
  ["delivered-running/index.html", "delivered-running/renders/katalhys-delivered-running-60fps.mp4", 27],
  ["studio-overview/source/katalhys-promo.jsx", "studio-overview/renders/katalhys-studio-overview-60fps.mp4", 25.5],
  ["spreadsheet-to-system/archive/index-v1.html", "spreadsheet-to-system/renders/katalhys-spreadsheet-to-system-v1-60fps.mp4", 22],
];
const results = [];
for (const [source, output, duration] of videos) {
  const text = fs.readFileSync(join(root, source), "utf8");
  assert.match(text, /Katalhys/, source);
  assert.doesNotMatch(text, /renoir|viewBox="0 0 66 64"|M27 11 43 2/iu, source);
  const file = join(root, output);
  assert.ok(fs.statSync(file).size > 100_000, output);
  const probe = spawnSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", file], { encoding: "utf8" });
  assert.equal(probe.status, 0, probe.stderr);
  const meta = JSON.parse(probe.stdout);
  const video = meta.streams.find(s => s.codec_type === "video");
  const audio = meta.streams.find(s => s.codec_type === "audio");
  assert.ok(video && audio, output + ": video and audio required");
  assert.deepEqual([video.codec_name, video.width, video.height, video.pix_fmt], ["h264", 1080, 1920, "yuv420p"], output);
  const [n, d] = video.avg_frame_rate.split("/").map(Number);
  assert.equal(n / d, 60, output);
  assert.equal(Number(video.nb_frames), duration * 60, output);
  assert.ok(Math.abs(Number(meta.format.duration) - duration) < 0.1, output);
  assert.equal(audio.codec_name, "aac", output);
  const decode = spawnSync("ffmpeg", ["-v", "error", "-i", file, "-f", "null", "-"], { encoding: "utf8", maxBuffer: 10_000_000 });
  assert.equal(decode.status, 0, decode.stderr);
  assert.equal(decode.stderr.trim(), "", output + ": decoding errors");
  results.push({ output, seconds: Number(meta.format.duration), width: video.width, height: video.height, fps: n / d, frames: Number(video.nb_frames), video: video.codec_name, audio: audio.codec_name, bytes: fs.statSync(file).size, decode: "passed" });
  console.log("PASS", output);
}
fs.mkdirSync(join(root, "renders"), { recursive: true });
fs.writeFileSync(join(root, "renders/verification.json"), JSON.stringify({ checkedAt: new Date().toISOString(), videos: results }, null, 2) + "\n");
console.log("All five rebranded MP4s passed source, metadata and full-file decoding checks");
